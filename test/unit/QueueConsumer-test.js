/**
 * QueueConsumer test
 */
require('require-self-ref')

const test = require('ava')
const sinon = require('sinon')

const QueueConsumer = require('~/src/consumer/QueueConsumer')
const { EventEmitter } = require('events')

class MockChannel extends EventEmitter {
  assertQueue (queueName, options) {
    return Promise.resolve()
  }

  consume (queueName, onMessage) {
    this.on('test-message', (testMessage) => {
      onMessage(testMessage)
    })
  }
}

class MockConnection extends EventEmitter {
  constructor (channel) {
    super()
    this._mockChannel = channel
  }

  createChannel () {
    return Promise.resolve(this._mockChannel)
  }
}

const testQueueName = 'some-queue'

test('should generate a _consumerTag based off of the queue name', (t) => {
  const channel = new MockChannel()
  const consumer = new QueueConsumer(testQueueName, new MockConnection(channel))
  const consumerTag = consumer._consumerTag

  t.true(consumerTag !== null)
  t.true(consumerTag.startsWith(testQueueName))
})

/**
 * Starting the queue consumer
 */
test('should should create a channel using the given connection', async (t) => {
  const testQueueName = 'some-queue'
  const channel = new MockChannel()
  const connection = new MockConnection(channel)
  const mock = sinon.mock(connection)
  const consumer = new QueueConsumer(testQueueName, connection)

  mock.expects('createChannel').once()
    .returns(channel)

  await consumer.start()

  mock.verify()
  t.is(consumer._channel, connection._mockChannel)
})

test('should perform an assertion on the queue', async (t) => {
  const channel = new MockChannel()
  const mock = sinon.mock(channel)

  mock.expects('assertQueue').once()
    .withArgs(testQueueName, { durable: true })

  const connection = new MockConnection(channel)
  const consumer = new QueueConsumer(testQueueName, connection)

  await consumer.start()

  mock.verify()
  t.pass()
})

test('should begin consuming from the queue', async (t) => {
  const channel = new MockChannel()
  const mock = sinon.mock(channel)
  const connection = new MockConnection(channel)
  const consumer = new QueueConsumer(testQueueName, connection)

  mock.expects('consume').once()
    .withArgs(testQueueName)

  await consumer.start()

  mock.verify()
  t.pass()
})

test('should emit a message if a message is consumed', async (t) => {
  const channel = new MockChannel()
  const connection = new MockConnection(channel)
  const consumer = new QueueConsumer(testQueueName, connection)

  const messagePromise = new Promise((resolve) => {
    consumer.once('message', (message) => {
      resolve(message)
    })
  })

  await consumer.start()

  const testMessage = { msg: 'foo' }

  channel.emit('test-message', testMessage)
  let receivedMessage = await messagePromise

  t.is(receivedMessage, testMessage)
})

test('should fail to consume if a channel cannot be made', async (t) => {
  const channel = new MockChannel()
  const connection = new MockConnection(channel)
  const mock = sinon.mock(connection)
  const channelError = new Error('channel error')

  const consumer = new QueueConsumer(testQueueName, connection)

  mock.expects('createChannel').once()
    .throws(channelError)

  try {
    await consumer.start()
    t.fail()
  } catch (err) {
    t.is(err, channelError)
  }
})

test('should fail to consume if a queue assertion fails', async (t) => {
  const channel = new MockChannel()
  const connection = new MockConnection(channel)
  const mock = sinon.mock(channel)
  const queueError = new Error('queue error')

  const consumer = new QueueConsumer(testQueueName, connection)

  mock.expects('assertQueue').once()
    .throws(queueError)

  try {
    await consumer.start()
    t.fail()
  } catch (err) {
    t.is(err, queueError)
  }
})

test('should emit an error event if the channel emits an error', async (t) => {
  const channel = new MockChannel()
  const connection = new MockConnection(channel)
  const consumer = new QueueConsumer(testQueueName, connection)
  const testError = new Error('test')

  const errorPromise = new Promise((resolve) => {
    consumer.once('error', (error) => {
      resolve(error)
    })
  })

  await consumer.start()

  channel.emit('error', testError)
  let error = await errorPromise

  t.is(error, testError)
})

test('should emit an error event if the connection emits an error', async (t) => {
  const channel = new MockChannel()
  const connection = new MockConnection(channel)
  const consumer = new QueueConsumer(testQueueName, connection)
  const testError = new Error('test')

  const errorPromise = new Promise((resolve) => {
    consumer.once('error', (error) => {
      resolve(error)
    })
  })

  await consumer.start()

  channel.emit('error', testError)
  let error = await errorPromise

  t.is(error, testError)
})

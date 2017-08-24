require('require-self-ref')
const test = require('ava')

const config = require('~/src/config')
config.load()

const sinon = require('sinon')
const proxyquire = require('proxyquire')
proxyquire.noPreserveCache()

const { createProducer } = require('windbreaker-service-util/queue')

const Event = require('windbreaker-service-util/models/events/Event')
const EventType = require('windbreaker-service-util/models/events/EventType')

const waitForEvent = require('windbreaker-service-util/test/util/waitForEvent')

test.beforeEach('initialize consumers and producers', async (t) => {
  const sandbox = sinon.sandbox.create()
  const githubPushSpy = sandbox.spy()

  const messageHandler = proxyquire('~/src/messages', {
    '~/src/util/getEventHandlers': () => {
      return {
        'github-push': githubPushSpy
      }
    }
  })

  const consumers = proxyquire('~/src/consumers', {
    '~/src/messages': messageHandler
  })

  const { eventConsumer, workConsumer } = await consumers.initialize()

  const eventProducer = await createProducer({
    logger: console,
    amqUrl: config.getAmqUrl(),
    producerOptions: {
      queueName: config.getEventsQueueName()
    }
  })

  t.context = {
    githubPushSpy,
    eventConsumer,
    workConsumer,
    eventProducer,
    sandbox
  }
})

test.afterEach('teardown test environment', async (t) => {
  const {
    eventConsumer,
    workConsumer,
    eventProducer,
    sandbox
  } = t.context

  await eventConsumer.stop()
  await workConsumer.stop()

  await eventProducer.stop()

  sandbox.restore()
})

test('should be able to pass messages to the correct message handlers', async (t) => {
  const {
    githubPushSpy,
    eventConsumer,
    eventProducer,
    sandbox
  } = t.context

  const simpleConsumer = eventConsumer.getConsumer()

  const event = new Event({
    type: EventType.GITHUB_PUSH,
    data: {
      compare: 'some string'
    }
  })

  const messagePromise = waitForEvent(simpleConsumer, 'message')
  await eventProducer.sendMessage(event)

  await messagePromise

  // validate that github push stub was called
  sandbox.assert.calledOnce(githubPushSpy)

  t.pass()
})
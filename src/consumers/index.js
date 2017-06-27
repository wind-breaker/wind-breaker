const config = require('~/src/config')
const logger = require('~/src/logging').logger(module)
const ManagedConsumer = require('windbreaker-service-util/queue/ManagedConsumer')

const EVENTS_QUEUE_NAME = config.getEventsQueueName()
const EVENTS_QUEUE_PREFETCH_COUNT = config.getEventsQueuePrefetchCount()
const WORK_QUEUE_NAME = config.getWorkQueueName()
const WORK_QUEUE_PREFETCH_COUNT = config.getWorkQueuePrefetchCount()
const CONSUMER_RECONNECT_TIMEOUT = config.getConsumerReconnectTimeout()

exports.initialize = async function () {
  const amqUrl = config.getAmqUrl()

  const eventsConsumer = new ManagedConsumer({
    amqUrl,
    logger,
    restartConsumer: true,
    reconnectTimeout: CONSUMER_RECONNECT_TIMEOUT,
    consumerOptions: {
      queueName: EVENTS_QUEUE_NAME,
      prefetchCount: EVENTS_QUEUE_PREFETCH_COUNT
    },
    async onMessage (message) {
      // TODO: Handle the message
      await Promise.resolve()
    }
  })

  const workConsumer = new ManagedConsumer({
    amqUrl,
    logger,
    restartConsumer: true,
    reconnectTimeout: CONSUMER_RECONNECT_TIMEOUT,
    consumerOptions: {
      queueName: WORK_QUEUE_NAME,
      prefetchCount: WORK_QUEUE_PREFETCH_COUNT
    },
    async onMessage (message) {
      // TODO: Handle the message
      await Promise.resolve()
    }
  })

  // In the future, we may want fine control over the consumer instances
  // eventsConsumer.on('consumer-restarted', (simpleConsumer) => {
  //  // handle new consumer
  // })
  //
  // we may also handle situations where we fail to create consumers
  // (possibly kill process and allow server to reset)
  // eventsConsumer.on('consumer-restart-failed', (err) => {
  //  // handle restart failure
  // })

  // Create events queue consumer
  await eventsConsumer.start()

  // Create events queue consumer
  await workConsumer.start()
}

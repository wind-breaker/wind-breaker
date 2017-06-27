const config = require('~/src/config')
const logger = require('~/src/logging').logger(module)
const queueUtil = require('windbreaker-service-util/queue')

const EVENTS_QUEUE_NAME = config.getEventsQueueName()
const EVENTS_QUEUE_PREFETCH_COUNT = config.getEventsQueuePrefetchCount()
const WORK_QUEUE_NAME = config.getWorkQueueName()
const WORK_QUEUE_PREFETCH_COUNT = config.getWorkQueuePrefetchCount()
const CONSUMER_RECONNECT_TIMEOUT = config.getConsumerReconnectTimeout()

exports.initialize = async function () {
  const amqUrl = config.getAmqUrl()

  // returns a managed consumer instance
  await queueUtil.createManagedConsumer({
    amqUrl,
    logger,
    restart: true,
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

  await queueUtil.createManagedConsumer({
    amqUrl,
    logger,
    restart: true,
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
  // managedConsumer.on('consumer-restarted', (simpleConsumer) => {
  //  // handle new consumer
  // })
  //
  // we may also handle situations where we fail to create consumers
  // (possibly kill process and allow server to reset)
  // managedConsumer.on('consumer-restart-failed', (err) => {
  //  // handle restart failure
  // })
}

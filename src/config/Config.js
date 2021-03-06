// config model
const BaseConfig = require('windbreaker-service-util/models/BaseServiceConfig')
const DefaultsMixin = require('fashion-model-defaults')
const KnexConfig = require('windbreaker-service-util/models/dao/KnexConfig')

module.exports = BaseConfig.extend({
  mixins: [ DefaultsMixin ],

  properties: {
    httpServerPort: {
      description: 'Port to run the hooks HTTP server port on',
      type: Number,
      default: 8080
    },
    amqUrl: {
      description: 'The url used to access activeMQ',
      default: 'amqp://localhost'
    },

    eventsQueueName: {
      description: 'The name of the queue in which events are published on',
      default: 'events'
    },

    workQueueName: {
      description: 'The name of the queue in which work is placed',
      default: 'work'
    },

    eventsQueuePrefetchCount: {
      description: 'The max number of unacknowledged events to pull ' +
        'for the events queue',
      default: 10
    },

    workQueuePrefetchCount: {
      description: 'The max number of unacknowledged events to pull ' +
        'for the work queue',
      default: 10
    },

    consumerReconnectTimeout: {
      description: 'The amount of time to wait before attempting a reconnect (in ms)',
      default: 10000
    },

    knex: KnexConfig,

    githubPrivateKeyPath: {
      description: 'Absolute path to github private key file',
      default: '.secrets/windbreaker-github-private-key.pem'
    },

    githubUrl: {
      description: 'Github API URL',
      default: 'https://api.github.com'
    },

    userAgent: {
      description: 'windbreaker User-Agent to use when making API calls',
      default: 'Windbreaker'
    }
  }
})

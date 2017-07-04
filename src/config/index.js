const registerConfig = require('windbreaker-service-util/config')

const Config = require('./Config')
const config = module.exports = new Config()

registerConfig(config, [
  { amqUrl: `amqp://localhost:${process.env.AMQ_PORT || 5672}` }
])

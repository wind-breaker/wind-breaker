const getPortSync = require('get-port-sync')

exports.register = function ({ test, context, startupTasks, server }) {
  let httpServerPort

  try {
    console.log('Attempting to obtain a random port to start the test HTTP server on...')
    httpServerPort = getPortSync()
    console.log('Successfully obtained port: ', httpServerPort)

    if (context) context.httpServerPort = httpServerPort
  } catch (err) {
    console.error('Could not get random port: ', err)
    throw err
  }

  test.before(async (t) => {
    console.log('Attempting to start test server...')
    await server.start([{ httpServerPort }])
    console.log('Successfully started test server')
  })

  test.after(async () => {
    await startupTasks.stopAll()
  })
}

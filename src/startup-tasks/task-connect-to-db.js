const daos = [
  require('../dao/github/installation'),
  require('../dao/github/repository'),
  require('../dao/dependency/npm')
]

module.exports = {
  start () {
    return Promise.all(daos.map((dao) => dao.createDao()))
  },
  stop () {
    return Promise.all(daos.map((dao) => dao.close()))
  }
}

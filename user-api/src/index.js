const {
  create,
  list,
  getByEmail,
  getById,
  update,
  userDelete
} = require('./user')
const { log } = require('./log')

const wrap = (fn) => (event, context, callback) => 
  fn(event, context)
    .then(x => {
      log(x)
      callback(null, x)
    })
    .catch(error => { 
      log({ error: error.message })
      callback(null, Object.assign({
        statusCode: error.statusCode || 500,
        headers: {
          'Content-Type': 'text/plain'
        },
        body: `Couldn't perform ${fn.name}`
      }, error))
    })

module.exports = {
  userCreate: wrap(create),
  userList: wrap(list),
  userGetByEmail: wrap(getByEmail),
  userGetById: wrap(getById),
  userUpdate: wrap(update),
  userDelete: wrap(userDelete)
}

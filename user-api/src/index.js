const {
  create,
  list,
  getByEmail,
  getById,
  update,
  userDelete
} = require('./user')

module.exports = {
  userCreate: create,
  userList: list,
  userGetByEmail: getByEmail,
  userGetById: getById,
  userUpdate: update,
  userDelete
}

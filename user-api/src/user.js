const { uuid } = require('uuid')
const { DynamoDB } = require('aws-sdk')
const { log } = require('./log')
const dynamoDb = DynamoDB.DocumentClient()

const create = (event, context, callback) => {
  log({
    event,
    msg: 'user.create execution'
  })
}

const list = (event, context, callback) => {
  log({
    event,
    msg: 'user.list execution'
  })
}

const getByEmail = (event, context, callback) => {
  log({
    event,
    msg: 'user.get execution'
  })
}


const getById = (event, context, callback) => {
  log({
    event,
    msg: 'user.get execution'
  })
}

const update = (event, context, callback) => {
  log({
    event,
    msg: 'user.update execution'
  })
}

const userDelete = (event, context, callback) => {
  log({
    event,
    msg: 'user.userDelete execution'
  })
}


module.exports = {
  create,
  list,
  getByEmail,
  getById,
  update,
  userDelete
}

const uuid = require('uuid/v1')
const AWS = require('aws-sdk')
const { log } = require('./log')
const { has, omit } = require('lodash')

function sanitize (data) {
  return Array.from([ 'email', 'login', 'login.username' ])
    .map(x => {
      if (!has(data, x)) {
        log({ msg: `validation failed, missing ${x}` })
        return {
          statusCode: 400,
          headers: {
            'Content-Type': 'text/plain' 
          },
          body: `Couldn't create user item: ${x} if required`
        }
      }
      return undefined
    })
    .filter(x => x)
}

const userCreate = async (event, _, __) => {
  log({
    event,
    msg: 'userCreate execution'
  })
  const data = JSON.parse(event.body)
  log({ data, msg: 'parsed event body' })
  const errors = sanitize(data)
  if (errors.length > 0) {
    return errors[0]
  }
  const timestamp = new Date().toISOString()
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: {
      id: {
        S: uuid()
      },
      email: {
        S: data.email
      },
      username: {
        S: data.login.username
      },
      login: {
        S: JSON.stringify(data.login)
      },
      payload: {
        S: JSON.stringify(omit(data, ['login', 'email']))
      },
      createdAt: {
        S: timestamp
      },
      updatedAt: {
        S: timestamp
      }
    }
  }
  log({ 
    params,
    msg: 'calling putItem' 
  })
  const dynamoDb = new AWS.DynamoDB()
  await dynamoDb.putItem(params).promise()
  log({ msg: 'got data from putItem' })
  return {
    statusCode: 200,
    body: JSON.stringify({
      Item: params.Item
    })
  }
}

const userList = async (event, context, callback) => {
  log({
    event,
    msg: 'userList execution'
  })
  const params = {
    TableName: process.env.DYNAMODB_TABLE
  }
  log({ msg: 'calling scan' })
  const dynamoDb = new AWS.DynamoDB()
  const data = await dynamoDb.scan(params).promise()
  return {
    statusCode: 200,
    body: JSON.stringify({
      data
    })
  }
}

const userGetByEmail = async (event, context, callback) => {
  log({
    event,
    msg: 'userGetByEmail execution'
  })
  return {
    statusCode: 200,
    body: JSON.stringify({
      nothing: 'nada'
    })
  }
}


const userGetById = async (event, context, callback) => {
  log({
    event,
    msg: 'userGetById execution'
  })
  return {
    statusCode: 200,
    body: JSON.stringify({
      nothing: 'nada'
    })
  }
}

const userUpdate = async (event, context, callback) => {
  log({
    event,
    msg: 'userUpdate execution'
  })
  return {
    statusCode: 200,
    body: JSON.stringify({
      nothing: 'nada'
    })
  }
}

const userDelete = async (event, context, callback) => {
  log({
    event,
    msg: 'userDelete execution'
  })
  return {
    statusCode: 200,
    body: JSON.stringify({
      nothing: 'nada'
    })
  }
}


module.exports = {
  userCreate,
  userList,
  userGetByEmail,
  userGetById,
  userUpdate,
  userDelete
}

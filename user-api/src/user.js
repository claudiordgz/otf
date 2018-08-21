const uuid = require('uuid/v1')
const AWS = require('aws-sdk')
const { log } = require('./log')
const { has, omit } = require('lodash')
const { dynamoObjToModel } = require('./dynamoObjToModel')

function sanityCheck (data) {
  return Array.from([ 'email', 'login.uuid', 'login.username', 'id' ])
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

function sanitizePayload (payload) {
  return omit(payload, ['login', 'email', 'id'])
}

const userCreate = async (event) => {
  log({
    event,
    msg: 'userCreate execution'
  })
  const data = JSON.parse(event.body)
  log({ data, msg: 'parsed event body' })
  const errors = sanityCheck(data)
  if (errors.length > 0) {
    return errors[0]
  }
  const timestamp = new Date().toISOString()
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: {
      id: {
        S: data.login.uuid
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
      ssn: {
        S: JSON.stringify(data.id)
      },
      payload: {
        S: JSON.stringify(sanitizePayload(data))
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
      results: dynamoObjToModel(params.Item)
    })
  }
}

const userList = async (event) => {
  log({
    event,
    msg: 'userList execution'
  })
  let params = {
    TableName: process.env.DYNAMODB_TABLE
  }
  if (event.queryStringParameters !== null) {
    const { nextToken, results } = event.queryStringParameters
    params = Object.assign({ Limit: results || 10 }, params)
    if (nextToken !== undefined) {
      params = Object.assign({
        ExclusiveStartKey: {
          id: {
            S: nextToken 
          }
        }
      }, params)
    } 
  } else {
    params = Object.assign({ Limit: 10 }, params)
  }
  log({ params, msg: 'calling scan' })
  const dynamoDb = new AWS.DynamoDB()
  const data = await dynamoDb.scan(params).promise()
  log({ msg: 'got data from scan', data })
  const payload = omit(data, ['LastEvaluatedKey']).Items.map(dynamoObjToModel)
  return {
    statusCode: 200,
    body: JSON.stringify({
      results: payload,
      nextToken: data.LastEvaluatedKey
    })
  }
}

const userGetById = async (event) => {
  log({
    event,
    msg: 'userGetById execution'
  })
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      id: {
        S: event.pathParameters.id
      }
    }
  }
  log({ 
    params,
    msg: 'calling getItem' 
  })
  const dynamoDb = new AWS.DynamoDB()
  const item = await dynamoDb.getItem(params).promise()
  log({ msg: 'got data from getItem', item })
  return {
    statusCode: 200,
    body: JSON.stringify({
      results: dynamoObjToModel(item.Item)
    })
  }
}

const userUpdate = async (event) => {
  log({
    event,
    msg: 'userUpdate execution'
  })
  const data = JSON.parse(event.body)
  log({ data, msg: 'parsed event body' })
  const errors = sanityCheck(data)
  if (errors.length > 0) {
    return errors[0]
  }
  const timestamp = new Date().toISOString()
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      id: {
        S: event.pathParameters.id
      }
    },
    ExpressionAttributeValues: {
      ":email": {
        S: data.email
      },
      ":username": {
        S: data.login.username
      },
      ":login": {
        S: JSON.stringify(data.login)
      },
      ":ssn": {
        S: JSON.stringify(data.id)
      },
      ":payload": {
        S: JSON.stringify(sanitizePayload(data))
      },
      ":updatedAt": {
        S: timestamp
      }
    },
    UpdateExpression: "set email = :email, username=:username, login=:login, payload=:payload, updatedAt=:updatedAt, ssn=:ssn",
    ReturnValues: 'ALL_NEW'
  }
  log({ 
    params,
    msg: 'calling updateItem' 
  })
  const dynamoDb = new AWS.DynamoDB()
  const item = await dynamoDb.updateItem(params).promise()
  log({ msg: 'got data from updateItem', item })
  return {
    statusCode: 200,
    body: JSON.stringify({
      results: dynamoObjToModel(item.Attributes)
    })
  }
}

const userDelete = async (event) => {
  log({
    event,
    msg: 'userDelete execution'
  })
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      id: {
        S: event.pathParameters.id
      }
    }
  }
  log({ 
    params,
    msg: 'calling deleteItem' 
  })
  const dynamoDb = new AWS.DynamoDB()
  const item = await dynamoDb.deleteItem(params).promise()
  log({ msg: 'got data from deleteItem', item })
  return {
    statusCode: 200,
    body: JSON.stringify({
      id: event.pathParameters.id
    })
  }
}


module.exports = {
  userCreate,
  userList,
  userGetById,
  userUpdate,
  userDelete
}

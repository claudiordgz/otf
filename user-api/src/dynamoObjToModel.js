const { omit } = require('lodash')
/*
payload: {
  S: "{}"
  },
  login: {
  S: "{"username":"somename"}"
  },
  updatedAt: {
  S: "2018-08-21T11:37:34.752Z"
  },
  createdAt: {
  S: "2018-08-21T11:37:34.752Z"
  },
  username: {
  S: "somename"
  },
  id: {
  S: "98f09200-a536-11e8-a022-c96b2c9c729e"
  },
  email: {
  S: "someemail@gmail.com"
  }
}
*/
function dynamoObjToModel (dynamoObj) {
  const ssn = {
    ssn: JSON.parse(dynamoObj.ssn.S)
  }
  const payload = JSON.parse(dynamoObj.payload.S)
  const login = {
    login: JSON.parse(dynamoObj.login.S)
  }
  const username = dynamoObj.username.S
  const id = dynamoObj.id.S
  const email = dynamoObj.email.S
  return Object.assign({}, payload, login, ssn, {
    username,
    id,
    email
  })
}

module.exports = {
  dynamoObjToModel
}

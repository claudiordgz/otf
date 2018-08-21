const { dynamoObjToModel } = require('./dynamoObjToModel')
const { omit } = require('lodash')

describe('dynamoObjToModel', () => {
  it('should return expected', () => {
    const expected = {"username":"bigpeacock170", "id": "98f09200-a536-11e8-a022-c96b2c9c729e","gender":"male","name":{"title":"mr","first":"karl","last":"johnson"},"location":{"street":"6057 avondale ave","city":"new orleans","state":"new york","postcode":12564,"coordinates":{"latitude":"88.9222","longitude":"-82.9558"},"timezone":{"offset":"+3:00","description":"Baghdad, Riyadh, Moscow, St. Petersburg"}},"email":"karl.johnson@example.com","login":{"uuid":"97890990-7bf2-469d-981c-16a10ae5307f","password":"lovelove","salt":"DS9jzK3v","md5":"d178a789477ccccbeef8325d7adc9b00","sha1":"5142bc1cb4ccc642cd4bc45ce5fa07dee8228129","sha256":"ac13d6d88577caa64fad78c599ffac70dcf5d3ded1fcceeb33b6b0b0fe9d9250"},"dob":{"date":"1965-05-31T13:27:36Z","age":53},"registered":{"date":"2012-06-11T09:48:43Z","age":6},"phone":"(068)-320-4900","cell":"(476)-843-3163","ssn":{"name":"SSN","value":"557-48-8854"},"picture":{"large":"https://randomuser.me/api/portraits/men/6.jpg","medium":"https://randomuser.me/api/portraits/med/men/6.jpg","thumbnail":"https://randomuser.me/api/portraits/thumb/men/6.jpg"},"nat":"US"}
    const login = omit(expected.login, 'username')
    const payload = omit(expected, [ 'ssn', 'id', 'login' ])
    const dynamo = {
      payload: {
        S: JSON.stringify(payload)
      },
      ssn: {
        S: JSON.stringify(expected.ssn)
      },
      login: {
        S: JSON.stringify(login)
      },
      updatedAt: {
      S: "2018-08-21T11:37:34.752Z"
      },
      createdAt: {
      S: "2018-08-21T11:37:34.752Z"
      },
      username: {
        S: expected.username
      },
      id: {
        S: "98f09200-a536-11e8-a022-c96b2c9c729e"
      },
      email: {
        S: expected.email
      }
    }
    const received = dynamoObjToModel(dynamo)
    expect(received).toEqual(expected)
  })
})

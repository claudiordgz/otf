const AWS = require('aws-sdk')
const { userCreate, userList, userGetById, userDelete, userUpdate } = require('./user')

const mockItem = { Item: {
    ssn: {
      S: '{}'
    },
    payload: {
      S: '{}'
    },
    login: {
      S: '{}'
    },
    username: {
      S: ''
    },
    email: {
      S: ''
    },
    id: {
      S: ''
    }
  }
}

beforeAll(() => {
  process.env.DYNAMODB_TABLE = 'some-table'
  process.env.AWS_DEFAULT_REGION = 'us-east-1'
})

jest.mock('./log', () => ({ log: () => undefined }))

describe('userCreate', () => {
  it('calls dynamo with TableName and Item', async () => {
    const dynamock = jest.spyOn(AWS, 'DynamoDB')
    dynamock.mockImplementation(function () {
      return {
        putItem: (params) => {
          expect(params).toHaveProperty('TableName')
          expect(params).toHaveProperty('Item')
          return {
            promise: () => Promise.resolve(true)
          }
        }
      }
    })
    await userCreate({ body: JSON.stringify({
      login: {
        username: "s",
        uuid: "some-uuid"
      },
      id: {
        some: 'id'
      },
      email: "s"
    }) }, null, null)
  })

  it('returns 400 if missing email', async () => {
    const p = await userCreate({ body: JSON.stringify({
      login: {
        username: "s",
        uuid: "some-uuid"
      },
      id: {
        some: 'id'
      }
    }) }, null, null)
    expect(p).toHaveProperty('statusCode')
    expect(p).toHaveProperty('body')
    expect(p.statusCode).toBe(400)
    expect(p.body).toContain('email')
  })

  it('returns 400 if missing username', async () => {
    const p = await userCreate({ body: JSON.stringify({
      login: {
        uuid: 'some-uuid'
      },
      id: {
        some: 'id'
      },
      email: "s"
    }) }, null, null)
    expect(p).toHaveProperty('statusCode')
    expect(p).toHaveProperty('body')
    expect(p.statusCode).toBe(400)
    expect(p.body).toContain('username')
  })

  it('throws error if putItem fails', async () => {
    const dynamock = jest.spyOn(AWS, 'DynamoDB')
    dynamock.mockImplementation(function () {
      return {
        putItem: (params) => {
          expect(params).toHaveProperty('TableName')
          expect(params).toHaveProperty('Item')
          return {
            promise: () => Promise.reject(new Error('mock error'))
          }
        }
      }
    })
    await expect(userCreate({ body: JSON.stringify({
      login: {
        username: "s",
        uuid: "some-uuid"
      },
      id: {
        some: 'id'
      },
      email: "s"
    }) }, null, null)).rejects.toThrow(new Error('mock error'))
  })

  it('returns 200 with item inserted', async () => {
    const dynamock = jest.spyOn(AWS, 'DynamoDB')
    dynamock.mockImplementation(function () {
      return {
        putItem: (params) => {
          expect(params).toHaveProperty('TableName')
          expect(params).toHaveProperty('Item')
          return {
            promise: () => Promise.resolve(true)
          }
        }
      }
    })
    const p = await userCreate({ body: JSON.stringify({
      login: {
        username: "s",
        uuid: "some-uuid"
      },
      id: {
        some: 'id'
      },
      email: "s"
    }) }, null, null)
    expect(p).toHaveProperty('statusCode')
    expect(p).toHaveProperty('body')
    expect(p.statusCode).toBe(200)
    expect(p.body).toContain('results')
  })
})

describe('userList', () => {

  it('defaults to 10 results', async () => {
    const dynamock = jest.spyOn(AWS, 'DynamoDB')
    dynamock.mockImplementation(function () {
      return {
        scan: (params) => {
          expect(params).toHaveProperty('TableName')
          expect(params).toHaveProperty('Limit')
          expect(params.Limit).toBe(10)
          return {
            promise: () => Promise.resolve({
              Items: []
            })
          }
        }
      }
    })
    await userList({
      queryStringParameters: null
    }, null, null)
  })

  it('passes limit to params', async () => {
    const dynamock = jest.spyOn(AWS, 'DynamoDB')
    dynamock.mockImplementation(function () {
      return {
        scan: (params) => {
          expect(params).toHaveProperty('TableName')
          expect(params).toHaveProperty('Limit')
          expect(params).toHaveProperty('ExclusiveStartKey')
          expect(params.Limit).toBe(200)
          return {
            promise: () => Promise.resolve({
              Items: []
            })
          }
        }
      }
    })
    await userList({
      queryStringParameters: {
        results: 200,
        nextToken: 'someToken'
      }
    }, null, null)
  })

  it('max 10 items if no nextToken', async () => {
    const dynamock = jest.spyOn(AWS, 'DynamoDB')
    dynamock.mockImplementation(function () {
      return {
        scan: (params) => {
          expect(params).toHaveProperty('TableName')
          expect(params).toHaveProperty('Limit')
          expect(params.Limit).toBe(10)
          return {
            promise: () => Promise.resolve({
              Items: []
            })
          }
        }
      }
    })
    const p = await userList({
      queryStringParameters: {}
    }, null, null)
    expect(p).toHaveProperty('statusCode')
    expect(p).toHaveProperty('body')
    expect(p.statusCode).toBe(200)
  })

  it('returns status 200', async () => {
    const dynamock = jest.spyOn(AWS, 'DynamoDB')
    dynamock.mockImplementation(function () {
      return {
        scan: (params) => {
          expect(params).toHaveProperty('TableName')
          return {
            promise: () => Promise.resolve({
              Items: []
            })
          }
        }
      }
    })
    const p = await userList({
      queryStringParameters: {
        nextToken: 'someToken'
      }
    }, null, null)
    expect(p).toHaveProperty('statusCode')
    expect(p).toHaveProperty('body')
    expect(p.statusCode).toBe(200)
  })
})

describe('userGetById', () => {
  it('returns 200 when path parameter is sent', async () => {
    const dynamock = jest.spyOn(AWS, 'DynamoDB')
    dynamock.mockImplementation(function () {
      return {
        getItem: (params) => {
          expect(params).toHaveProperty('TableName')
          expect(params).toHaveProperty('Key')
          expect(params.Key).toHaveProperty('id')
          return {
            promise: () => Promise.resolve(mockItem)
          }
        }
      }
    })
    const p = await userGetById({
      pathParameters: 'someparameter'
    }, null, null)
    expect(p).toHaveProperty('statusCode')
    expect(p).toHaveProperty('body')
    expect(p.statusCode).toBe(200)
  })
})


describe('userDelete', () => {
  it('returns 200 when path parameter is sent', async () => {
    const dynamock = jest.spyOn(AWS, 'DynamoDB')
    dynamock.mockImplementation(function () {
      return {
        deleteItem: (params) => {
          expect(params).toHaveProperty('TableName')
          expect(params).toHaveProperty('Key')
          expect(params.Key).toHaveProperty('id')
          return {
            promise: () => Promise.resolve({
              data: 'somedata'
            })
          }
        }
      }
    })
    const p = await userDelete({
      pathParameters: 'someparameter'
    }, null, null)
    expect(p).toHaveProperty('statusCode')
    expect(p).toHaveProperty('body')
    expect(p.statusCode).toBe(200)
  })
})


describe('userUpdate', () => {
  it('calls dynamo with TableName, Key, and ExpressionAttributeNames', async () => {
    const dynamock = jest.spyOn(AWS, 'DynamoDB')
    dynamock.mockImplementation(function () {
      return {
        updateItem: (params) => {
          expect(params).toHaveProperty('TableName')
          expect(params).toHaveProperty('Key')
          expect(params).toHaveProperty('UpdateExpression')
          expect(params).toHaveProperty('ExpressionAttributeValues')
          expect(params).toHaveProperty('ReturnValues')
          return {
            promise: () => Promise.resolve(mockItem)
          }
        }
      }
    })
    await userUpdate({ 
        pathParameters: { id: 'someId' },
        body: JSON.stringify({
        login: {
          username: "s",
          uuid: "some-uuid"
        },
        id: {
          some: 'id'
        },
        email: "s"
      }) 
    }, null, null)
  })

  it('returns 400 if missing email', async () => {
    const p = await userUpdate({ 
      pathParameters: { id: 'someId' },
      body: JSON.stringify({
        login: {
          username: "s",
          uuid: "some-uuid"
        },
        id: {
          some: 'id'
        },
      }) 
    }, null, null)
    expect(p).toHaveProperty('statusCode')
    expect(p).toHaveProperty('body')
    expect(p.statusCode).toBe(400)
    expect(p.body).toContain('email')
  })

  it('returns 400 if missing username', async () => {
    const p = await userUpdate({ 
      pathParameters: { id: 'someId' },
      body: JSON.stringify({
        login: {
          uuid: 'some-uuid'
        },
        id: {
          some: 'id'
        },
        email: "s"
      }) 
    }, null, null)
    expect(p).toHaveProperty('statusCode')
    expect(p).toHaveProperty('body')
    expect(p.statusCode).toBe(400)
    expect(p.body).toContain('username')
  })

  it('throws error if userUpdate fails', async () => {
    const dynamock = jest.spyOn(AWS, 'DynamoDB')
    dynamock.mockImplementation(function () {
      return {
        updateItem: (params) => {
          expect(params).toHaveProperty('TableName')
          expect(params).toHaveProperty('Key')
          expect(params).toHaveProperty('UpdateExpression')
          expect(params).toHaveProperty('ExpressionAttributeValues')
          expect(params).toHaveProperty('ReturnValues')
          return {
            promise: () => Promise.reject(new Error('mock error'))
          }
        }
      }
    })
    await expect(userUpdate({ 
      pathParameters: { id: 'someId' },
      body: JSON.stringify({
        login: {
          username: "s",
          uuid: "some-uuid"
        },
        id: {
          some: 'id'
        },
        email: "s"
      }) 
    }, null, null)).rejects.toThrow(new Error('mock error'))
  })

  it('returns 200 with item inserted', async () => {
    const dynamock = jest.spyOn(AWS, 'DynamoDB')
    dynamock.mockImplementation(function () {
      return {
        updateItem: (params) => {
          expect(params).toHaveProperty('TableName')
          expect(params).toHaveProperty('Key')
          expect(params).toHaveProperty('UpdateExpression')
          expect(params).toHaveProperty('ExpressionAttributeValues')
          expect(params).toHaveProperty('ReturnValues')
          return {
            promise: () => Promise.resolve(mockItem)
          }
        }
      }
    })
    const p = await userUpdate({ 
      pathParameters: { id: 'someId' },
      body: JSON.stringify({
      login: {
        username: "s",
        uuid: "some-uuid"
      },
      id: {
        some: 'id'
      },
      email: "s"
    }) }, null, null)
    expect(p).toHaveProperty('statusCode')
    expect(p).toHaveProperty('body')
    expect(p.statusCode).toBe(200)
  })
})

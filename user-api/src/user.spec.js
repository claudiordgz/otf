const AWS = require('aws-sdk')
const { userCreate, userList } = require('./user')

beforeAll(() => {
  process.env.DYNAMODB_TABLE = 'some-table'
  process.env.AWS_DEFAULT_REGION = 'us-east-1'
})

jest.mock('./log', () => ({ log: () => undefined }))

describe('create user', () => {
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
        username: "s"
      },
      email: "s"
    }) }, null, null)
  })

  it('returns 400 if missing email', async () => {
    const p = await userCreate({ body: JSON.stringify({
      login: {
        username: "s"
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
        username: "s"
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
        username: "s"
      },
      email: "s"
    }) }, null, null)
    expect(p).toHaveProperty('statusCode')
    expect(p).toHaveProperty('body')
    expect(p.statusCode).toBe(200)
    expect(p.body).toContain('Item')
  })
})

describe('list user', () => {
  it('returns 200 with item inserted', async () => {
    const dynamock = jest.spyOn(AWS, 'DynamoDB')
    dynamock.mockImplementation(function () {
      return {
        scan: (params) => {
          expect(params).toHaveProperty('TableName')
          return {
            promise: () => Promise.resolve(true)
          }
        }
      }
    })
    const p = await userList(null, null, null)
    expect(p).toHaveProperty('statusCode')
    expect(p).toHaveProperty('body')
    expect(p.statusCode).toBe(200)
  })
})

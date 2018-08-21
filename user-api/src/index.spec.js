const index = require('./index')
const { userCreate,
  userList,
  userGetById,
  userUpdate,
  userDelete
} = require('./user')

jest.mock('./log', () => ({
  log: () => undefined
}))

jest.mock('./user', () => ({
  userCreate: jest.fn(),
  userList: jest.fn(),
  userGetById: jest.fn(),
  userUpdate: jest.fn(),
  userDelete: jest.fn(),
}))


describe('index functions', () => {
  it('calls function and resolves then calls the callback', async () => {
    const mockImpl = () => Promise.resolve({ some: 'value' })
    userCreate.mockImplementation(mockImpl)
    userList.mockImplementation(mockImpl)
    userGetById.mockImplementation(mockImpl)
    userUpdate.mockImplementation(mockImpl)
    userDelete.mockImplementation(mockImpl)
    const fn = index.wrap(mockImpl)
    const cb = (error, value) => {
      expect(value).toMatchObject({ some: 'value' })
    }
    await fn(null, null, cb)
    await index.userCreate(null, null, cb)
    await index.userList(null, null, cb)
    await index.userGetById(null, null, cb)
    await index.userUpdate(null, null, cb)
    await index.userDelete(null, null, cb)
  })

  it('calls function and rejects then calls the callback', async () => {
    const mockImpl = () => Promise.reject({ some: 'value' })
    userCreate.mockImplementation(mockImpl)
    userList.mockImplementation(mockImpl)
    userGetById.mockImplementation(mockImpl)
    userUpdate.mockImplementation(mockImpl)
    userDelete.mockImplementation(mockImpl)
    const fn = index.wrap(mockImpl)
    const cb = (error, value) => {
      expect(value).toHaveProperty('some')
      expect(value).toHaveProperty('statusCode')
      expect(value).toHaveProperty('headers')
      expect(value).toHaveProperty('body')
      expect(value.statusCode).toBe(500)
    }
    await fn(null, null, cb)
    await index.userCreate(null, null, cb)
    await index.userList(null, null, cb)
    await index.userGetById(null, null, cb)
    await index.userUpdate(null, null, cb)
    await index.userDelete(null, null, cb)
  })
})

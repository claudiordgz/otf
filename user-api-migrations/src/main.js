var request = require('request')

const get = (url) => new Promise((res, rej) => {
  request(url, (error, response, body) => { 
    if (error !== null) {
      rej(error)
    }
    res(JSON.parse(body))
  })
})

const post = (url, payload) => new Promise((res, rej) => {
  request.post({
    url: url,
    body: payload,
    json: true
  }, (error, response, body) => {
    if (error !== null) {
      rej(error)
    }
    res(body)
  })
})

module.exports.main = async () => {
  const url = (page, size = 1000) => `https://randomuser.me/api/?page=${page}&results=${size}`
  const pages = Array.from({ length: 1000 }, (x, i) => i + 1)
  const createUrl = `https://ghbrncxlqc.execute-api.us-east-1.amazonaws.com/dev/user`
  for (page of pages) {
    console.log(page)
    const r = await get(url(page))
    for (single of r.results) {
      const res = await post(createUrl, single) 
      console.log(res)
    }
  }
  return true
}

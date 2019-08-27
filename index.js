const fetch = require('isomorphic-unfetch')

const ORIGIN = process.env.NODE_ENV === 'production' ? '': 'http://localhost:1234'

module.exports = async (req, res) => {
  console.log(req.url)
  if (/\/text$/.test(req.url)) {
    const r = await fetch(`https://scrapbox.io/api/pages/cd${req.url}`)
    const text = await r.text()
    res.setHeader('Content-Type', 'plain/text')
    res.setHeader('Access-Control-Allow-Origin', ORIGIN)
    res.end(text)
  } else {
    const r = await fetch(`https://scrapbox.io/api/pages/cd${req.url}`)
    const json = await r.json()
    res.setHeader('Content-Type', 'application/json')
    res.setHeader('Access-Control-Allow-Origin', ORIGIN)
    res.end(JSON.stringify(json))
  }
}

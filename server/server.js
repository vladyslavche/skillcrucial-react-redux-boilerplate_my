import express from 'express'
import path from 'path'
import axios from 'axios'
import cors from 'cors'
import sockjs from 'sockjs'
import { renderToStaticNodeStream } from 'react-dom/server'
import React from 'react'

import cookieParser from 'cookie-parser'
import config from './config'
import Html from '../client/html'
// import { readFile, writeFile } from 'fs'

const { readFile, writeFile, unlink } = require('fs').promises

require('colors')

let Root
try {
  // eslint-disable-next-line import/no-unresolved
  Root = require('../dist/assets/js/ssr/root.bundle').default
} catch {
  console.log('SSR not found. Please run "yarn run build:ssr"'.red)
}

let connections = []

const port = process.env.PORT || 8090
const server = express()

const setHeaders = (req, res, next) => {
  res.set('x-skillcrucial-user', '2b98cd11-d8f3-4dc4-b7cf-314704eb7926')
  res.set('Access-Control-Expose-Headers', 'X-SKILLCRUCIAL-USER')
  next()
}

const middleware = [
  cors(),
  express.static(path.resolve(__dirname, '../dist/assets')),
  express.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }),
  express.json({ limit: '50mb', extended: true }),
  cookieParser(),
  setHeaders
]

middleware.forEach((it) => server.use(it))

const userUrl = 'https://jsonplaceholder.typicode.com/users'
const userPath = `${__dirname}/data/users.json`

const getData = (url) => {
  const usersList = axios(url)
    .then(({ data }) => data)
    .catch((err) => {
      console.log(err)
      return []
    })
  return usersList
}

const writeNewFile = (finalArray) => {
  return writeFile(userPath, JSON.stringify(finalArray), 'utf-8')
}

server.get('/api/v1/users', async (req, res) => {
  const userList = await readFile(userPath, 'utf-8')
    .then((userData) => {
      return JSON.parse(userData)
    })
    .catch(async (err) => {
      console.log(err)
      const receiveData = await getData(userUrl)
      await writeNewFile(receiveData)
      return receiveData
    })
  res.json(userList)
})

server.delete('/api/v1/users', (req, res) => {
  unlink(userPath)
    .then(() => {
      res.json({ status: 'file was deleted' })
    })
    .catch((err) => {
      console.log(err)
      res.json({ status: 'No file' })
    })
})

server.post('/api/v1/users', async (req, res) => {
  const usersList = await readFile(userPath, 'utf-8')
    .then(async (str) => {
      const parsedString = JSON.parse(str)
      const lastId = parsedString[parsedString.length - 1].id + 1
      await writeNewFile([...parsedString, { ...req.body, id: lastId }])
      return { status: 'success', id: lastId }
    })
    .catch(async (err) => {
      console.log(err)
      await writeNewFile([{ ...req.body, id: 1 }])
      return { status: 'success', id: 1 }
    })
  res.json(usersList)
})

server.patch('/api/v1/users/:userId', async (req, res) => {
  const { userId } = req.params
  const updatedUser = { ...req.body, id: +userId }
  const response = await readFile(userPath, 'utf-8')
    .then(async (str) => {
      const parsedString = JSON.parse(str)
      const updatedList = parsedString.map((obj) => {
        return obj.id === +userId ? { ...obj, ...updatedUser } : obj
      })
      await writeNewFile(updatedList)
      return { status: 'success', id: +userId }
    })
    .catch(() => {
      return { status: 'no file exists', id: +userId }
    })
  res.json(response)
})

server.get('/api/v1/users/', async (req, res) => {
  const { data: users } = await axios('https://jsonplaceholder.typicode.com/users')
  res.json(users)
})

server.get('/api/v1/users/take/:number', async (req, res) => {
  const { number } = req.params
  const { data: users } = await axios('https://jsonplaceholder.typicode.com/users')
  res.json(users.slice(0, +number))
})

server.get('/api/v1/users/:name', (req, res) => {
  const { name } = req.params
  res.json({ name })
})

server.use('/api/', (req, res) => {
  res.status(404)
  res.end()
})

const [htmlStart, htmlEnd] = Html({
  body: 'separator',
  title: 'Skillcrucial'
}).split('separator')

server.get('/', (req, res) => {
  const appStream = renderToStaticNodeStream(<Root location={req.url} context={{}} />)
  res.write(htmlStart)
  appStream.pipe(res, { end: false })
  appStream.on('end', () => {
    res.write(htmlEnd)
    res.end()
  })
})

server.get('/*', (req, res) => {
  const appStream = renderToStaticNodeStream(<Root location={req.url} context={{}} />)
  res.write(htmlStart)
  appStream.pipe(res, { end: false })
  appStream.on('end', () => {
    res.write(htmlEnd)
    res.end()
  })
})

const app = server.listen(port)

if (config.isSocketsEnabled) {
  const echo = sockjs.createServer()
  echo.on('connection', (conn) => {
    connections.push(conn)
    conn.on('data', async () => {})

    conn.on('close', () => {
      connections = connections.filter((c) => c.readyState !== 3)
    })
  })
  echo.installHandlers(app, { prefix: '/ws' })
}
console.log(`Serving at http://localhost:${port}`)

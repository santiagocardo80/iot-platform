'use strict'

const express = require('express')
const request = require('request-promise-native')

const api = express.Router()

const { endpoint, apiToken } = require('./config')

api.get('/agents', async (req, res, next) => {
  const options = {
    method: 'GET',
    url: `${endpoint}/api/agents`,
    headers: {
      'Authorization': `Bearer ${apiToken}`
    },
    json: true
  }

  let result
  try {
    result = await request(options)
  } catch (e) {
    return next(e)
  }

  res.send(result) //mandar dentro del try en caso que no mande respuesta desde aqui
})

api.get('/agent/:uuid', async (req, res, next) => {
  const { uuid } = req.params
  const options = {
    method: 'GET',
    url: `${endpoint}/api/agent/${uuid}`,
    headers: {
      'Authorization': `Bearer ${apiToken}`
    },
    json: true
  }

  let result
  try {
    result = await request(options)
  } catch (e) {
    return next(e)
  }

  res.send(result)
})

api.get('/metrics/:uuid', async (req, res, next) => {
  const { uuid } = req.params
  const options = {
    method: 'GET',
    url: `${endpoint}/api/metrics/${uuid}`,
    headers: {
      'Authorization': `Bearer ${apiToken}`
    },
    json: true
  }

  let result
  try {
    result = await request(options)
  } catch (e) {
    return next(e)
  }

  res.send(result)
})

api.get('/metrics/:uuid/:type', async (req, res, next) => {
  const { uuid, type } = req.params
  const options = {
    method: 'GET',
    url: `${endpoint}/api/metrics/${uuid}/${type}`,
    headers: {
      'Authorization': `Bearer ${apiToken}`
    },
    json: true
  }

  let result
  try {
    result = await request(options)
  } catch (e) {
    return next(e)
  }

  res.send(result)
})

module.exports = api

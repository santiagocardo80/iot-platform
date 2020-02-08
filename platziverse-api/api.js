'use strict'

const debug = require('debug')('platziverse:api:routes')
const express = require('express')
const auth = require('express-jwt')
const guard = require('express-jwt-permissions')()
const db = require('platziverse-db')

const config = require('./config')

const api = express.Router()

let services, Agent, Metric

api.use('*', async (req, res, next) => {
  if (!services) {
    debug('Connecting to database')
    try {
      services = await db(config.db)
    } catch (err) {
      next(err)
    }

    Agent = services.Agent
    Metric = services.Metric
  }
  next()
})

api.get('/agents', auth(config.auth), async (req, res, next) => {
  debug('A request has come to /agents')

  const { user } = req
  let agents

  if (!user || !user.username) {
    return next(new Error('Not authorized'))
  }

  try {
    if (user.admin) {
      agents = await Agent.findConnected()
    } else {
      agents = await Agent.findByUsername(user.username)
    }
  } catch (err) {
    return next(err)
  }

  res.status(200).send(agents)
})

api.get('/agent/:uuid', auth(config.auth), async (req, res, next) => {
  const { uuid } = req.params
  const { user } = req

  debug(`A request has come to /agent/${uuid}`)

  if (!user || !user.username) {
    return next(new Error('Not authorized'))
  }

  try {
    const agent = await Agent.findByUuid(uuid)

    if (!agent) {
      return next(new Error(`Agent with uuid '${uuid}' not found`))
    }

    if (agent.username !== user.username && agent.username !== 'admin') {
      return next(new Error('Not authorized'))
    }

    res.status(200).json(agent)
  } catch (err) {
    return next(err)
  }
})

api.get('/metrics/:uuid', auth(config.auth), guard.check(['metrics:read']), async (req, res, next) => {
  const { uuid } = req.params
  const { user } = req

  debug(`A request has come to /metrics/${uuid}`)

  if (!user || !user.username) {
    return next(new Error('Not authorized'))
  }

  try {
    const metrics = await Metric.findByAgentUuid(uuid)

    if (!metrics) {
      return next(new Error(`Metrics with uuid '${uuid}' not found`))
    }

    res.status(200).json(metrics)
  } catch (err) {
    return next(err)
  }
})

api.get('/metrics/:uuid/:type', auth(config.auth), async (req, res, next) => {
  const { type, uuid } = req.params
  const { user } = req

  debug(`A request has come to /metrics/${uuid}/${type}`)

  if (!user || !user.username) {
    return next(new Error('Not authorized'))
  }

  try {
    const metrics = await Metric.findByTypeAgentUuid(type, uuid)

    if (!metrics) {
      return next(new Error(`Metrics with type '${type}' and uuid '${uuid}' not found`))
    }

    res.status(200).json(metrics)
  } catch (err) {
    next(err)
  }
})

module.exports = api

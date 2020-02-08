'use strict'

const test = require('ava')
const sinon = require('sinon')
const proxyquire = require('proxyquire')

const metricFixtures = require('./fixtures/metric')

const config = {
  logging: function () {}
}

const AgentStub = {
  hasMany: sinon.spy()
}

// Continuar con el proceso de pruebas para el servicio de Metrics
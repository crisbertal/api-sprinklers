'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class ProfesorModel extends Model {
  static get table() {
    return 'profesores'
  }
}

module.exports = ProfesorModel

'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class JugadorModel extends Model {
  static get table() {
    return 'jugadores'
  }
  aldea() {
    return this.belongsTo('App/Models/AldeaModel', 'fk_aldea_id', 'id')
  }
}

module.exports = JugadorModel

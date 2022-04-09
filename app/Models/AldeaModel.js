'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class AldeaModel extends Model {
  static get table() {
    return 'aldeas'
  }
  jugadores() {
    return this.hasMany('App/Models/JugadorModel')
  }
  comarca() {
    return this.belongsTo('App/Models/ComarcaModel', 'fk_comarca_id', 'id')
  }
}

module.exports = AldeaModel

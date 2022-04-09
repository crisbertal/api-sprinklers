'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class ComarcaModel extends Model {
  static get table() {
    return 'comarcas'
  }
  aldeas() {
    return this.hasMany('App/Models/AldeaModel', 'id', 'fk_comarca_id')
  }
}

module.exports = ComarcaModel

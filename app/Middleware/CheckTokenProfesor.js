'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
const Database = use('Database')
class CheckTokenProfesor {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle({ request, response }, next) {
    // call next to advance the request
    const Authorization = request.header('Authorization')
    var error = 0
    if (typeof Authorization === 'undefined' || Authorization.length === 0) {
      error++
    }

    const SQL = `SELECT token FROM profesores where token = '${Authorization}' LIMIT 1`
    var res = await Database.raw(SQL)
    var res = res[0].length > 0 ? res[0] : error++
    if (error === 0) {
      await next()
    } else {
      return response.status(500).json({ error: 'Not a valid token' })
    }
  }
}

module.exports = CheckTokenProfesor

'use strict'

const Hash = use('Hash')
const { validateAll } = use('Validator')
const { ValidationHelper } = use('App/Helpers/GlobalHelper')
const Database = use('Database')
const ProfesorModel = use('App/Models/ProfesorModel')
class ProfesorController {
  async iniciar_sesion({ request, response }) {
    //Start Validations
    const validators = {
      usuario: 'required',
      contrasena: 'required',
    }
    const messages = {
      'usuario.required': 'usuario required.',
      'contrasena.required': 'contrasena required.',
    }
    let errores = await ValidationHelper(
      request,
      response,
      validators,
      messages,
    )
    if (errores != '') {
      return await response.status(500).json({ error: errores })
    }
    //End Validations

    //Start Logic
    const { usuario, contrasena } = request.all()

    const profesor = await ProfesorModel.query()
      .where({ nombre: usuario, contrasena: contrasena })
      .select('token', 'nombre')
      .first()

    return response
      .status(profesor ? 200 : 401)
      .json(
        profesor
          ? { status: 'success', data: profesor }
          : { status: 'failure', data: null },
      )
    //End Logic
  }

  async crear_comarca({ request, response }) {
    //Start Validations
    const validators = {
      nombre: 'required',
      rondas_totales: 'required',
    }
    const messages = {
      'nombre.required': 'nombre required.',
      'rondas_totales.required': 'rondas_totales required.',
    }
    let errores = await ValidationHelper(
      request,
      response,
      validators,
      messages,
    )
    if (errores != '') {
      return await response.status(500).json({ error: errores })
    }
    //End Validations

    //Start Logic
    const { nombre, rondas_totales } = request.all()

    const SQL = `SELECT token, nombre FROM profesores where nombre = '${usuario}' and contrasena = '${contrasena}' LIMIT 1`

    var resQuery = await Database.raw(SQL)
    resQuery = resQuery.rows
    return response.status(resQuery ? 200 : 401).json(resQuery ? resQuery : [])
    //End Logic
  }
}

module.exports = ProfesorController

const { validateAll } = use('Validator')
const { ValidationHelper } = use('App/Helpers/GlobalHelper')
const Database = use('Database')

class JugadorController {
  async iniciar_sesion({ request, response }) {
    //Start Validations
    const validators = {
      nombre_comarca: 'required',
      nombre_aldea: 'required',
      nombre_jugador: 'required',
    }
    const messages = {
      'nombre_comarca.required': 'nombre_comarca required.',
      'nombre_aldea.required': 'nombre_aldea required.',
      'nombre_jugador.required': 'nombre_jugador required.',
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
    const { nombre_jugador, nombre_aldea, nombre_comarca } = request.all()

    const SQL = `c.nombre as socket_juego,c.estado_partida FROM jugadores j  
    INNER JOIN aldeas a on j.fk_aldea_id=a.id  
    INNER JOIN comarcas c on a.fk_comarca_id=c.id  
    where j.nombre='${nombre_jugador}' 
    and c.nombre='${nombre_comarca}' 
    and a.nombre='${nombre_aldea}';`

    var resQuery = await Database.select(Database.raw(SQL))

    return response
      .status(resQuery ? 200 : 401)
      .json(
        resQuery
          ? { status: 'success', data: resQuery }
          : { status: 'failure', data: null },
      )
    //End Logic
  }

  //End Coupon
}

module.exports = JugadorController

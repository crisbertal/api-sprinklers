'use strict'
const Route = use('Route')

Route.post('/test-database', async function ({ request, response }) { })

Route.get('/', function ({ response }) {
  return response.notFound('404')
})

Route.group(() => {
  Route.get('/', function ({ response }) {
    return response.notFound('404')
  })

  Route.post('/jugador/iniciar-sesion', 'JugadorController.iniciar_sesion').as(
    'jugador.iniciar_sesion',
  )
  Route.post(
    '/profesor/iniciar-sesion',
    'ProfesorController.iniciar_sesion',
  ).as('profesor.iniciar_sesion')
  Route.post('/profesor/crear-comarca', 'ProfesorController.crear_comarca')
    .middleware(['CheckTokenProfesor'])
    .as('profesor.crear_comarca')
}).prefix('api/')
const JugadorModel = use('App/Models/JugadorModel')
const crypto = require('crypto')
Route.get('/generar-token', async function ({ response }) {
  var id = crypto.randomBytes(25).toString('hex')
  return { longitud: id.length, contenido: id }
})

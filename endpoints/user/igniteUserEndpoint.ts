import { FastifyInstance } from 'fastify'
import {
  getAllUserHandler,
  getUserByIdHandler,
  createUserHandler,
  checkSession,
  Login,
  updateUserHandler,
  Logout,
} from './handlers'
import Authentication from 'interceptors/Authentication'

export default async function (app: FastifyInstance) {
  app.post('/create', createUserHandler)
  app.post('/login', Login)

  app.register(Authentication)

  app.get('/', getAllUserHandler)

  app.post('/checkSession', checkSession)

  app.put('/:id', updateUserHandler)

  app.post('/logout', Logout)
}

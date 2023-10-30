import { FastifyInstance } from 'fastify'
import {
  getAllUserHandler,
  getUserByIdHandler,
  createUserHandler,
  checkSession,
  Login,
  updateUserHandler,
} from './handlers'
import Authentication from 'interceptors/Authentication'

export default async function (app: FastifyInstance) {
  app.post('/create', createUserHandler)
  app.post('/login', Login)

  // app.register(Authentication)

  app.get('/', getAllUserHandler)
  app.get('/checkSession', checkSession)
  // app.get('/:id', getUserByIdHandler)

  app.put('/:id', updateUserHandler)
}

import {
  getAllUserHandler,
  getUserByIdHandler,
  createUserHandler,
} from './handlers'

export default async function (app) {
  app.get('/', getAllUserHandler)
  app.get('/:id', getUserByIdHandler)
  app.post('/create', createUserHandler)
}

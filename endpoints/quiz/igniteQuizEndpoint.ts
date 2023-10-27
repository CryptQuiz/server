import {
  getAllQuizHandler,
  createQuizHandler,
  deleteQuizHandler,
  getQuizHandler,
  updateQuizHandler,
} from './handlers'

export default async function (app) {
  app.get('/', getAllQuizHandler)
  app.post('/create', createQuizHandler)
  app.get('/:id', getQuizHandler)
  app.put('/:id', updateQuizHandler)
  app.delete('/:id', deleteQuizHandler)
}

import { getAllQuizHandler, createQuizHandler } from './handlers'

export default async function (app) {
  app.get('/', getAllQuizHandler)
  app.post('/create', createQuizHandler)
}

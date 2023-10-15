import { getAllQuizHandler } from './handlers'

export default async function (app) {
  app.get('/', getAllQuizHandler)
}

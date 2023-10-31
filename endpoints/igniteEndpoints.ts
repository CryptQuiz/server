import User from './user/igniteUserEndpoint'
import Quiz from './quiz/igniteQuizEndpoint'

export default async function (app) {
  app.get('/', (req, rep) => {
    rep.send('Service provider is working properly!')
  })

  app.register(User, { prefix: '/user' })
  app.register(Quiz, { prefix: '/quiz' })
}

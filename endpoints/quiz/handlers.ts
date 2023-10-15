import { QuizOperations } from 'operations'
import { FastifyReply, FastifyRequest } from 'fastify'

export const getAllQuizHandler = async (
  req: FastifyRequest,
  rep: FastifyReply,
) => {
  await QuizOperations.getAllQuiz()
    .then((res) => {
      return res
    })
    .catch((err) => {
      return err
    })
}

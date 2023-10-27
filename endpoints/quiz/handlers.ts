import { QuizOperations } from 'operations'
import { FastifyReply, FastifyRequest } from 'fastify'

export const getAllQuizHandler = async (
  req: FastifyRequest,
  rep: FastifyReply,
) => {
  const result = await QuizOperations.getAllQuiz()
    .then((res) => {
      return res
    })
    .catch((err) => {
      console.log('err', err)
      console.log({ err })

      rep.code(404).send({
        message: err,
      })
    })

  return result
}

export const createQuizHandler = async (req, rep) => {
  const data = req.body
  const result = await QuizOperations.createQuiz(data).catch((err) => {
    console.log('err', err)
    console.log({ err })

    rep.code(404).send({
      message: err,
    })
  })

  return rep
    .type('application/json')
    .headers({ 'Content-Type': 'application/json' })
    .send({
      message: 'Quiz created successfully',
      status: 'success',
      data: result,
    })
}

export const updateQuizHandler = async (req, rep) => {
  const data = req.body
  const id = req.params.id
  const result = await QuizOperations.updateQuiz(id, data).catch((err) => {
    console.log('err', err)
    console.log({ err })

    rep.code(404).send({
      message: err,
    })
  })

  return rep
    .type('application/json')
    .headers({ 'Content-Type': 'application/json' })
    .send({
      message: 'Quiz updated successfully',
      status: 'success',
      data: result,
    })
}

// Delete: Varolan bir quizi siler

export const deleteQuizHandler = async (req, rep) => {
  const id = req.params.id
  const result = await QuizOperations.deleteQuiz(id).catch((err) => {
    console.log('err', err)
    console.log({ err })

    rep.code(404).send({
      message: err,
    })
  })

  return rep
    .type('application/json')
    .headers({ 'Content-Type': 'application/json' })
    .send({
      message: 'Quiz deleted successfully',
      status: 'success',
      data: result,
    })
}

// Get: Varolan bir quizi getirir

export const getQuizHandler = async (req, rep) => {
  const id = req.params.id
  const result = await QuizOperations.getQuiz(id).catch((err) => {
    console.log('err', err)
    console.log({ err })

    rep.code(404).send({
      message: err,
    })
  })

  return rep
    .type('application/json')
    .headers({ 'Content-Type': 'application/json' })
    .send({
      message: 'Quiz fetched successfully',
      status: 'success',
      data: result,
    })
}

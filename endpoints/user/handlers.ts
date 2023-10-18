import { UserOperations } from 'operations'
import { FastifyReply, FastifyRequest } from 'fastify'

export const getAllUserHandler = async (
  req: FastifyRequest,
  rep: FastifyReply,
) => {
  await UserOperations.getAllUsers()
    .then((res) => {
      return res
    })
    .catch((err) => {
      return err
    })
}

export const getUserByIdHandler = async (
  req: FastifyRequest,
  rep: FastifyReply,
) => {
  const { id } = req.params as any

  await UserOperations.getUserById(id)
    .then((res) => {
      return res
    })
    .catch((err) => {
      return err
    })
}

export const createUserHandler = async (req, rep) => {
  // const { id: uid } = req.session
  const body = await req.file()

  // console.log('body', { body })

  // console.log('body.fields', { body: body.file })

  const data = JSON.parse(body.fields.data.value)
  console.log('body.data', data)
  const profile = body.fields.profile

  const result = await UserOperations.createUser(data, profile).catch((err) => {
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
      message: 'Community created successfully',
      status: 'success',
      data: result,
    })
}

export const updateUserHandler = async (
  req: FastifyRequest,
  rep: FastifyReply,
) => {
  const { data } = req.body as any

  await UserOperations.updateUser(data)
    .then((res) => {
      return res
    })
    .catch((err) => {
      return err
    })
}

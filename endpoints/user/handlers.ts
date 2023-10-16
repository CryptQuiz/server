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

export const createUserHandler = async (
  req: FastifyRequest,
  rep: FastifyReply,
) => {
  const { data } = req.body as any

  await UserOperations.createUser(data)
    .then((res) => {
      return res
    })
    .catch((err) => {
      return err
    })
}

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

  console.log('id', id)

  await UserOperations.getUserById(id)
    .then((res) => {
      return res
    })
    .catch((err) => {
      return err
    })
}

export const createUserHandler = async (
  req,

  rep,
) => {
  const body = await req.file()
  console.log('body.fields', body)

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
      message: 'User created successfully',
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

export const Login = async (
  req: FastifyRequest<{
    Body: {
      wallet_key_public: string
    }
  }>,
  rep: FastifyReply,
) => {
  const { wallet_key_public } = req.body as any
  console.log('wallet_key_public', wallet_key_public)

  await UserOperations.createCredential(wallet_key_public)
    .then((result) => {
      if (result) {
        return rep.code(200).send(result)
      }
      return rep.code(400).send({ message: 'Invalid credentials' })
    })
    .catch((err) => {
      console.error(err)
      return rep.code(400).send({ message: err.message })
    })
}

export const checkSession = (req, rep) => {
  const { credentials } = req.body

  UserOperations.getCredentials(credentials, true)
    .then(async (result) => {
      return rep.code(200).send({
        valid: !!result,
        showInstructions: result?.showInstructions,
      })
    })
    .catch((err) => {
      console.error(err)
      return rep.code(500).send({ message: 'Internal server error' })
    })
}

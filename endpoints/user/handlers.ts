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

export const createUserHandler = async (req, rep) => {
  const { data } = req.body as any

  try {
    const result = await UserOperations.createUser(data)
    if (!result) {
      return rep.code(404).send({
        message: 'User creation failed',
      })
    }
    const walletKeyPublic = data
    console.log('walletKeyPublic', walletKeyPublic)
    console.log('data', data)

    const credentialResult = await UserOperations.createCredential(
      walletKeyPublic,
    )
    if (!credentialResult) {
      return rep.code(404).send({
        message: 'Credential creation failed',
      })
    }

    return rep.code(200).send({
      message: 'User created successfully',
      credential: credentialResult.credential,
    })
  } catch (err) {
    console.error('Error:', err)
    return rep.code(500).send({
      message: 'Internal server error',
    })
  }
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

export const Logout = async (req: FastifyRequest, rep: FastifyReply) => {
  const { credentials } = req.body as any
  console.log('credentials', credentials)

  await UserOperations.deleteCredential(credentials)
    .then((result) => {
      if (result) {
        return rep.code(200).send({ message: 'Logout successful' })
      }
      return rep.code(400).send({ message: 'Invalid credentials' })
    })
    .catch((err) => {
      console.error(err)
      return rep.code(400).send({ message: err.message })
    })
}

export const checkSession = (
  req: FastifyRequest<{
    Body: {
      credentials: string
    }
  }>,
  rep,
) => {
  const { credentials } = req.body
  console.log('credentials', credentials)

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

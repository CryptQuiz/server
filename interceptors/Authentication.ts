import { JWT } from '@fastify/jwt'
import { pg } from './Postgres'
import { FastifyInstance } from 'fastify'

export interface ISession {
  id: string
  wallet_key_public: string
  username: string
}

declare module 'fastify' {
  export interface FastifyRequest {
    session: ISession
  }

  export interface FastifyInstance {
    jwt: JWT
  }
}

export const Authenticator = async (req, rep) => {
  const token = req.headers.credentials

  if (!token) {
    return rep.status(401).send({ message: 'Unauthorized' })
  }

  // Check if the token exists and is valid in the user_credentials table
  const credentials = await pg.query(
    'SELECT u.id, u.wallet_key_public, u.profile_photo, u.username, c.destroyedat FROM users_credentials c INNER JOIN users u ON c.uid = u.id WHERE c.credential = $1 and c.destroyedat is null',
    [token],
  )

  if (!credentials || credentials.rows.length === 0) {
    return rep.status(401).send({ message: 'Unauthorized' })
  }

  const userSession: ISession = {
    id: credentials.rows[0].id,
    wallet_key_public: credentials.rows[0].wallet_key_public,

    username: credentials.rows[0].username,
  }

  req.session = userSession
}

export const Authentication = async function (app: FastifyInstance) {
  app.addHook('preValidation', Authenticator)

  // Return 0
}

export default Authentication

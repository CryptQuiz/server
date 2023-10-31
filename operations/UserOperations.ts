import { pg } from 'interceptors/Postgres'
import { upload, getBlob } from '../data/blob'
import { server } from '../igniteServer'

export const getUserByPublicKey = async (publicKey: string) => {
  try {
    const result = await pg.oneOrNone(
      'SELECT * FROM users WHERE wallet_key_public = $1',
      [publicKey],
    )
    return result
  } catch (err) {
    console.log(err)
    return err
  }
}

export const createCredential = async (publicKey: string) => {
  try {
    const isUserExists = await getUserByPublicKey(publicKey)

    if (!isUserExists) {
      throw new Error('User does not exist')
    }

    const existingCredential = await pg.oneOrNone(
      'SELECT * FROM users_credentials WHERE uid = $1 AND destroyedat IS NULL',
      [isUserExists.id],
    )

    if (existingCredential) {
      throw new Error('User already has an active credential')
    }

    const hash = server.jwt.sign({ publicKey })

    const result = await pg.oneOrNone(
      'INSERT INTO users_credentials (credential, uid) VALUES ($1, $2) RETURNING credential',
      [hash, isUserExists.id],
    )

    return result
  } catch (err) {
    return {
      error: true,
      message: err.message,
    }
  }
}

export const deleteCredential = async (token: string) => {
  try {
    const result = await pg.query(
      'UPDATE users_credentials SET destroyedat = NOW() WHERE credential = $1',
      [token],
    )
    return result.rows
  } catch (err) {
    console.log(err)
    return err
  }
}

export const getCredentials = async (token: string, validity = false) => {
  const credential = await pg.oneOrNone(
    `SELECT * FROM users_credentials WHERE credential = $1 ${
      validity ? 'AND destroyedat IS NULL' : ''
    } ORDER BY createdat DESC LIMIT 1`,
    [token],
  )

  if (credential) {
    return {
      data: credential.data,
      showInstructions: Number(credential.signinCount) < 2,
    }
  }

  return null
}

export const getAllUsers = async () => {
  try {
    const result = await pg.query('SELECT * FROM users')
    return result.rows
  } catch (err) {
    console.log(err)
    return err
  }
}

export const getUserById = async (id: string) => {
  try {
    const result = await pg.oneOrNone('SELECT * FROM users WHERE id = $1', [id])
    console.log('result', result)

    const profile = await getBlob(result.profilePhoto)
      .then((res) => {
        console.log('res', res)
        return res
      })
      .catch((err) => {
        console.log(err)
        return err
      })

    return {
      ...result.rows,
      profile_photo: profile,
    }
  } catch (err) {
    console.log(err)
    return err
  }
}

export const createUser = async (data) => {
  const isUserExists = await pg.oneOrNone(
    'SELECT * FROM users WHERE wallet_key_public = $1',
    [data],
  )

  if (isUserExists) {
    updateUser(data)
  }

  // const uploadProfile = await upload(profile)

  // data.profile_photo = uploadProfile.url

  try {
    const result = await pg.oneOrNone(
      'INSERT INTO users (wallet_key_public, profile_photo, username, stats) VALUES ($1, $2, $3, $4) returning *',
      [data, data.profile_photo, data.username, data.stats],
    )

    const credential = await createCredential(data.wallet_key_public)

    return {
      credential: credential.credential,
      result: result,
    }
  } catch (err) {
    console.log(err)
    return err
  }
}

export const updateUser = async (data) => {
  const isUserExists = await pg.oneOrNone(
    'SELECT * FROM users WHERE wallet_key_public = $1',
    [data.wallet_key_public],
  )

  if (!isUserExists) {
    throw new Error('User does not exist')
  }

  try {
    const result = await pg.query(
      'UPDATE users SET profile_photo = $1, username = $2, stats = $3 WHERE wallet_key_public = $4',
      [data.profile_photo, data.username, data.stats, data.wallet_key_public],
    )
    return result.rows
  } catch (err) {
    console.log(err)
    return err
  }
}

export const deleteUser = async (id: string) => {
  try {
    const result = await pg.query('DELETE FROM users WHERE id = $1', [id])
    return result.rows
  } catch (err) {
    console.log(err)
    return err
  }
}

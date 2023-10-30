// -- public.users definition

// -- Drop table

// -- DROP TABLE public.users;

// CREATE TABLE public.users (
// 	id uuid NOT NULL,
// 	wallet_key_public text NULL,
// 	profile_photo text NULL,
// 	username text NULL,
// 	stats jsonb NULL,
// 	created_at timestamptz NULL DEFAULT CURRENT_TIMESTAMP,
// 	deleted_at timestamptz NULL,
// 	CONSTRAINT users_pkey PRIMARY KEY (id)
// );

// -- Table: public.users_credentials

// -- DROP TABLE IF EXISTS public.users_credentials;

// CREATE TABLE IF NOT EXISTS public.users_credentials
// (
//     credential uuid NOT NULL DEFAULT uuid_generate_v4(),
//     uid uuid NOT NULL,
//     createdat timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
//     destroyedat timestamp with time zone,
//     CONSTRAINT users_credentials_pkey PRIMARY KEY (credential),
//     CONSTRAINT fk_user_id FOREIGN KEY (uid)
//         REFERENCES public.users (id) MATCH SIMPLE
//         ON UPDATE NO ACTION
//         ON DELETE NO ACTION
// )

// TABLESPACE pg_default;

// ALTER TABLE IF EXISTS public.users_credentials
//     OWNER to crypto_quiz_user;
import { pg } from 'interceptors/Postgres'
import { upload, getBlob } from '../data/blob'

import fastify from 'fastify'

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
      .then((res) => {
        return res
      })
      .catch((err) => {
        return err
      })

    if (!isUserExists) {
      throw new Error('User does not exists')
    }

    const hash = server.jwt.sign({ publicKey })

    console.log('hash', hash)
    console.log('isUserExists', isUserExists)

    const result = await pg.oneOrNone(
      'INSERT INTO users_credentials (credential, uid) VALUES ($1, $2) RETURNING credential',
      [hash, isUserExists.id],
    )

    return result
  } catch (err) {
    console.log(err)
    return err
  }
}

export const getCredentials = async (
  token: string,
  validity: boolean = false,
) => {
  const credential = await pg.oneOrNone(
    `select * from user_credentials where credential = $1 ${
      validity ? 'and destroyedat is null' : ''
    } order by createdat desc limit 1`,
    [token],
  )

  if (credential) {
    return credential.data
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

export const createUser = async (data, profile) => {
  const isUserExists = await pg.oneOrNone(
    'SELECT * FROM users WHERE wallet_key_public = $1',
    [data.wallet_key_public],
  )

  if (isUserExists) {
    throw new Error('User already exists')
  }

  console.log('data', profile)
  const uploadProfile = await upload(profile).then((res) => {
    return res
  })
  console.log('res', uploadProfile.url)

  data.profile_photo = uploadProfile.url

  try {
    const result = await pg.query(
      'INSERT INTO users ( wallet_key_public, profile_photo, username, stats) VALUES ($1, $2, $3, $4)',
      [data.wallet_key_public, data.profile_photo, data.username, data.stats],
    )

    await createCredential(data.wallet_key_public)

    return result.rows
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
    throw new Error('User does not exists')
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

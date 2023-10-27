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
import { pg } from 'interceptors/Postgres'
import { upload, getBlob } from '../data/blob'

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
    return result.rows
  } catch (err) {
    console.log(err)
    return err
  }
}

export const updateUser = async (data) => {
  //check pbulic key existsdb

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

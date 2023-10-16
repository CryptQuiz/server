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
    const result = await pg.query('SELECT * FROM users WHERE id = $1', [id])
    return result.rows
  } catch (err) {
    console.log(err)
    return err
  }
}

export const createUser = async (data) => {
  try {
    const result = await pg.query(
      'INSERT INTO users (id, wallet_key_public, profile_photo, username, stats) VALUES ($1, $2, $3, $4, $5)',
      [
        data.id,
        data.wallet_key_public,
        data.profile_photo,
        data.username,
        data.stats,
      ],
    )
    return result.rows
  } catch (err) {
    console.log(err)
    return err
  }
}

import { pg } from 'interceptors/Postgres'

export const getAllQuiz = async () => {
  try {
    const result = await pg.query('SELECT * FROM quiz')
    return result.rows
  } catch (err) {
    console.log(err)
    return err
  }
}

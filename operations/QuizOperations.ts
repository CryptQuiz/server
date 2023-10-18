import { pg } from 'interceptors/Postgres'

// -- public.quiz definition

// -- Drop table

// -- DROP TABLE public.quiz;

// CREATE TABLE public.quiz (
// 	id uuid NOT NULL,
// 	"name" text NULL,
// 	description text NULL,
// 	"type" text NULL,
// 	sponsor_id uuid NULL,
// 	created_at timestamptz NULL DEFAULT CURRENT_TIMESTAMP,
// 	deleted_at timestamptz NULL,
// 	questions _jsonb NULL,
// 	rewards _jsonb NULL,
// 	CONSTRAINT quiz_pkey PRIMARY KEY (id)
// );

// -- public.quiz foreign keys

// ALTER TABLE public.quiz ADD CONSTRAINT fk_sponsor_id FOREIGN KEY (sponsor_id) REFERENCES public.sponsors(id);
export const getAllQuiz = async () => {
  try {
    const result = await pg.query('SELECT * FROM quiz')
    console.log('result', result)
    return result
  } catch (err) {
    console.log(err)
    return err
  }
}

type Quiestion = {
  question: string
  answer: string
  options: string[]
}

export const createQuiz = async (data) => {
  try {
    const result = await pg.query(
      'INSERT INTO quiz ( name, description, type, sponsor_id, questions, rewards) VALUES ($1, $2, $3, $4, $5, $6)',
      [
        data.name,
        data.description,
        data.type,
        data.sponsor_id,
        data.questions,
        data.rewards,
      ],
    )
    return result
  } catch (err) {
    console.log(err)
    return err
  }
}

export const updateQuiz = async (data) => {
  try {
    const result = await pg.query(
      'UPDATE quiz SET name = $1, description = $2, type = $3, sponsor_id = $4, questions = $5, rewards = $6 WHERE id = $7',
      [
        data.name,
        data.description,
        data.type,
        data.sponsor_id,
        data.questions,
        data.rewards,
        data.id,
      ],
    )
    return result
  } catch (err) {
    console.log(err)
    return err
  }
}

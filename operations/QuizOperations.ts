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
// Create: Yeni bir quiz oluşturur
export const createQuiz = async (quizData) => {
  try {
    const { name, description, type, sponsorId, questions, rewards } = quizData

    const query = {
      text: 'INSERT INTO quiz (name, description, type, sponsor_id, questions, rewards) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      values: [name, description, type, sponsorId, questions, rewards],
    }

    const result = await pg.oneOrNone(query)
    return result
  } catch (err) {
    console.error(err)
    return err
  }
}

// Read: Tüm quizleri getirir
export const getAllQuiz = async () => {
  try {
    const result = await pg
      .manyOrNone('SELECT * FROM quiz')
      .then((res) => {
        return res.map((quiz) => {
          quiz.questions = quiz.questions.map((question) =>
            JSON.parse(question),
          )
          quiz.rewards = quiz.rewards.map((reward) => JSON.parse(reward))
          return quiz
        })
      })
      .catch((err) => {
        console.log('err', err)
        return err
      })

    return result
  } catch (err) {
    console.error(err)
    return err
  }
}

// Update: Varolan bir quizi günceller
export const updateQuiz = async (quizId, updatedData) => {
  try {
    const { name, description, type, sponsorId, questions, rewards } =
      updatedData

    const query = {
      text: 'UPDATE quiz SET name=$2, description=$3, type=$4, sponsor_id=$5, questions=$6, rewards=$7 WHERE id=$1 RETURNING *',
      values: [quizId, name, description, type, sponsorId, questions, rewards],
    }

    const result = await pg.oneOrNone(query)
    return result
  } catch (err) {
    console.error(err)
    return err
  }
}

// Delete: Varolan bir quizi siler
export const deleteQuiz = async (quizId) => {
  try {
    const query = {
      text: 'DELETE FROM quiz WHERE id=$1 RETURNING *',
      values: [quizId],
    }

    const result = await pg.oneOrNone(query)
    return result
  } catch (err) {
    console.error(err)
    return err
  }
}

export const getQuiz = async (quizId) => {
  try {
    const query = {
      text: 'SELECT * FROM quiz WHERE id=$1',
      values: [quizId],
    }

    const result = await pg.oneOrNone(query)
    return result
  } catch (err) {
    console.error(err)
    return err
  }
}

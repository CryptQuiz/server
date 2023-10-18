import { put } from '@vercel/blob'

require('dotenv').config()

export const config = {
  runtime: 'edge',
}

export default async function upload(file) {
  const filename = file.filename
  const blob = await put(filename, file, {
    access: 'public',

    token: process.env.BLOB_READ_WRITE_TOKEN,
    contentType: file.mimetype,
  })

  return blob
}

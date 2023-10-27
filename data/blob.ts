import { head, put } from '@vercel/blob'

require('dotenv').config()

export const config = {
  runtime: 'edge',
}

export async function upload(file) {
  const filename = file.filename

  console.log('file', file)

  const blob = await put(filename, file, {
    access: 'public',
  })

  console.log('blob', blob)

  return blob
}

export async function getBlob(pathname) {
  const blobDetails = await head(pathname)

  return blobDetails
}

export default {
  upload,
  getBlob,
}

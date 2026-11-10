require('dotenv').config()

const uploadImage = async (file, fileName) => {
  const auth = Buffer.from(process.env.IMAGEKIT_PRIVATE_KEY + ':').toString('base64')

  const form = new FormData()
  form.append('file', new Blob([file]), fileName)
  form.append('fileName', fileName)
  form.append('folder', '/products')

  const response = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
    method: 'POST',
    headers: { Authorization: 'Basic ' + auth },
    body: form
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'ImageKit upload failed')
  }

  return data
}

const deleteImage = async (fileId) => {
  const auth = Buffer.from(process.env.IMAGEKIT_PRIVATE_KEY + ':').toString('base64')

  const response = await fetch(`https://api.imagekit.io/v1/files/${fileId}` , {
    method:'Delete',
    headers : {Authorization:   'Basic ' + auth}
  })

  if (!response.ok && response.status !== 404) {
  const text = await response.text()
  throw new Error(`ImageKit delete failed: ${response.status} ${text}`)
}
}

module.exports = {uploadImage, deleteImage}
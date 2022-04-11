import cloudinary from 'cloudinary'

cloudinary.config({
  cloud_name: 'dwt9q6ryr',
  api_key: '234664793968382',
  api_secret: 'tzQyhvvYohqwtMbEIJaM9I_ErBU',
})

const uploads = (file, folder) => {
  return new Promise((resolve) => {
    cloudinary.uploader.upload(
      file,
      (result) => {
        resolve({
          url: result.url,
          id: result.public_id,
        })
      },
      {
        resource_type: 'auto',
        folder: folder,
      }
    )
  })
}

export default uploads

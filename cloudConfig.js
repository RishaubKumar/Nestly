// Configures the Cloudinary API credentials and multer storage engine for image uploads

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'Nestly_DEV',
      allowedformats: ["png","jpg","jpeg"],
    },
  });
  
module.exports = {
    cloudinary,
    storage,
}
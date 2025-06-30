const cloudinary = require('cloudinary').v2;
require('dotenv').config()

cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret
});


exports.UploadCloudary = async (ProfileImg) => {
    try {
        // Accept either a file object or a string path
        const filePath = ProfileImg.path 
        const upload = await cloudinary.uploader.upload(filePath);
        
        return upload;
    } catch (e) {
        console.log(`cloudinary upload error ${e}`);
        throw e;
    }
};
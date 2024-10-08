import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    //upload the file in cloudinary
    const response = await cloudinary.uploader.upload("localFilePath", {
      resource_type: "auto",
      public_id: "profile_image",
    });
    console.log("File is uploaed in Cloudinary", response.url);
    console.log("response is:", response);
    // fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath); //remove the locally saved temoporary file if operation gt failed
  }
};

export { uploadOnCloudinary };

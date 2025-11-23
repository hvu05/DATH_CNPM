import { v2 as cloudinary } from 'cloudinary'

const cloud_url : string = process.env.CLOUDINARY_URL || '';
cloudinary.config(cloud_url);

export default cloudinary
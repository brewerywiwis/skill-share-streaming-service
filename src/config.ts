import dotenv from 'dotenv'

// config() will read your .env file, parse the contents, assign it to process.env.
const envFound = dotenv.config()
if (envFound.error) {
  throw new Error("Couldn't find .env file")
}

process.env.NODE_ENV = process.env.NODE_ENV || 'development'

export default {
  port: parseInt(process.env.PORT || '8080', 10),
  db_host: process.env.DB_HOST || '',
  aws_secret: process.env.AWS_SECRET || '',
  aws_access_key_id: process.env.AWS_ACCESS_KEY_ID || '',
  aws_region: process.env.AWS_REGION || '',
  aws_bucket_name: process.env.AWS_BUCKET_NAME || '',
  aws_video_directory_path: process.env.AWS_VIDEO_DIRECTORY_PATH || '',
}

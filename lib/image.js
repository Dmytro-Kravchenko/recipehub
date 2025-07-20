import { S3 } from '@aws-sdk/client-s3';
import sharp from 'sharp';

const s3 = new S3({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const bucketName = process.env.AWS_BUCKET_NAME;

async function uploadToS3(buffer, fileName) {
    s3.putObject({
    Bucket: bucketName,
    Key: fileName,
    Body: buffer,
    ContentType: 'image/webp',
  });
}

export async function processImage(imageBuffer, fileName) {
  try {
    const optimizedBuffer = await sharp(imageBuffer)
    .resize(800)
    .webp({ quality: 80 })
    .toBuffer();

    await uploadToS3(optimizedBuffer, `${fileName}`);

    const blurBuffer = await sharp(imageBuffer)
    .resize(20)
    .blur(15)
    .webp({ quality: 20 })
    .toBuffer();

    return blurBuffer.toString("base64");
  } catch(error) {
    console.error(error);
    return null;
  }
}
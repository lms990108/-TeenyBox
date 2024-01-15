import { S3, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";

dotenv.config();

// S3 클라이언트 초기화
const s3Client = new S3({
  region: "ap-northeast-2",
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY, // Access Key ID
    secretAccessKey: process.env.S3_SECRET_KEY, // Secret Access Key
  },
});

// S3 버킷 이름 설정
const bucketName = "elice-5th";

// 이미지를 S3에 업로드하는 함수
export async function uploadImageToS3(
  file: Express.Multer.File,
  key: string,
): Promise<string> {
  const uploadParams = {
    Bucket: bucketName,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  await s3Client.send(new PutObjectCommand(uploadParams));
  return `https://${bucketName}.s3.amazonaws.com/${key}`;
}

// S3에서 이미지를 삭제하는 함수
export async function deleteImageFromS3(
  bucketName: string,
  key: string,
): Promise<void> {
  const deleteParams = {
    Bucket: bucketName,
    Key: key,
  };

  await s3Client.send(new DeleteObjectCommand(deleteParams));
}

import { Request, Response } from "express";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  region: "ap-northeast-2",
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
  },
});

class PresignedUrlController {
  async getPresignedUrl(req: Request, res: Response): Promise<Response> {
    const bucketName = process.env.S3_BUCKET_NAME;
    const filename = req.body.key;
    const key = `${new Date().toISOString()}_${filename}`;
    const encodedKey = encodeURIComponent(key);
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
    };

    const command = new PutObjectCommand(params);

    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 600, // 만료 시간 10분
    });

    return res.status(200).json({
      presigned_url: signedUrl,
      public_url: `https://${bucketName}.s3.ap-northeast-2.amazonaws.com/${encodedKey}`,
    });
  }
}

export default new PresignedUrlController();

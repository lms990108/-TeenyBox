import { Request, Response } from "express";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 } from "uuid";
import s3Client from "../config/s3config";

class PresignedUrlController {
  async getPresignedUrl(req: Request, res: Response): Promise<Response> {
    const bucketName = process.env.S3_BUCKET_NAME;
    const filename = req.body.key;
    const uuid = v4().replace(/-/g, "_");
    const key = `${uuid}_${filename}`;
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

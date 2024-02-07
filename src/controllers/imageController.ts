import { uploadImageToS3 } from "../common/utils/awsS3Utils";

export async function uploadImage(req, res) {
  if (!req.file) {
    return res.status(400).send("파일이 전송되지 않았습니다.");
  }

  try {
    const originalNameBuffer = Buffer.from(req.file.originalname, "utf-8");
    const encodedOriginalName = encodeURIComponent(
      originalNameBuffer.toString("utf-8"),
    );
    const key = `promotions/${Date.now()}_${encodedOriginalName}`;
    const encodedKey = encodeURIComponent(key);
    const imageUrl = await uploadImageToS3(req.file, encodedKey);
    res.status(201).json({ imageUrl });
  } catch (error) {
    console.error(error);
    res.status(500).send("이미지 업로드 중 문제가 발생했습니다.");
  }
}

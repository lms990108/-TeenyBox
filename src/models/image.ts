import mongoose, { Document, Schema } from "mongoose";

interface IImage extends Document {
  image_id: number;
  url: string;
  type: string;
}

const ImageSchema = new Schema<IImage>({
  image_id: {
    type: Number,
    required: true,
    unique: true,
    index: true,
  },
  url: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["poster", "detail"],
    required: true,
  },
});

const ImageModel = mongoose.model<IImage>("Image", ImageSchema);

export default ImageModel;

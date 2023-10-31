import mongoose, { Schema, Document } from "mongoose";

export interface IShow extends Document {
  show_id: number;
  title: string;
  start_date: Date;
  end_date: Date;
  location: string;
  cast: string[];
  creator: string;
  runtime: number;
  age: number;
  company: string;
  price: number;
  description: string;
  state: string;
  poster: typeof mongoose.Schema.Types.ObjectId;
  detail_images: (typeof mongoose.Schema.Types.ObjectId)[];
  reviews: (typeof mongoose.Schema.Types.ObjectId)[];
}

const ShowSchema = new Schema<IShow>({
  show_id: {
    type: Number,
    required: true,
    unique: true,
    index: true,
  },
  title: { type: String, required: true },
  start_date: { type: Date, required: true },
  end_date: { type: Date, required: true },
  location: String,
  cast: [String],
  creator: String,
  runtime: Number,
  age: Number,
  company: String,
  price: Number,
  description: String,
  state: {
    type: String,
    enum: ["공연예정", "공연중", "공연완료"],
  },
  poster: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Image",
  },
  detail_images: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Image",
    },
  ],
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

const ShowModel = mongoose.model<IShow>("Show", ShowSchema);

export default ShowModel;

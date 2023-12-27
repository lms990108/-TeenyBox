import { RegionType, StatusType } from "../common/enum/enum";
import mongoose, { Schema, Document } from "mongoose";

export interface IShow extends Document {
  showId: string;
  title: string;
  start_date: Date;
  end_date: Date;
  region: RegionType;
  location?: string;
  latitude?: number;
  longitude?: number;
  seat_cnt?: number;
  cast?: string[];
  creator?: string;
  runtime?: string;
  age?: string;
  company?: string;
  price?: string;
  description?: string;
  state?: StatusType;
  schedule?: string;
  poster?: string;
  detail_images?: string[];
  // reviews?: (typeof mongoose.Schema.Types.ObjectId)[];
}

const ShowSchema = new Schema<IShow>(
  {
    showId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    title: { type: String, required: true },
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true },
    region: String,
    location: String,
    latitude: Number,
    longitude: Number,
    seat_cnt: Number,
    cast: [String],
    creator: String,
    runtime: String,
    age: String, // API 에서 주는 값을 그대로 String으로 저장했으나 확장성을 고려하면 Number로 바꾸는 것이 좋을 것 같다
    company: String,
    price: String,
    description: String,
    state: {
      type: String,
      enum: ["공연예정", "공연중", "공연완료"],
    },
    schedule: String,
    poster: String,
    detail_images: [String],
    // reviews: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Review",
    //   },
    // ],
  },
  {
    timestamps: true,
  },
);

export const ShowModel = mongoose.model<IShow>("Show", ShowSchema);

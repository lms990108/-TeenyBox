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
  rank?: number;
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
  avg_rating: number;
  reviews?: mongoose.Schema.Types.ObjectId[] | null;
}

const ShowSchema = new Schema<IShow>(
  {
    showId: {
      type: String,
      required: true,
      unique: true,
    },
    title: { type: String, required: true },
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true },
    region: String,
    location: String,
    latitude: Number,
    longitude: Number,
    seat_cnt: Number,
    rank: Number,
    cast: [String],
    creator: String,
    runtime: String,
    age: String,
    company: String,
    price: { type: String },
    description: String,
    state: {
      type: String,
      enum: ["공연예정", "공연중", "공연완료"],
    },
    schedule: String,
    poster: String,
    detail_images: [String],
    avg_rating: { type: Number, default: 0 },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
        nullable: true,
      },
    ],
  },
  {
    timestamps: true,
  },
);

ShowSchema.index({ created_at: -1, price: 1, avg_rating: 1 });

export const ShowModel = mongoose.model<IShow>("Show", ShowSchema);

import mongoose, { Schema, Document } from "mongoose";

export interface IShow extends Document {
  show_id: number;
  title: string;
  start_date: Date;
  end_date: Date;
  region: number; // 지역 (서울, 경기, ...)
  location: string; // 공연 장소
  cast: string[];
  creator: string;
  runtime: number; // 런타임
  age: number;
  company: string;
  price: number;
  description: string;
  state: string;
  schedule: string; // 공연 시간
  poster: typeof mongoose.Schema.Types.ObjectId;
  detail_images: (typeof mongoose.Schema.Types.ObjectId)[];
  reviews: (typeof mongoose.Schema.Types.ObjectId)[];
}

const ShowSchema = new Schema<IShow>({
  show_id: {
    type: Number,
    required: true,
    unique: true,
  },
  title: { type: String, required: true },
  start_date: { type: Date, required: true },
  end_date: { type: Date, required: true },
  region: Number,
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
  schedule: String,
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

/**
 * 공연의 경우 업데이트 순서대로 나열됨
 * 검색할 때도 고려하면 title과 updated_at를 인덱스로 사용하는 편이 성능에 더 좋을 것 같음
 * 실제로 explain으로 확인해보기?
 */
ShowSchema.index({ updated_at: -1, title: 1 });

export const ShowModel = mongoose.model<IShow>("Show", ShowSchema);

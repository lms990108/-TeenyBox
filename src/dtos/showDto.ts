import { IShow } from "../models/showModel";

export interface ShowDetailDTO {
  showId: string;
  location: string;
  region: string;
}

export class CreateShowDTO {
  showId: string;
  title: string;
  start_date: string;
  end_date: string;
  region: number;
  location?: string;
  latitude?: number;
  longitude?: number;
  seat_cnt?: number;
  rank?: number;
  cast?: string;
  creator?: string;
  runtime?: string;
  age?: string;
  company?: string;
  price?: string;
  min_price?: number;
  max_price?: number;
  description?: string;
  state?: string;
  schedule?: string;
  poster?: string;
  detail_images?: string[];
}

export class ShowResponseDto {
  showId: string;
  title: string;
  start_date: Date;
  end_date: Date;
  region: string;
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
  state?: string;
  schedule?: string;
  poster?: string;
  detail_images?: string[];
  avg_rating: number;
  review_num: number = 0;
  created_at: Date;
  updated_at: Date;

  constructor(show: IShow) {
    this.showId = show.showId;
    this.title = show.title;
    this.start_date = show.start_date;
    this.end_date = show.end_date;
    this.region = show.region;
    this.location = show.location;
    this.latitude = show.latitude;
    this.longitude = show.longitude;
    this.seat_cnt = show.seat_cnt;
    this.rank = show.rank;
    this.cast = show.cast;
    this.creator = show.creator;
    this.runtime = show.runtime;
    this.age = show.age;
    this.company = show.company;
    this.price = show.price;
    this.description = show.description;
    this.state = show.state;
    this.schedule = show.schedule;
    this.poster = show.poster;
    this.detail_images = show.detail_images;
    this.review_num = show.reviews?.length;
    this.avg_rating = show.avg_rating;
    this.created_at = show.created_at;
    this.updated_at = show.updated_at;
  }
}

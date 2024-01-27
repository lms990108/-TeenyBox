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
  description?: string;
  state?: string;
  schedule?: string;
  poster?: string;
  detail_images?: string[];
}

export class SearchShowDTO {
  public title: string = "";
  public status: string = "";
  public region: string = "";
  public page: number = 1;
  public limit: number = 20;
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
  avg_rating: number = 0;
  review_num: number = 0;

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
  }
}

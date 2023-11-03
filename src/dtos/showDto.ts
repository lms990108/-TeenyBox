import { IsEnum, IsString } from "class-validator";
import {
  STATUS,
  REGION_NAME,
  StatusType,
  RegionType,
} from "../common/enum/enum";

export interface ShowDetailDTO {
  showId: string;
  region: string;
}

export class CreateShowDTO {
  showId: string;
  title: string;
  start_date: string;
  end_date: string;
  region: number;
  location?: string;
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
  @IsString()
  public title?: string;

  @IsString()
  @IsEnum(STATUS)
  public status?: StatusType;

  @IsString()
  @IsEnum(REGION_NAME)
  public region?: RegionType;

  public page: number = 1;
  public limit: number = 20;
}

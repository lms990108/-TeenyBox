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
  public title: string = "";
  public status: string = "";
  public region: string = "";
  public page: number = 1;
  public limit: number = 20;
}

export class CreateReviewDto {
  content: string;
  rate: number;
  createdAt: Date = new Date();
  updatedAt: Date = new Date();
  deletedAt?: Date = null;
}

export class UpdateReviewDto {
  content: string;
  rate: number;
  updated: Date = new Date();
}

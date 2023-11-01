import { IsEnum, IsString } from "class-validator";
import { STATUS, REGION } from "../common/enum/enum";
import { Union } from "../common/enum/CustomUnion";

type Status = Union<typeof STATUS>;
type Region = Union<typeof REGION>;

export class SearchShowDTO {
  @IsString()
  public title?: string;

  @IsString()
  @IsEnum(STATUS)
  public status?: Status;

  @IsString()
  @IsEnum(REGION)
  public region?: Region;

  public skip: number = 0;
  public limit: number = 10;
}

import { ShowModel, IShow } from "../models/show";
import { SearchShowDTO } from "../dtos/showDto";

class showRepository {
  /**
   * create를 할 필요가 있는지 생각해보기
   * API 불러서 그냥 바로 저장하는 게 빠를 듯 함
   */
  async createShow(show: IShow): Promise<IShow> {
    const doc = new ShowModel(show);
    return await doc.save();
  }

  async updateShow(showId: number, show: IShow): Promise<IShow> {
    return await ShowModel.findOneAndUpdate({ show_id: showId }, show, {
      new: true,
    });
  }

  /**
   * updated_at 기준으로 내림차순 정렬하여 skip부터 limit개의 공연을 조회
   * lean: mongoDB에서 조회한 데이터를 Mongoose Document로 바꾸는 과정을 스킵, POJO(Plain Old JavaScript Object)를 반환 -> 더 빠름
   */
  async findShows(searchShowDTO: SearchShowDTO): Promise<IShow[]> {
    const { skip, limit } = searchShowDTO;
    return await ShowModel.find()
      .skip(skip)
      .limit(limit)
      .lean()
      .populate("poster");
  }

  async findShowByShowId(showId: number) {
    return await ShowModel.findOne({ show_id: showId });
  }

  async findShowByTitle(title: string) {
    return await ShowModel.findOne({ title: title })
      .populate("poster")
      .populate("detail_images")
      .populate("reviews");
  }

  /**
   * title을 포함하는 공연들을 조회
   */
  async searchByTitle(searchShowDTO: SearchShowDTO): Promise<IShow[]> {
    const { title, skip, limit } = searchShowDTO;
    return await ShowModel.find({ title: { $regex: title, $options: "i" } })
      .skip(skip)
      .limit(limit)
      .lean()
      .populate("poster");
  }

  async searchByStatus(searchShowDTO: SearchShowDTO): Promise<IShow[]> {
    const { status, skip, limit } = searchShowDTO;
    return await ShowModel.find({ status: status })
      .skip(skip)
      .limit(limit)
      .lean()
      .populate("poster");
  }

  async searchByRegion(searchShowDTO: SearchShowDTO): Promise<IShow[]> {
    const { region, skip, limit } = searchShowDTO;
    return await ShowModel.find({ region: region })
      .skip(skip)
      .limit(limit)
      .lean()
      .populate("poster");
  }

  async deleteByShowId(showId: number) {
    return await ShowModel.findOneAndDelete({ show_id: showId });
  }

  async deleteByTitle(title: string) {
    return await ShowModel.findOneAndDelete({ title: title });
  }
}

export default new showRepository();

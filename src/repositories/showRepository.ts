import { ShowModel, IShow } from "../models/showModel";
import { CreateShowDTO } from "../dtos/showDto";

class showRepository {
  async createShow(showDetail: CreateShowDTO): Promise<IShow> {
    const show = new ShowModel(showDetail);
    return await show.save();
  }

  async updateShow(showId: string, showDetail: CreateShowDTO): Promise<IShow> {
    return await ShowModel.findOneAndUpdate({ showId }, showDetail, {
      new: true,
    });
  }

  async updateShowsByQuery(findQuery, updateQuery) {
    return await ShowModel.updateMany(findQuery, updateQuery, { new: true });
  }

  async isShowExist(showId: string): Promise<boolean> {
    return (await ShowModel.countDocuments({ showId })) > 0;
  }

  async findShows(page: number, limit: number) {
    return await ShowModel.find()
      .sort({ updated_at: -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .lean();
  }

  async findShowByShowId(showId: string) {
    return await ShowModel.findOne({ showId });
  }

  async findShowByTitle(title: string) {
    return await ShowModel.findOne({ title: title });
  }

  async search(query, page: number, limit: number) {
    return await ShowModel.aggregate([
      { $match: query },
      { $sort: { updated_at: -1 } },
      { $limit: limit },
      { $skip: (page - 1) * limit },
    ]);
  }

  async deleteByShowId(showId: string) {
    return await ShowModel.findOneAndDelete({ showId });
  }
}

export default new showRepository();

import { ShowModel, IShow } from "../models/showModel";
import { CreateShowDTO } from "../dtos/showDto";

class showRepository {
  async createShow(showDetail: CreateShowDTO): Promise<IShow> {
    const show = new ShowModel(showDetail);
    return await show.save();
  }

  async updateShow(showId: string, showDetail: CreateShowDTO): Promise<IShow> {
    return ShowModel.findOneAndUpdate({ showId }, showDetail, {
      new: true,
    });
  }

  async updateShowsByQuery(findQuery, updateQuery) {
    return ShowModel.updateMany(findQuery, updateQuery, { new: true });
  }

  async isShowExist(showId: string): Promise<boolean> {
    return (await ShowModel.countDocuments({ showId })) > 0;
  }

  async findShowByShowId(showId: string) {
    return ShowModel.findOne({ showId });
  }

  async findShows(match: object, sort, page: number, limit: number) {
    const shows = await ShowModel.aggregate([
      { $match: match },
      { $sort: sort },
      { $limit: limit },
      { $skip: (page - 1) * limit },
    ]);
    const total = await ShowModel.countDocuments(match);

    return { shows, total };
  }

  async findShowsByRank() {
    return ShowModel.aggregate([
      { $match: { state: "공연중", rank: { $exists: true } } },
      { $sort: { rank: 1 } },
      { $limit: 18 },
    ]);
  }

  async deleteByShowId(showId: string) {
    return ShowModel.findOneAndDelete({ showId });
  }
}

export default new showRepository();

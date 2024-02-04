import { IShow, ShowModel } from "../models/showModel";
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

  async findShows(match: object, sort, page?: number, limit?: number) {
    const shows = await ShowModel.aggregate([
      { $match: match },
      { $sort: sort },
      { $skip: (page - 1) * limit },
      { $limit: limit },
    ]);
    const total = await ShowModel.countDocuments(match);

    return { shows, total };
  }

  async findShowsWithoutPaging(match: object, sort) {
    const shows = await ShowModel.aggregate([
      { $match: match },
      { $sort: sort },
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

  async findShowsForChildren() {
    return ShowModel.aggregate([
      {
        $match: {
          age: {
            $in: ["전체 관람가", "만 5세 이상", "만 6세 이상", "만 7세 이상"],
          },
        },
      },
      { $sample: { size: 18 } }, // 랜덤하게 18개
    ]);
  }

  async findShowsNumberByDate() {
    const startDate = new Date();
    const endDate = new Date();
    startDate.setMonth(new Date().getMonth() - 6);
    endDate.setMonth(new Date().getMonth() + 6);

    const dateRange = await this.createDateRange(startDate, endDate);
    return await Promise.all(
      dateRange.map((date) => this.getShowsCountForDate(date)),
    );
  }

  private async getShowsCountForDate(date: Date) {
    const count = await ShowModel.aggregate([
      {
        $match: {
          start_date: { $lte: date },
          end_date: { $gte: date },
        },
      },
      {
        $group: {
          _id: null,
          totalShows: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          totalShows: 1,
        },
      },
    ]);

    const totalShows = count.length > 0 ? count[0].totalShows : 0;

    return {
      date,
      totalShows,
    };
  }

  private async createDateRange(start: Date, end: Date): Promise<Date[]> {
    const dateRange = [];
    const currentDate = new Date(start);

    while (currentDate <= end) {
      const formattedDate = currentDate.toISOString().split("T")[0];
      dateRange.push(new Date(formattedDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dateRange;
  }

  async deleteByShowId(showId: string) {
    return ShowModel.findOneAndDelete({ showId });
  }
}

export default new showRepository();

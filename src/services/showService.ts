import { CreateShowDTO } from "../dtos/showDto";
import showRepository from "../repositories/showRepository";
import NotFoundError from "../common/error/NotFoundError";
import BadRequestError from "../common/error/BadRequestError";
import { UpdateShowsQuery } from "../common/query/updateShowsQuery";

class showService {
  async createShow(showDetail: CreateShowDTO) {
    const isExist = await showRepository.isShowExist(showDetail.showId);
    if (isExist) throw new BadRequestError("이미 존재하는 공연입니다.");

    const show = await showRepository.createShow(showDetail);
    if (!show) throw new NotFoundError("공연을 생성할 수 없습니다."); // Todo: 500 에러로 변경

    return show;
  }

  async updateShow(showId: string, showDetail: CreateShowDTO) {
    const isExist = await showRepository.isShowExist(showDetail.showId);
    if (!isExist) throw new BadRequestError("존재하지 않는 공연입니다.");

    const show = await showRepository.updateShow(showId, showDetail);
    if (!show)
      throw new NotFoundError(`showId: ${showId} 공연을 수정할 수 없습니다.`); // Todo: 500 에러로 변경

    return show;
  }

  async updateShowsByQuery(updateShowsQuery: UpdateShowsQuery) {
    const { findQuery, updateQuery } = updateShowsQuery;

    const shows = await showRepository.updateShowsByQuery(
      findQuery,
      updateQuery,
    );

    if (!shows) {
      throw new NotFoundError("공연을 수정할 수 없습니다.");
    }

    return shows;
  }

  async isShowExist(showId: string) {
    return await showRepository.isShowExist(showId);
  }

  async findShows(match: object, sort, page: number, limit: number) {
    const { shows, total } = await showRepository.findShows(
      match,
      sort,
      page,
      limit,
    );

    if (!shows) {
      throw new NotFoundError(`검색 결과: 해당하는 공연을 찾을 수 없습니다.`);
    }

    return { shows, total };
  }

  async findShowsByRank() {
    return await showRepository.findShowsByRank();
  }

  async findShowsByDate(date: Date) {
    return await showRepository.findShowsByDate(date);
  }

  async findShowsNumberByDate() {
    return await showRepository.findShowsNumberByDate();
  }

  async findShowByShowId(showId: string) {
    const show = await showRepository.findShowByShowId(showId);

    if (!show) {
      throw new NotFoundError(`${showId} 공연을 찾을 수 없습니다.`);
    }

    return show;
  }

  async deleteByShowId(showId: string) {
    const isExist = await showRepository.isShowExist(showId);
    if (!isExist) throw new NotFoundError("존재하지 않는 공연입니다.");

    const show = await showRepository.deleteByShowId(showId);

    if (!show) {
      throw new BadRequestError(`${showId} 공연을 삭제할 수 없습니다.`);
    }

    return show.showId;
  }
}

export default new showService();

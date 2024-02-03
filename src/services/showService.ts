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

  async findShows(match: object, sort, page?: number, limit?: number) {
    let shows, total;

    if (page !== undefined && limit !== undefined) {
      // 페이지네이션을 수행하는 코드
      const result = await showRepository.findShows(match, sort, page, limit);
      shows = result.shows;
      total = result.total;
    } else {
      // 페이지네이션 없이 모든 결과를 가져오는 코드
      const result = await showRepository.findShowsWithoutPaging(match, sort);
      shows = result.shows;
      total = result.total;
    }

    if (!shows) {
      throw new NotFoundError(`검색 결과: 해당하는 공연을 찾을 수 없습니다.`);
    }

    return { shows, total };
  }

  async findShowsByRank() {
    return await showRepository.findShowsByRank();
  }

  async findShowsForChildren() {
    return await showRepository.findShowsForChildren();
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

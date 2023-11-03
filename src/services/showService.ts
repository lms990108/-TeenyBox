import { CreateShowDTO, SearchShowDTO } from "../dtos/showDto";
import showRepository from "../repositories/showRepository";
import NotFoundError from "../common/error/NotFoundError";
import BadRequestError from "../common/error/BadRequestError";

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

  async isShowExist(showId: string) {
    return await showRepository.isShowExist(showId);
  }

  async findShows(page: number, limit: number) {
    const shows = await showRepository.findShows(page, limit);

    if (!shows) {
      throw new NotFoundError("전체 공연 목록을 조회할 수 없습니다.");
    }
    return shows;
  }

  async findShowByShowId(showId: string) {
    const show = await showRepository.findShowByShowId(showId);

    if (!show) {
      throw new NotFoundError(`${showId} 공연을 찾을 수 없습니다.`);
    }

    return show;
  }

  async findShowByTitle(title: string) {
    const show = await showRepository.findShowByTitle(title);

    if (!show) {
      throw new NotFoundError(`${title} 공연을 찾을 수 없습니다.`);
    }

    return show;
  }

  async search(searchShowDTO: SearchShowDTO) {
    const shows = await showRepository.search(searchShowDTO);

    if (!shows) {
      throw new NotFoundError(`검색 결과: 해당하는 공연을 찾을 수 없습니다.`);
    }

    return shows;
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

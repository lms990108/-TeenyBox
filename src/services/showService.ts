import { SearchShowDTO } from "../dtos/showDto";
import showRepository from "../repositories/showRepository";

class showService {
  async findShows(searchShowDTO: SearchShowDTO) {
    return await showRepository.findShows(searchShowDTO);
  }

  async findShowByShowId(showId: number) {
    return await showRepository.findShowByShowId(showId);
  }

  async findShowByTitle(title: string) {
    return await showRepository.findShowByTitle(title);
  }

  async searchByTitle(searchShowDTO: SearchShowDTO) {
    return await showRepository.searchByTitle(searchShowDTO);
  }

  async searchByStatus(searchShowDTO: SearchShowDTO) {
    return await showRepository.searchByStatus(searchShowDTO);
  }

  async searchByRegion(searchShowDTO: SearchShowDTO) {
    return await showRepository.searchByRegion(searchShowDTO);
  }

  async deleteByShowId(showId: number) {
    return await showRepository.deleteByShowId(showId);
  }

  async deleteByTitle(title: string) {
    return await showRepository.deleteByTitle(title);
  }
}

export default new showService();

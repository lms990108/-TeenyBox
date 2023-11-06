import showService from "../../../services/showService";
import { updateShowsQuery } from "../../../types/updateShowsQuery";
import logger from "../logger";

export async function updateShowStatusJob() {
  const today = new Date();
  today.setHours(today.getHours() + 9); // Convert UTC to KST

  const updateEndedShowsQuery: updateShowsQuery = {
    findQuery: { end_date: { $lt: today } },
    updateQuery: { state: "공연완료" },
  };

  const updateOngoingShowsQuery: updateShowsQuery = {
    findQuery: { start_date: { $lte: today }, end_date: { $gt: today } },
    updateQuery: { state: "공연중" },
  };

  try {
    await Promise.all([
      showService.updateShowsByQuery(updateEndedShowsQuery),
      showService.updateShowsByQuery(updateOngoingShowsQuery),
    ]);
  } catch (error) {
    logger.error(error);
  }
}

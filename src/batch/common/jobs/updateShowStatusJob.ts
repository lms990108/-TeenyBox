import showService from "../../../services/showService";
import { updateShowsQuery } from "../../../types/updateShowsQuery";
import logger from "../logger";
import getBoxofficeInfoJob from "./getBoxofficeInfoJob";

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

  const boxofficeInfos = await getBoxofficeInfoJob(today);
  const updatePromises = boxofficeInfos.map((boxofficeInfo) => {
    const { showId, rank } = boxofficeInfo;
    const updateRankQuery: updateShowsQuery = {
      findQuery: { showId },
      updateQuery: { rank },
    };

    return showService
      .updateShowsByQuery(updateRankQuery)
      .catch((error) => logger.error(error));
  });

  try {
    await Promise.all([
      ...updatePromises,
      showService.updateShowsByQuery(updateEndedShowsQuery),
      showService.updateShowsByQuery(updateOngoingShowsQuery),
    ]);
  } catch (error) {
    logger.error(error);
  }
}

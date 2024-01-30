import showService from "../../../services/showService";
import logger from "../logger";
import getBoxofficeInfoJob from "./getBoxofficeInfoJob";
import { UpdateShowsQuery } from "../../../common/query/updateShowsQuery";

export async function updateShowStatusJob() {
  const today = new Date();
  today.setHours(today.getHours() + 9); // Convert UTC to KST

  const updateEndedShowsQuery: UpdateShowsQuery = {
    findQuery: { end_date: { $lt: today } },
    updateQuery: { state: "공연완료" },
  };

  const updateOngoingShowsQuery: UpdateShowsQuery = {
    findQuery: { start_date: { $lte: today }, end_date: { $gt: today } },
    updateQuery: { state: "공연중" },
  };

  const boxofficeInfos = await getBoxofficeInfoJob(today);
  const updatePromises = boxofficeInfos.map((boxofficeInfo) => {
    const { showId, rank } = boxofficeInfo;
    const updateRankQuery: UpdateShowsQuery = {
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

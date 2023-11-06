import showService from "../../../services/showService";
import logger from "../logger";

export async function updateShowStatusJob() {
  const today = new Date();
  today.setHours(today.getHours() + 9); // Convert UTC to KST

  const findQuery = { end_date: { $lt: today.getDate() } };
  const updateQuery = { state: "공연완료" };

  try {
    await showService.updateShowsByQuery(findQuery, updateQuery);
  } catch (error) {
    logger.error(error);
  }
}

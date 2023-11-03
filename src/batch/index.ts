import logger from "./common/logger";
import mongoose from "mongoose";
import { MONGO_DB_PATH } from "./config/secret";
import { getShowListJob } from "./common/jobs/getShowListJob";
import getShowDetailJob from "./common/jobs/getShowDetailJob";
import showService from "../services/showService";
import ShowListParams from "./@types/ShowListParams";
import { ShowDetailDTO } from "../dtos/showDto";

const mongoURI = MONGO_DB_PATH;

async function connectToMongo(): Promise<void> {
  try {
    await mongoose.connect(mongoURI);
    logger.info("Connected to MongoDB.");
  } catch (err) {
    logger.error("Failed to connect to MongoDB.", err);
    process.exit(1);
  }
}

async function processShow(show: ShowDetailDTO): Promise<void> {
  const isExist = await showService.isShowExist(show.showId);
  if (!isExist) {
    const showDetail = await getShowDetailJob(show.showId, show.region);
    await showService.createShow(showDetail);
    logger.info(`Show titled '${showDetail.title}' has been created.`);
  }
}

async function processShows(params: ShowListParams): Promise<number> {
  const showList: ShowDetailDTO[] = await getShowListJob(params);
  await Promise.all(showList.map(processShow));
  return showList.length;
}

async function batchProcess(params: ShowListParams): Promise<void> {
  let page = params.cpage;

  while (true) {
    const showCount = await processShows(params);

    if (showCount < params.rows) {
      logger.info(
        `Processed ${showCount} shows. Reached the last page (#${page}).`,
      );
      break;
    }

    logger.info(`Processed ${showCount} shows on page #${page}.`);
    params.cpage = ++page;
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Throttle the requests
  }
}

async function main() {
  await connectToMongo();

  const params: ShowListParams = {
    stdate: "20230601",
    eddate: "20231102",
    rows: 10,
    cpage: 1,
  };

  try {
    await batchProcess(params);
    logger.info("Batch process completed successfully.");
  } catch (err) {
    logger.error("An error occurred during the batch process.", err);
  } finally {
    mongoose.disconnect();
    process.exit(0); // Exit the process when the batch job is done or an error has occurred
  }
}

if (require.main === module) {
  main();
}

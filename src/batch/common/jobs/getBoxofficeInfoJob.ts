import fetchXML from "../../utils/xmlParser";
import logger from "../logger";
import InternalServerError from "../../../common/error/InternalServerError";

export default async function getBoxofficeInfoJob(today: Date) {
  const getBoxofficeInfoURL = `http://kopis.or.kr/openApi/restful/boxoffice`;
  const params = {
    service: process.env.KOPIS_API_KEY,
    ststype: "week", // 주간
    catecode: "AAAA", // 연극
    date: today.toISOString().slice(0, 10).replace(/-/g, ""),
  };

  try {
    const jsonObj = await fetchXML(getBoxofficeInfoURL, params);
    const boxofficeInfos = jsonObj["boxofs"]["boxof"] || [];
    const infoLists = [];

    if (!boxofficeInfos) {
      throw new InternalServerError(`No boxofficeInfo found for ${today}`);
    }

    for (const boxofficeInfo of boxofficeInfos) {
      const showId = boxofficeInfo["mt20id"];
      const rank = boxofficeInfo["rnum"];

      infoLists.push({ showId, rank });
    }

    return infoLists;
  } catch (err) {
    logger.error(
      `Error fetching ranking information for ${today}: ${err.message}`,
    );
    throw err;
  }
}

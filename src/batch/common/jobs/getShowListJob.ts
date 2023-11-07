import axios from "axios";
import logger from "../logger";
import { XMLParser } from "fast-xml-parser";
import { ShowDetailDTO } from "../../../dtos/showDto";
import ShowListParams from "../../types/ShowListParams";
import { REGION } from "../../../common/enum/enum";

function handleRegion(regionName: string): string {
  const regionMap = {
    경기: "경기/인천",
    인천: "경기/인천",
    전북: "전라",
    전남: "전라",
    경북: "경상",
    경남: "경상",
    충북: "충청",
    충남: "충청",
  };
  return regionMap[regionName] || regionName;
}

async function fetchShowsForRegion(
  params: ShowListParams,
  regionCode: number,
  regionName: string,
): Promise<ShowDetailDTO[]> {
  const URL = "http://kopis.or.kr/openApi/restful/pblprfr";
  const SHCATE = "AAAA"; // 연극 코드 (장르)

  logger.info(
    `Fetching show list for region ${regionName} at page ${params.cpage}...`,
  );

  try {
    const response = await axios.get(URL, {
      params: {
        ...params,
        service: process.env.KOPIS_API_KEY,
        shcate: SHCATE,
        signgucode: regionCode,
      },
    });

    const parser = new XMLParser();
    const jsonObj = parser.parse(response.data);
    const shows = jsonObj["dbs"]["db"] || [];

    const handledRegionName = handleRegion(regionName);
    const showDetails: ShowDetailDTO[] = shows.map((show) => ({
      showId: show["mt20id"],
      location: show["fcltynm"],
      region: handledRegionName,
    }));

    logger.info(
      `Fetched ${showDetails.length} shows for region ${handledRegionName}`,
    );
    return showDetails;
  } catch (err) {
    logger.error(
      `Error fetching show list for region ${regionName}: ${err.message}`,
    );
    throw err; // Rethrow the error to be handled by the caller
  }
}

export async function getShowListJob(
  params: ShowListParams,
): Promise<ShowDetailDTO[]> {
  const fetchPromises = Object.entries(REGION).map(([name, code]) =>
    fetchShowsForRegion(params, code, name).catch((err) => {
      logger.error(`Failed to fetch shows for region ${name}: ${err.message}`);
      return []; // Return an empty array in case of an error to continue processing other regions
    }),
  );

  const showArrays = await Promise.all(fetchPromises);
  const shows = showArrays.flat(); // Flatten the array of arrays into a single array

  logger.info(`getShowListJob: ${shows.length} shows found`);
  return shows;
}

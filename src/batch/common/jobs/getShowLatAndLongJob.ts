import logger from "../logger";
import fetchXML from "../../utils/xmlParser";
import BadRequestError from "../../../common/error/BadRequestError";
interface LocationDetail {
  latitude: number;
  longitude: number;
  seatCnt: number;
}

async function getLocationId(location: string): Promise<string> {
  const getLocationListURL = `http://kopis.or.kr/openApi/restful/prfplc`;
  const params = {
    service: process.env.KOPIS_API_KEY,
    rows: 1,
    cpage: 1,
    shprfnmfct: location,
  };

  const jsonObj = await fetchXML(getLocationListURL, params);
  const locations = jsonObj["dbs"]["db"] || [];

  if (!locations) {
    throw new Error(`No location found for ${location}`);
  }

  const locationId = locations["mt10id"];
  return locationId;
}

async function getLocationDetailJob(
  locationId: string,
): Promise<LocationDetail> {
  const url = `http://kopis.or.kr/openApi/restful/prfplc/${locationId}`;
  const params = { service: process.env.KOPIS_API_KEY };
  const jsonObj = await fetchXML(url, params);
  const locationDetail = jsonObj["dbs"]["db"] || [];

  if (!locationDetail) {
    throw new BadRequestError(`No location detail found for ${locationId}`);
  }

  const latitude = Number(locationDetail["la"]);
  const longitude = Number(locationDetail["lo"]);
  const seatCnt = Number(locationDetail["seatscale"]);

  return { latitude, longitude, seatCnt };
}

export async function getLocationLatAndLongJob(location: string) {
  try {
    const locationId: string = await getLocationId(location);
    return await getLocationDetailJob(locationId);
  } catch (err) {
    logger.error(
      `Error fetching location detail for ${location}: ${err.message}`,
    );
    throw err;
  }
}

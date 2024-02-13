import axios from "axios";
import { XMLParser } from "fast-xml-parser";
import { CreateShowDTO } from "../../../dtos/showDto";
import { getLocationLatAndLongJob } from "./getShowLatAndLongJob";

function convertToDate(dateStr: string) {
  const formattedDate = dateStr.replace(/\./g, "-");
  return new Date(formattedDate);
}

function parsePrice(priceStr: string) {
  if (priceStr === "전석무료" || priceStr === "" || !priceStr) return { minPrice: 0, maxPrice: 0 };
  const priceStrWithoutString = priceStr.replace(/\D/g, "");

  const priceChunks = priceStrWithoutString.match(/.{1,5}/g) || [];
  const parsedPrices = priceChunks.map((chunk: string) => parseInt(chunk));

  if (parsedPrices && parsedPrices.length < 2) {
    const price = parsedPrices[0]
    return { minPrice: price, maxPrice: price };
  } else if (parsedPrices && parsedPrices.length > 1) {
    const maxPrice = Math.max(...parsedPrices)
    const minPrice = Math.min(...parsedPrices)
    return { minPrice, maxPrice };
  }
}

function parseShowData(
  xmlData: string,
  latitude: number,
  longitude: number,
  seatCnt: number,
  region: string,
): CreateShowDTO {
  const parser = new XMLParser();
  const jsonObj = parser.parse(xmlData);

  const show = jsonObj["dbs"]["db"];
  const start_date = convertToDate(show["prfpdfrom"]);
  const end_date = convertToDate(show["prfpdto"]);
  const detail_images = show["styurls"] ? show["styurls"]["styurl"] : [];

  let priceStr = show["pcseguidance"];

  // 오마이갓 예외 처리
  const showId = show["mt20id"]
  if (showId === "PF216355") {
    priceStr = "전석 45,000원"
  }

  const { minPrice, maxPrice} = parsePrice(priceStr);

  return {
    showId,
    title: show["prfnm"],
    start_date: start_date,
    end_date: end_date,
    region: region,
    location: show["fcltynm"],
    latitude: latitude,
    longitude: longitude,
    seat_cnt: seatCnt,
    cast: show["prfcast"],
    creator: show["prfcrew"],
    runtime: show["prfruntime"],
    age: show["prfage"],
    company: show["entrpsnm"],
    price: priceStr,
    min_price: minPrice,
    max_price: maxPrice,
    description: show["sty"],
    state: show["prfstate"],
    schedule: show["dtguidance"],
    poster: show["poster"],
    detail_images: detail_images,
  } as unknown as CreateShowDTO;
}

export default async function getShowDetailJob(
  showId: string,
  location: string,
  region: string,
) {
  const getShowDetailURL = `http://kopis.or.kr/openApi/restful/pblprfr/${showId}`;

  try {
    const response = await axios.get(getShowDetailURL, {
      params: {
        service: process.env.KOPIS_API_KEY,
      },
    });
    const { latitude, longitude, seatCnt } =
      await getLocationLatAndLongJob(location);

    return parseShowData(response.data, latitude, longitude, seatCnt, region);
  } catch (err) {
    console.error("Error fetching show details:", err);
  }
}

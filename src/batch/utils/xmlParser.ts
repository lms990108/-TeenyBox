import axios from "axios";
import logger from "../common/logger";
import { XMLParser } from "fast-xml-parser";

export default async function fetchXML(url: string, params: object) {
  try {
    const response = await axios.get(url, { params });
    const parser = new XMLParser();
    return parser.parse(response.data);
  } catch (err) {
    logger.error(`Error fetching XML from ${url}: ${err.message}`);
    throw err;
  }
}

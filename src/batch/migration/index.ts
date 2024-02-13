// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import logger from "../common/logger";
// import { ShowModel } from "../../models/showModel";
//
// dotenv.config();
//
// const mongoURI = process.env.MONGO_DB_PATH;
//
// async function connectToMongo(): Promise<void> {
//   try {
//     await mongoose.connect(mongoURI);
//     logger.info("Connected to MongoDB.");
//   } catch (err) {
//     logger.error("Failed to connect to MongoDB.", err);
//     process.exit(1);
//   }
// }
//
// async function changePrice() {
//   const shows = await ShowModel.find();
//   logger.info(`Shows length: ${shows.length}`);
//
//   for (const show of shows) {
//     const priceStr = show.price;
//     if (priceStr === "전석무료" || priceStr === "" || !priceStr) {
//       show.price_number = 0;
//       await show.save();
//       continue;
//     }
//
//     const priceStrWithoutString = priceStr.replace(/\D/g, "");
//     const priceChunks = priceStrWithoutString.match(/.{1,5}/g) || []; // Split into chunks of 5 characters
//     const parsedPrices = priceChunks.map((chunk: string) => parseInt(chunk));
//
//     if (parsedPrices && parsedPrices.length < 2) {
//       logger.info(`Show title: ${show.title}, parsedPrice: ${parsedPrices[0]}`);
//       show.price_number = parsedPrices[0];
//     } else if (parsedPrices && parsedPrices.length > 1) {
//       const minPrice = Math.min(...parsedPrices);
//       logger.info(
//         `Show title: ${show.title}, Length: ${parsedPrices.length}, minPrice: ${minPrice}, array: ${parsedPrices}`,
//       );
//       show.price_number = minPrice;
//     } else {
//       logger.info(
//         `Show title: ${show.title}, Length: ${parsedPrices.length}, array: ${parsedPrices}`,
//       );
//       show.price_number = 0;
//     }
//
//     await show.save();
//   }
// }
//
// async function main() {
//   await connectToMongo();
//
//   try {
//     logger.info("Start changing price field of show data");
//     await changePrice();
//   } catch (err) {
//     logger.error("An error occurred during the batch process.", err);
//   } finally {
//     await mongoose.disconnect();
//     process.exit(0); // Exit the process when the batch job is done or an error has occurred
//   }
// }
//
// if (require.main === module) {
//   main();
// }

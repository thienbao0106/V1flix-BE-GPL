import puppeteer from "puppeteer";
import { uploadEpisodeThumbToCloudinary } from "./image";

export const wikipediaScrap = async (
  url: string,
  totalEpisodes: number,
  skipElements?: number
) => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });
  // Open a new page
  const page = await browser.newPage();
  // On this new page:
  await page.goto(url, {
    waitUntil: "domcontentloaded",
  });

  // Get page data
  const descriptions = await page.evaluate(() => {
    // Fetch the first element with class "quote"
    // Get the displayed text and returns it
    const episodeList = document.querySelectorAll(".description");

    // Convert the quoteList to an iterable array
    // For each quote fetch the text and author
    return Array.from(episodeList).map((detail: any, index: number) => {
      // Fetch the sub-elements from the previously fetched quote element
      // Get the displayed text and return it (`.innerText`)
      const description = detail.textContent;
      return { epNum: index + 1, description };
    });
  });

  await browser.close();
  const result = skipElements
    ? descriptions.slice(skipElements, skipElements + totalEpisodes)
    : descriptions.slice(0, totalEpisodes);
  return result;
};

function delay(time: any) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

export const crunchyrollScrap = async (
  url: string,
  totalEpisodes: number,
  clickCount?: number
) => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });
  // Open a new page
  const page = await browser.newPage();
  // On this new page:
  await page.goto(url, {
    waitUntil: "domcontentloaded",
  });
  // await page.waitForSelector("[data-t='card-image']");
  // Wait for the button to be available in the DOM
  await page.waitForSelector('[data-t="next-season"]');

  await page.click('[data-t="next-season"]', { count: clickCount });
  await delay(5000);
  await page.waitForSelector("[data-t='card-image']");
  // Get page data
  const thumbnails = await page.evaluate(() => {
    const imgList = Array.from(
      document.querySelectorAll("[data-t='card-image']")
    );
    const total = imgList.length;
    const list =
      total % 2 === 0
        ? imgList.filter((item, index) => {
            if (index % 2 === 0) return item;
          })
        : imgList.filter((item, index) => {
            if (index % 2 !== 0) return item;
          });
    return list.map((item: any, index: number) => {
      return {
        epNum: index + 1,
        thumb: item.src,
      };
    });
  });

  await browser.close();
  return thumbnails.slice(0, totalEpisodes);
};

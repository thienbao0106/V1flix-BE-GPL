import puppeteer from "puppeteer";

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

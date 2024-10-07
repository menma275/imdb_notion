import type { IMDbInfo } from "./vite-env";

function getInfo() {
  const title = document.querySelector("span.hero__primary-text")?.textContent;
  const originalTitle = document
    .querySelector(".sc-ec65ba05-1.fUCCIx")
    ?.textContent?.replace("Original title: ", "");

  const directorItem = document.querySelector("li.ipc-metadata-list__item");
  let director;
  if (
    directorItem &&
    directorItem.querySelector("span")?.textContent?.trim() === "Director"
  ) {
    director = directorItem.querySelector("a")?.textContent?.trim();
  }

  const tagElements = document.querySelectorAll(
    ".ipc-chip-list__scroller .ipc-chip__text"
  );
  const tags = Array.from(tagElements).map((span) => span?.textContent?.trim());

  const country = document
    .querySelector("li[data-testid='title-details-origin'] a")
    ?.textContent?.trim();

  const isTVSeries = Array.from(
    document.querySelectorAll("ul.sc-ec65ba05-2 li.ipc-inline-list__item")
  ).some((li) => li?.textContent?.trim().toLowerCase() === "tv series");

  const imageLink = document.querySelector<HTMLImageElement>(
    ".ipc-media__img.ipc-media--dynamic img.ipc-image"
  )?.src;

  return {
    title,
    originalTitle,
    director,
    tags,
    country,
    isTVSeries,
    imageLink,
  };
}

const storageKey = "imdbInfo";

const info = getInfo();
const { title, originalTitle, director, tags, country, isTVSeries, imageLink } =
  info as IMDbInfo;

chrome.storage.local.set({
  [storageKey]: {
    title: title || "",
    originalTitle: originalTitle || "",
    director: director || "",
    tags: tags || [],
    country: country || "",
    isTVSeries: isTVSeries || false,
    imageLink: imageLink || "",
  },
});

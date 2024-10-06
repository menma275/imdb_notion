import { Client } from "@notionhq/client";

console.log("background.ts");

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.action === "saveData") {
    handleSaveData(message.data[0])
      .then(() => {
        sendResponse({ status: "success" });
      })
      .catch((error) => {
        console.error("Notionへの保存中にエラーが発生しました:", error);
        sendResponse({ status: "error", message: error.message });
      });
    return true; // 非同期レスポンスを示すために必要
  }
});

async function handleSaveData(data: any) {
  const localStorage = await chrome.storage.local.get([
    "apiToken",
    "databaseId",
  ]);

  if (!data) {
    throw new Error("データが提供されていません");
  }

  const notion = new Client({
    auth: localStorage.apiToken,
  });

  await notion.pages.create({
    parent: {
      database_id: localStorage.databaseId,
    },
    properties: {
      Title: {
        title: [{ text: { content: data.imdbInfo.title || "" } }],
      },
      Director: {
        rich_text: [
          {
            type: "text",
            text: { content: data.imdbInfo.director || "" },
          },
        ],
      },
      Country: {
        select: {
          name: data.imdbInfo.country || "",
        },
      },
      Genre: {
        select: {
          name: data.imdbInfo.isTVSeries ? "TV Series" : "Movie",
        },
      },
      Tags: {
        multi_select:
          data.imdbInfo.tags?.map((tag: string) => ({
            name: tag,
          })) || [],
      },
      Rating: {
        number: data.rating || 5,
      },
      Comment: {
        rich_text: [{ text: { content: data.comment || "" } }],
      },
      Date: {
        date: {
          start: new Date().toISOString(),
        },
      },
    },
  });

  console.log("Notionに正常に保存されました");
}

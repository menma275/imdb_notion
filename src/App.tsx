import type { IMDbInfo, Datas, WatchedOn } from "./vite-env";
import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [imdbInfo, setImdbInfo] = useState<IMDbInfo | null>(null);
  const [datas, setDatas] = useState<Datas[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");
  const [isOptionSetted, setIsOptionSetted] = useState(false);

  useEffect(() => {
    chrome.storage.local.get("imdbInfo", (data) => {
      setImdbInfo(data.imdbInfo);
      setDatas([
        {
          imdbInfo: data.imdbInfo,
          rating: 5,
          comment: "",
          watchedOn: "Theater",
        },
      ]);
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0] && tabs[0].url) {
          setCurrentUrl(tabs[0].url);
        }
      });
    });
    chrome.storage.local.get(["apiToken", "databaseId"], (result) => {
      if (result.apiToken && result.databaseId) {
        setIsOptionSetted(true);
      }
    });
  }, []);

  const handleSubmit = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs[0] && tabs[0].id) {
        setIsLoading(true);
        chrome.runtime.sendMessage(
          { action: "saveData", data: datas },
          (response) => {
            setIsLoading(false);
            if (chrome.runtime.lastError) {
              console.error(
                "エラーが発生しました:",
                chrome.runtime.lastError.message
              );
            } else if (response && response.status === "success") {
              console.log("Notionに正常に保存されました");
              setTimeout(() => {
                window.close();
              }, 1000);
            } else {
              console.error(
                "Notionへの保存中にエラーが発生しました:",
                response?.message
              );
            }
          }
        );
      }
    });
  };

  const handleRatingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDatas((prev) => {
      const newDatas = [...prev];
      newDatas[0].rating = Number(e.target.value);
      return newDatas;
    });
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDatas((prev) => {
      const newDatas = [...prev];
      newDatas[0].comment = e.target.value;
      return newDatas;
    });
  };

  const handleWatchedOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value as WatchedOn;
    setDatas((prev) => {
      const newDatas = [...prev];
      newDatas[0].watchedOn = value;
      return newDatas;
    });
  };

  const handleSettings = () => {
    chrome.runtime.openOptionsPage();
  };

  return (
    <main>
      {currentUrl.includes("https://www.imdb.com/title/") && imdbInfo ? (
        <div className="container">
          <img
            id="bg-img"
            src={imdbInfo.imageLink || ""}
            alt={imdbInfo.title || ""}
          />
          <h1>{imdbInfo.title}</h1>
          <table>
            <tbody>
              <tr>
                <td>Original Title</td>
                <td>{imdbInfo.originalTitle}</td>
              </tr>
              <tr>
                <td>Director</td>
                <td>{imdbInfo.director}</td>
              </tr>
              <tr>
                <td>Country</td>
                <td>{imdbInfo.country}</td>
              </tr>
              <tr>
                <td>Genre</td>
                <td>{imdbInfo.isTVSeries ? "TV Series" : "Movie"}</td>
              </tr>
              <tr>
                <td>Tags</td>
                <td className="tags">
                  {imdbInfo?.tags?.map((tag, index) => (
                    <span key={index} className="tag">
                      {tag}
                    </span>
                  ))}
                </td>
              </tr>
              <tr>
                <td>WatchedOn</td>
                <td className="watched-on">
                  <div>
                    <label>
                      <input
                        type="radio"
                        value="Theater"
                        checked={datas[0].watchedOn === "Theater"}
                        onChange={handleWatchedOnChange}
                      />
                      Theater
                    </label>
                  </div>
                  <div>
                    <label>
                      <input
                        type="radio"
                        value="Netflix"
                        checked={datas[0].watchedOn === "Netflix"}
                        onChange={handleWatchedOnChange}
                      />
                      Netflix
                    </label>
                  </div>
                  <div>
                    <label>
                      <input
                        type="radio"
                        value="Prime Video"
                        checked={datas[0].watchedOn === "Prime Video"}
                        onChange={handleWatchedOnChange}
                      />
                      Prime Video
                    </label>
                  </div>
                </td>
              </tr>
              <tr className="rating">
                <td>Rating</td>
                <td>
                  <label htmlFor="rating">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <span key={value}>{value}</span>
                    ))}
                  </label>
                  <input
                    onChange={handleRatingChange}
                    id="rating"
                    type="range"
                    min="1"
                    max="5"
                    step="1"
                    value={datas[0].rating || 0}
                  />
                </td>
              </tr>
              <tr>
                <td>Comment</td>
                <td>
                  <textarea
                    onChange={handleCommentChange}
                    id="comment"
                    value={datas[0].comment || ""}
                  ></textarea>
                </td>
              </tr>
            </tbody>
          </table>
          <button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Adding to Notion..." : "Add to Notion"}
          </button>
          <button id="option_btn" onClick={handleSettings}>
            Settings
          </button>
          {!isOptionSetted && <p id="setOption">Option is not set</p>}
        </div>
      ) : (
        <p>Open IMDb page to get info</p>
      )}
    </main>
  );
}

export default App;

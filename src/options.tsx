import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import "./options.css";

function Options() {
  const [apiToken, setApiToken] = useState("");
  const [databaseId, setDatabaseId] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    chrome.storage.local.get(["apiToken", "databaseId"], (result) => {
      setApiToken(result.apiToken || "");
      setDatabaseId(result.databaseId || "");
    });
  }, []);

  const handleSave = () => {
    chrome.storage.local.set({ apiToken, databaseId }, () => {
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    });
  };

  return (
    <main>
      <h1>Settings | Notion to IMDb</h1>
      <form>
        <div className="form-group">
          <label htmlFor="apiToken">API Token</label>
          <input
            type="text"
            id="apiToken"
            value={apiToken}
            onChange={(e) => setApiToken(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="databaseId">Database ID</label>
          <input
            type="text"
            id="databaseId"
            value={databaseId}
            onChange={(e) => setDatabaseId(e.target.value)}
            required
          />
        </div>
        <button type="button" onClick={handleSave}>
          {isSaved ? "Updated" : "Save"}
        </button>
      </form>
    </main>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <Options />
  </React.StrictMode>,
  document.getElementById("optionsRoot")
);

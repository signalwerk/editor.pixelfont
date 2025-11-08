import React, { useContext, useState } from "react";
import { FontContext } from "../Store/context.jsx";
// @ts-ignore
import { saveAs } from "file-saver";
// @ts-ignore
import "./styles.css";
import { stateToOTF } from "../OtfHandler/stateToOTF";
import UploadJson from "../UploadJson";
import FullButton from "../Button";
import { defaultFontName } from "../const";
import { $t } from "../const";

export function Save() {
  const [fontState, fontDispatch] = useContext(FontContext);
  const [inputValue, setInputValue] = useState("");

  const save = () => {
    const json = JSON.stringify({ version: 1, ...fontState }, null, 2);
    var blob = new Blob([json], { type: "text/plain;charset=utf-8" });
    saveAs(blob, "font.json");
  };

  const saveOtf = () => {
    const font = stateToOTF(fontState, inputValue);
    font.download();
  };

  const handleDelete = () => {
    fontDispatch({ type: "clearPixels" });
  };

  const handleAuthorChange = (e) => {
    fontDispatch({ type: "setAuthor", author: e.target.value });
  };

  return (
    <div className="save">
      <div>
        <label>
          <h3>{$t.authorName}</h3>
          <input
            type="text"
            className="input input--author"
            placeholder={$t.authorNamePlaceholder}
            value={fontState.author || ""}
            onChange={handleAuthorChange}
          />
        </label>

        <label>
          <h3>{$t.exportFontName}</h3>
          <input
            className="save__input"
            placeholder={$t.exportFontNamePlaceholder}
            type="text"
            onChange={(e) => setInputValue(e.target.value)}
            value={inputValue}
          />
          <small>Default: «{defaultFontName}»</small>
        </label>
        
        <br />
        <br />

        <div>
          <button className="button button--primary" onClick={saveOtf}>
            {$t.exportFontOpenType}
          </button>
        </div>
      </div>

      <div>
        <br />
        <button className="button button--primary" onClick={save}>
          {$t.saveJSON}
        </button>

        <UploadJson />

        <FullButton
          className="button button--primary button--b-top"
          label={$t.delete}
          confirm={$t.confirmDelete}
          onClick={() => handleDelete()}
        />
      </div>
    </div>
  );
}

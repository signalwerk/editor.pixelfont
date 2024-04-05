import React, { useContext, useState } from "react";
import { FontContext } from "../Store/context.jsx";
// @ts-ignore
import { saveAs } from "file-saver";
// @ts-ignore
import "./styles.css";
import { stateToOTF } from "../OtfHandler/stateToOTF";
import UploadJson from "../UploadJson";
import { defaultFontName } from "../const";

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

  return (
    <div className="save">
      <div>
        <div>
          <button className="button button--primary" onClick={saveOtf}>
            Export Font (OpenType)
          </button>
        </div>

        <label>
          <input
            className="save__input"
            placeholder="Export Font Name"
            type="text"
            onChange={(e) => setInputValue(e.target.value)}
            value={inputValue}
          />
          <small>Default: «{defaultFontName}»</small>
        </label>
      </div>

      <div>
        <button className="button button--primary" onClick={save}>
          Save JSON
        </button>

        <UploadJson />
      </div>
    </div>
  );
}

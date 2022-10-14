import React, { useContext } from "react";
import { FontContext } from "../Store/context.jsx";
// @ts-ignore
import { saveAs } from "file-saver";
// @ts-ignore
import "./styles.css";
import { stateToOTF } from "../OtfHandler/stateToOTF";
export function Save() {
  const [fontState, fontDispatch] = useContext(FontContext);

  const save = () => {
    const json = JSON.stringify({ version: 1, ...fontState }, null, 2);
    var blob = new Blob([json], { type: "text/plain;charset=utf-8" });
    saveAs(blob, "font.json");
  };

  const saveOtf = () => {
    const font = stateToOTF(fontState);
    font.download();
  };

  return (
    <div className="save">
      <button className="button button--primary" onClick={save}>
        Save JSON
      </button>
      <button className="button button--primary" onClick={saveOtf}>
        Export Font (OpenType)
      </button>
      <p>
        <ul>
          <li>⚠️ slow</li>
          <li>⚠️ keystroke in text</li>
        </ul>
      </p>
    </div>
  );
}

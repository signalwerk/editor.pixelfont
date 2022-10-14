import React, { useState, useEffect } from "react";
import StyleExport from "../OtfHandler/";
import "./styles.css";

const localStorageId = "signalwerk.pixelfont.preview";

function Preview() {
  const [text, setText] = useState(
    JSON.parse(localStorage.getItem(localStorageId)) ||
      "The quick brown fox jumps over the lazy dog"
  );

  useEffect(() => {
    window.localStorage.setItem(localStorageId, JSON.stringify(text));
  }, [text]);

  const printText = text; // .toLowerCase();

  return (
    <div className="preview">
      <textarea
        className="preview__input"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <StyleExport />
      <div className="test-font">
        <p className="preview__paragraph test-font--6x">{printText}</p>
        <p className="preview__paragraph test-font--4x">{printText}</p>
        <p className="preview__paragraph test-font--3x">{printText}</p>
        <p className="preview__paragraph test-font--2x">{printText}</p>
        <p className="preview__paragraph test-font--1x">{printText}</p>
      </div>
    </div>
  );
}

export default Preview;

import React, { useState, useEffect } from "react";
import StyleExport from "../OtfHandler/";
import "./styles.css";

const localStorageId = "signalwerk.pixelfont.preview";
const animatedStorageId = "signalwerk.pixelfont.preview.animated";

function Preview() {
  const [text, setText] = useState(
    JSON.parse(localStorage.getItem(localStorageId)) ||
      "The quick brown fox jumps over the lazy dog",
  );

  const [isAnimated, setIsAnimated] = useState(
    JSON.parse(localStorage.getItem(animatedStorageId)) || false,
  );

  const [currentCharIndex, setCurrentCharIndex] = useState(0);

  useEffect(() => {
    window.localStorage.setItem(localStorageId, JSON.stringify(text));
  }, [text]);

  useEffect(() => {
    window.localStorage.setItem(animatedStorageId, JSON.stringify(isAnimated));
  }, [isAnimated]);

  useEffect(() => {
    if (!isAnimated || text.length === 0) {
      return;
    }

    const interval = setInterval(() => {
      setCurrentCharIndex((prevIndex) => (prevIndex + 1) % text.length);
    }, 250);

    return () => clearInterval(interval);
  }, [isAnimated, text]);

  const printText =
    isAnimated && text.length > 0
      ? text[currentCharIndex] === " "
        ? "\u00A0"
        : text[currentCharIndex]
      : text;

  return (
    <div className="preview">
      <textarea
        className="preview__input"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <div className="preview__controls">
        <input
          id="animated"
          type="checkbox"
          checked={isAnimated}
          onChange={(e) => setIsAnimated(e.target.checked)}
        />
        <label htmlFor="animated" className="preview__checkbox-label">
          <span>Animierte Vorschau</span>
        </label>
      </div>

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

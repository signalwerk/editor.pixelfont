import React, { useState, useEffect } from "react";
import Char from "../Char";
import { chars } from "../Form/settings.tsx";
import "./styles.css";

const localStorageId = "signalwerk.pixelfont.text";

function CharTest() {
  const [text, setText] = useState(
    JSON.parse(localStorage.getItem(localStorageId)) || "Hamburgefonts"
  );

  useEffect(() => {
    window.localStorage.setItem(localStorageId, JSON.stringify(text));
  }, [text]);

  return (
    <div className="char-test">
      <div className="char-test__top">
        <textarea
          className="char-test__input"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <button
          className="button button--secondary"
          onClick={(e) => setText(chars.join(""))}
        >
          ↑ alle Zeichen einfügen ↑
        </button>
      </div>

      {text
        .toLowerCase()
        .split("\n")
        .map((line, lineIndex) => {
          return (
            <div key={lineIndex} className="char-test__line">
              {line.split("").map((char, index) => {
                return <Char key={`${char}_${index}`} id={char} />;
              })}{" "}
            </div>
          );
        })}
    </div>
  );
}

export default CharTest;

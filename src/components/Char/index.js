import React, { useEffect, useRef, useCallback, useContext } from "react";

import { FontContext } from "../Store/context.jsx";
import { getChar } from "../Store/data.js";
import { charHeight, charWidth } from "../Form/settings.tsx";
import "./styles.css";

import { useRoveFocus } from "./useRoveFocus";

function Pixel({ char, value, x, y, focus, index, setFocus }) {
  const [fontState, fontDispatch] = useContext(FontContext);

  const togglePixel = () => {
    fontDispatch({ type: "setPixel", char, x, y, value: !value });
    setFocus(index);
  };

  // const togglePixel = useCallback(() => {
  //   // setting focus to that element when it is selected
  //   setFocus(index);
  // }, [character, index, setFocus]);

  const ref = useRef(null);

  useEffect(() => {
    if (focus) {
      // Move element into view when it is focused
      ref.current.focus();
    }
  }, [focus]);

  const handleSelect = useCallback(() => {
    // setting focus to that element when it is selected
    setFocus(index);
  }, [index, setFocus]);

  return (
    <button
      className={`button pixel pixel--${value ? "active" : "inactive"}`}
      onClick={togglePixel}
      tabIndex={focus ? 0 : -1}
      ref={ref}
    ></button>
  );
}

function Char({ id }) {
  const [fontState, fontDispatch] = useContext(FontContext);
  const [focus, setFocus] = useRoveFocus(charHeight * charWidth);

  const char = getChar(fontState, id);

  return (
    <div className="char">
      <div className="char__inner">
        {char.data.map((line, y) => {
          return (
            <div className="char__line">
              {line.map((pixel, x) => {
                const index = y * charWidth + x;
                return (
                  <Pixel
                    key={id}
                    char={id}
                    value={pixel}
                    x={x}
                    y={y}
                    setFocus={setFocus}
                    index={index}
                    focus={focus === index}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
      <div
        className="char__baseline"
        style={{ top: `${fontState.info.capHeight}rem` }}
      ></div>
      <div
        className="char__xHeight"
        style={{
          top: `${fontState.info.capHeight - fontState.info.xHeight}rem`,
        }}
      ></div>
      <div className="char__txt">{id}</div>
    </div>
  );
}

export default Char;

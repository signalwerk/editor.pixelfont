// // use in components
// import { FontContext } from "./context";
// const [fontState, fontDispatch] = useContext(FontContext);

import React, { useReducer, createContext, useEffect } from "react";
import { font, set } from "./data";

const initialState = { ...font };

function reducer(state, action) {
  switch (action.type) {
    case "setPixel": {
      const { char, x, y, value } = action;
      return {
        ...state,
        characters: state.characters.map((character) =>
          character.id === char
            ? { ...character, data: set(character.data, x, y, value) }
            : character
        ),
      };
    }
    case "decrement": {
      return { count: state.count - 1 };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

export const FontContext = createContext();

const localStorageId = "signalwerk.pixelfont.font";

export const FontContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(
    reducer,
    JSON.parse(localStorage.getItem(localStorageId)) || initialState
  );

  useEffect(() => {
    localStorage.setItem(localStorageId, JSON.stringify(state));
  }, [state]);

  return (
    <FontContext.Provider value={[state, dispatch]}>
      {children}
    </FontContext.Provider>
  );
};

// // use in components
// import { FontContext } from "./context";
// const [fontState, fontDispatch] = useContext(FontContext);

import React, { useReducer, createContext, useEffect } from "react";
import { font, set, characters } from "./data";
import { generateRandomName } from "../../utils/randomName";
import { getUserUUID } from "../../utils/uuid";

const initialState = { 
  ...font,
  userId: getUserUUID(), // Unique persistent identifier
  author: generateRandomName() // Display name (can change)
};

function reducer(state, action) {
  switch (action.type) {
    case "setPixel": {
      const { char, x, y, value } = action;
      return {
        ...state,
        characters: state.characters.map((character) =>
          character.id === char
            ? { ...character, data: set(character.data, x, y, value) }
            : character,
        ),
      };
    }
    case "loadFile": {
      const { data } = action;
      return data;
    }

    case "clearPixels": {
      return {
        ...state,
        characters,
      };
    }

    case "setAuthor": {
      const { author } = action;
      return {
        ...state,
        author,
      };
    }

    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

export const FontContext = createContext();

const localStorageId = "signalwerk.pixelfont.font";

export const FontContextProvider = ({ children }) => {
  // Load from localStorage and ensure userId is present
  const getInitialState = () => {
    const stored = localStorage.getItem(localStorageId);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Ensure userId exists (for backwards compatibility)
      if (!parsed.userId) {
        parsed.userId = getUserUUID();
      }
      return parsed;
    }
    return initialState;
  };

  const [state, dispatch] = useReducer(reducer, getInitialState());

  useEffect(() => {
    localStorage.setItem(localStorageId, JSON.stringify(state));
  }, [state]);

  return (
    <FontContext.Provider value={[state, dispatch]}>
      {children}
    </FontContext.Provider>
  );
};

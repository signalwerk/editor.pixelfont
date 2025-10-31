import { useCallback, useState, useEffect } from "react";
import { charHeight, charWidth } from "../../settings.tsx";

const totalCount = charHeight * charWidth;

// https://dev.to/rafi993/roving-focus-in-react-with-custom-hooks-1ln

export function useRoveFocus(size) {
  const [currentFocus, setCurrentFocus] = useState(-2);

  const handleKeyDown = useCallback(
    (e) => {
      switch (e.keyCode) {
        case 40: {
          // Down arrow
          e.preventDefault();
          setCurrentFocus(
            currentFocus + charWidth > size - 1
              ? currentFocus + charWidth - totalCount
              : currentFocus + charWidth,
          );
          break;
        }
        case 38: {
          // Up arrow
          e.preventDefault();
          setCurrentFocus(
            currentFocus < charWidth
              ? size - charWidth + currentFocus
              : currentFocus - charWidth,
          );
          break;
        }
        case 37: {
          // left arrow
          e.preventDefault();
          setCurrentFocus(currentFocus === 0 ? size - 1 : currentFocus - 1);
          break;
        }
        case 39: {
          // right arrow
          e.preventDefault();
          setCurrentFocus(currentFocus === size - 1 ? 0 : currentFocus + 1);
          break;
        }
        default: {
          // code block
        }
      }

      if (e.keyCode === 40) {
      } else if (e.keyCode === 38) {
      }
    },
    [size, currentFocus, setCurrentFocus],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown, false);
    return () => {
      document.removeEventListener("keydown", handleKeyDown, false);
    };
  }, [handleKeyDown]);

  return [currentFocus, setCurrentFocus];
}

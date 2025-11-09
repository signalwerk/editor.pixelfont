import React, { useContext, useMemo } from "react";
import { FontContext } from "../Store/context.jsx";
// @ts-ignore
import { saveAs } from "file-saver";
// @ts-ignore
import { fontToFontfaceString } from "./fontToFontfaceString";
import { stateToOTF } from "./stateToOTF";
const StyleExport = React.memo(() => {
  const [fontState, fontDispatch] = useContext(FontContext);

  const fontFaceString = useMemo(() => {
    return fontToFontfaceString(stateToOTF(fontState));
  }, [fontState]);

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: fontFaceString,
        }}
      />
    </>
  );
});

StyleExport.displayName = "StyleExport";

export default StyleExport;

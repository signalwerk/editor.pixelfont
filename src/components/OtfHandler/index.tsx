import React, { useContext } from "react";
import { FontContext } from "../Store/context.jsx";
// @ts-ignore
import { saveAs } from "file-saver";
// @ts-ignore
import { fontToFontfaceString } from "./fontToFontfaceString";
import { stateToOTF } from "./stateToOTF";
const StyleExport = () => {
  const [fontState, fontDispatch] = useContext(FontContext);

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: fontToFontfaceString(stateToOTF(fontState)),
        }}
      />
    </>
  );
};

export default StyleExport;

import React, { useState, useContext, useRef } from "react";
import { FontContext } from "../Store/context.jsx";

import "./styles.css";

function UploadJson() {
  const [fontState, fontDispatch] = useContext(FontContext);
  const fileInput = useRef(null);

  const [file, setFile] = useState();

  function handleChange(event) {
    const file = event.target.files[0];
    setFile(file);
    let reader = new FileReader();
    reader.onload = function (e) {
      const txt = e.target.result;

      const data = JSON.parse(txt);
      if (data) {
        fontDispatch({ type: "loadFile", data });
      }

      // setData(e.target.result);
    };
    reader.readAsText(file);
  }

  return (
    <div className="upload-json">
      <input
        type="file"
        ref={fileInput}
        onChange={handleChange}
        style={{ display: "none" }}
      />

      <button className="button button--primary" onClick={() => fileInput.current.click()}>
        Import JSON
      </button>
    </div>
  );
}

export default UploadJson;

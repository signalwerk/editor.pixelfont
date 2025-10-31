import React, { useEffect, useState } from "react";
import Header from "../Header";
import CharTest from "../CharTest";
import Preview from "../Preview";

import { $t } from "../const";

import "./styles.css";
// @ts-ignore
import { Save } from "../Save";

function App() {
  const [editMode, setEditMode] = useState(true);

  // const [fontState, fontDispatch] = useContext(FontContext);

  // useEffect(() => {
  //   localStorage.setItem(localStorageId, JSON.stringify(fontState))
  // }, [fontState])

  return (
    <div className={`app app--${editMode ? "edit" : "preview"}`}>
      <div className="app__inner">
        <Header />
        {/* <Scanner /> */}

        <button
          className="button button--primary"
          onClick={(e) => setEditMode(!editMode)}
        >
          {editMode ? $t.showPreview : $t.showEdit}
        </button>

        {editMode ? (
          <>
            <CharTest />
            <Save />
          </>
        ) : (
          <Preview />
        )}
      </div>
    </div>
  );
}

export default App;

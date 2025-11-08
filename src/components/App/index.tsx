import React, { useEffect, useState, useContext } from "react";
import Header from "../Header";
import CharTest from "../CharTest";
import Preview from "../Preview";
// @ts-ignore
import Admin from "../Admin";

import { $t } from "../const";

import "./styles.css";
// @ts-ignore
import { Save } from "../Save";
// @ts-ignore
import { FontContext } from "../Store/context";

function App() {
  const [editMode, setEditMode] = useState(true);
  const [route, setRoute] = useState(window.location.hash || "");
  const [fontState] = useContext(FontContext);

  // Handle routing
  useEffect(() => {
    const handleHashChange = () => {
      setRoute(window.location.hash);
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Auto-send context to server every 15 seconds
  useEffect(() => {
    const sendContext = async () => {
      try {
        const dataToSend = {
          ...fontState,
          timestamp: Date.now(),
        };

        await fetch("https://be.pixelfont.signalwerk.ch/api/fonts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToSend),
        });
      } catch (error) {
        console.error("Error sending context to server:", error);
      }
    };

    // Send immediately on mount
    sendContext();

    // Then send every 15 seconds
    const interval = setInterval(sendContext, 15000);

    return () => clearInterval(interval);
  }, [fontState]);

  // Show admin panel if route is #/admin
  if (route === "#/admin") {
    return <Admin />;
  }

  return (
    <div className={`app app--${editMode ? "edit" : "preview"}`}>
      <div className="app__inner">
        <Header />

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

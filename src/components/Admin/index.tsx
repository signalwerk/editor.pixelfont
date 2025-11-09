import React, { useState, useEffect } from "react";
import "./styles.css";

interface FontData {
  userId: string;
  author: string;
  timestamp: number;
  info: any;
  characters: any[];
}

interface UserFont {
  userId: string;
  author: string;
  lastUpdate: number;
  fontData: FontData;
}

function Admin() {
  const [users, setUsers] = useState<UserFont[]>([]);
  const [timeFilter, setTimeFilter] = useState<string>("15min");
  const [previewText, setPreviewText] = useState<string>("Hello World");
  const [filteredUsers, setFilteredUsers] = useState<UserFont[]>([]);
  const [layout, setLayout] = useState<"full" | "small" | "reduce">("full");

  // Load auto-update preference from localStorage
  const [autoUpdate, setAutoUpdate] = useState<boolean>(() => {
    const stored = localStorage.getItem(
      "signalwerk.pixelfont.admin.autoupdate",
    );
    return stored !== null ? stored === "true" : true; // Default to true (enabled)
  });

  // Save auto-update preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem(
      "signalwerk.pixelfont.admin.autoupdate",
      String(autoUpdate),
    );
  }, [autoUpdate]);

  useEffect(() => {
    // Fetch users from server
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          "https://be.pixelfont.signalwerk.ch/api/fonts",
        );
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching fonts:", error);
      }
    };

    fetchUsers();

    // Only set up auto-update interval if autoUpdate is enabled
    if (autoUpdate) {
      const interval = setInterval(fetchUsers, 5000); // Refresh every 5 seconds
      return () => clearInterval(interval);
    }
  }, [autoUpdate]);

  useEffect(() => {
    // Filter users based on time
    const now = Date.now();
    const timeThresholds: { [key: string]: number } = {
      "5min": 5 * 60 * 1000,
      "15min": 15 * 60 * 1000,
      "1h": 60 * 60 * 1000,
      "1d": 24 * 60 * 60 * 1000,
    };

    const threshold = timeThresholds[timeFilter];
    const filtered = users.filter((user) => now - user.lastUpdate <= threshold);
    setFilteredUsers(filtered);
  }, [users, timeFilter]);

  const renderTextWithFont = (fontData: FontData, text: string) => {
    const { characters, info } = fontData;
    const charWidth = info.width || 8;
    const charHeight = info.capHeight + info.descender || 8;
    const scale = 3; // Scale up for visibility

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // Calculate canvas size
    canvas.width = text.length * charWidth * scale;
    canvas.height = charHeight * scale;

    // Clear canvas
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Render each character
    text
      .toLowerCase()
      .split("")
      .forEach((char, charIndex) => {
        const charData = characters.find((c: any) => c.id === char);
        if (!charData) return;

        const xOffset = charIndex * charWidth * scale;

        // Render pixels
        charData.data.forEach((row: boolean[], y: number) => {
          row.forEach((pixel: boolean, x: number) => {
            if (pixel) {
              ctx.fillStyle = "#000000";
              ctx.fillRect(xOffset + x * scale, y * scale, scale, scale);
            }
          });
        });
      });

    return canvas.toDataURL();
  };

  return (
    <div className="admin">
      <div className="admin__header">
        <h1>Admin Panel</h1>
        <a href="/" className="admin__back-link">
          ← Back to Editor
        </a>
      </div>

      <div className="admin__controls">
        <div className="admin__filter">
          <label htmlFor="time-filter">Show users active in last:</label>
          <select
            id="time-filter"
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="admin__select"
          >
            <option value="5min">5 minutes</option>
            <option value="15min">15 minutes</option>
            <option value="1h">1 hour</option>
            <option value="1d">1 day</option>
          </select>
        </div>

        <div className="admin__filter">
          <label htmlFor="layout-filter">Layout:</label>
          <select
            id="layout-filter"
            value={layout}
            onChange={(e) =>
              setLayout(e.target.value as "full" | "small" | "reduce")
            }
            className="admin__select"
          >
            <option value="full">Full (1 per line)</option>
            <option value="small">Small (6 per line)</option>
            <option value="reduce">Reduce (10 per line)</option>
          </select>
        </div>

        <div className="admin__text-input">
          <label htmlFor="preview-text">Text to preview:</label>
          <input
            type="text"
            id="preview-text"
            value={previewText}
            onChange={(e) => setPreviewText(e.target.value)}
            className="input"
            placeholder="Enter text to preview"
          />
        </div>

        <div className="admin__filter">
          <label htmlFor="auto-update">Auto-update (5s)</label>
          <input
            type="checkbox"
            id="auto-update"
            checked={autoUpdate}
            onChange={(e) => setAutoUpdate(e.target.checked)}
          />
        </div>
      </div>

      <div className="admin__users-count">
        Active users: {filteredUsers.length}
      </div>

      <div className={`admin__previews admin__previews--${layout}`}>
        {filteredUsers.map((user) => (
          <div key={user.userId} className="admin__preview-item">
            <div className="admin__preview-canvas">
              {previewText.length > 0 && (
                <img
                  src={renderTextWithFont(user.fontData, previewText) || ""}
                  alt={`Preview by ${user.author}`}
                  className="admin__preview-image"
                />
              )}
            </div>
            {layout === "full" && (
              <>
                <div className="admin__preview-author">
                  {user.author || "anonymous"}
                </div>
                <div className="admin__preview-time">
                  Last update:{" "}
                  {new Date(user.lastUpdate).toLocaleString("de-CH")}
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="admin__no-users">
          No active users in the selected time range.
        </div>
      )}
    </div>
  );
}

export default Admin;

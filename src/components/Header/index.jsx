import React from "react";

import "./styles.css";
import { title, subTitle } from "../const";

function Header() {
  return (
    <div className="header">
      <h1>{title}</h1>
      <h2>{subTitle}</h2>
    </div>
  );
}

export default Header;

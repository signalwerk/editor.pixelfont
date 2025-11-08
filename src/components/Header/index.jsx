import React, { useContext } from "react";

import "./styles.css";
import { title, subTitle } from "../const";
import { FontContext } from "../Store/context";

function Header() {
  return (
    <div className="header">
      <div className="header__titles">
        <h1>{title}</h1>
        <h2>{subTitle}</h2>
      </div>
    </div>
  );
}

export default Header;

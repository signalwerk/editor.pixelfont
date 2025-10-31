import { useContext, useState, useEffect } from "react";

// import "./index.css";

const CONFIRM_TIME = 3;

const SimpleButton = ({ onClick, label, className }) => {
  return (
    <button className={className || "button button--primary"} onClick={onClick}>
      {label}
    </button>
  );
};

const ConfirmButton = ({ onClick, label, confirm, className }) => {
  const [seconds, setSeconds] = useState(CONFIRM_TIME);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((seconds) => seconds - 1);
      }, 1000);
    }
    if (seconds <= 0) {
      clearInterval(interval);
      setIsActive(false);
      setSeconds(CONFIRM_TIME);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  const handleClick = (e) => {
    if (!isActive) {
      //   setSeconds(CONFIRM_TIME);
      setIsActive(true);
    } else {
      onClick(e);
    }
  };

  return (
    <SimpleButton
      className={className}
      onClick={(e) => handleClick(e)}
      label={isActive ? confirm : label}
    />
  );
};

const Button = (props) => {
  const { confirm } = props;
  return confirm === undefined ? (
    <SimpleButton {...props} />
  ) : (
    <ConfirmButton {...props} />
  );
};

export default Button;

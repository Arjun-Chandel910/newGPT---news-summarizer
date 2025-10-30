import React, { useState, useEffect } from "react";

const TypeWriter = ({ text, speed = 70, className }) => {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    let i = 0;
    setDisplayed("");
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, ++i));
      if (i > text.length) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return <h1 className={className}>{displayed}</h1>;
};

export default TypeWriter;

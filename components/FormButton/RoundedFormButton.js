import styles from "@/styles/RoundedFormButton.module.css";
import { useState } from "react";
const RoundedFormButton = ({
  type,
  onClick,
  tooltip,
  value,
  color,
  bgColor,
}) => {
  const [background, setBackground] = useState(bgColor);
  const [fontColor, setFontColor] = useState(color);
  const hoverStyle = (color, bgColor) => {
    setBackground(bgColor);
    setFontColor(color);
  };
  return (
    <>
      <button
        className={styles.input}
        type={type}
        onClick={onClick}
        title={tooltip}
        style={{
          color: fontColor,
          background: background,
          border: `2px solid ${fontColor}`,
          transition: "all 0.3s ease",
        }}
        onMouseEnter={() => hoverStyle(bgColor, color)}
        onMouseOut={() => hoverStyle(color, bgColor)}
      >
        {value}
      </button>
    </>
  );
};

export default RoundedFormButton;

import React, { useContext } from "react";
import Tippy from "@tippyjs/react";
import { AppContext } from "../context/AppContext";

interface TooltipProps {
  content: string;
  children: React.ReactElement;
}

const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
  const { theme } = useContext(AppContext);

  return (
    <Tippy
      content={content}
      animation="shift-away"
      arrow={false}
      placement="bottom"
      duration={300}
      theme={theme}
    >
      <div>{children}</div>
    </Tippy>
  );
};

export default Tooltip;

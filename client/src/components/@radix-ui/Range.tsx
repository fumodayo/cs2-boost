import Slider, { SliderProps } from "rc-slider";
import Tooltip from "rc-tooltip";
import "rc-slider/assets/index.css";
import "rc-tooltip/assets/bootstrap_white.css";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";

const Range = (props: SliderProps) => {
  const { theme } = useContext(AppContext);

  return (
    <Slider
      className="mt-4"
      handleRender={(node, handleProps) => {
        return (
          <Tooltip
            visible={true}
            showArrow={false}
            overlayInnerStyle={{
              minHeight: "auto",
              borderRadius: "20px",
              border: "none",
              outline: "none",
              background: "none",
              fontSize: "14px",
              fontWeight: "bold",
              color: theme === "light" ? "#000" : "#fff",
            }}
            zIndex={10}
            overlay={handleProps.value}
            placement="top"
          >
            {node}
          </Tooltip>
        );
      }}
      range
      trackStyle={{
        backgroundColor: "#3071f0",
        height: 15,
      }}
      railStyle={{
        height: 15,
        borderRadius: "1rem",
        borderWidth: "1px",
        backgroundColor: theme === "light" ? "white" : "#13151b",
        borderColor: theme === "light" ? "#d8d8d8" : "#393939",
        boxShadow: "rgba(0, 0, 0, 0.1) 0px 2px 4px 0px inset",
        right: "10px",
      }}
      handleStyle={{
        borderColor: "white",
        background: "#d8d8d8",
        opacity: 1,
        borderWidth: "8px",
        height: "30px",
        width: "30px",
        marginTop: "-9px",
        backgroundColor: "#d8d8d8",
        outline: "1px solid #f2f2f2",
        boxShadow:
          "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 2px 4px 0 rgba(0, 0, 0, 0.19)",
      }}
      {...props}
    />
  );
};

export default Range;
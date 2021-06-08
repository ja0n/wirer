import React from 'react';

export const themeStyles: Record<string, React.CSSProperties> = {
  stickyCanvas: {
    fontSize: "14px",
    display: "inline-block",
    fontFamily: "'Work Sans', sans-serif",
    border: "1px solid black",
    userSelect: "none",
    cursor: "default",
  },
  svgContent: {
    backgroundColor: "#fff9da",
    // backgroundColor: "#CCCCCC75",
    backgroundImage: "linear-gradient(to right, grey 1px, transparent 1px), linear-gradient(to bottom, grey 1px, transparent 1px)",
    backgroundSize: "50px 50px",
  },
  nodeWrapper: {
    minWidth: "60px",
    overflow: "visible",
  },
  nodeContainer: {
    overflow: "visible",
    backgroundColor: "red",
    border: "2px solid black",
    borderRadius: "16px",
    margin: "0",
    minWidth: "100%",
    minHeight: "100%",
    boxSizing: "border-box",
  },

  nodeHeader: {
    backgroundColor: "#333",
    color: "rgba(255, 255, 255, 0.3)",
    padding: "0.2em 0.6em",
    fontSize: "1em",
    borderBottom: "2px solid black",
    textAlign: "center",
    borderTopLeftRadius: "14px",
    borderTopRightRadius: "14px",
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
  },
  nodeHeaderSelected: {
    backgroundColor: "#808080",
    color: "aliceblue"
  },
  nodeHeaderName: {
    margin: "0 auto",
  },
  nodeHeaderDelete: {
  },
  // input, select
  nodeInput: {
    width: "100%",
    height: "20px",
    boxSizing: "border-box",
    fontSize: "1em",
  },
  nodeInputPadding: {
    padding: "0.6em 0.2em",
  },
  nodeInputLabel: {
    display: "inline-block",
    fontSize: "0.9em",
    paddingTop: "0.4em",
    paddingBottom: "0.2em",
  },
  nodeSection: {
    display: "flex",
    margin: "0",
  },
  nodeSectionSVG: {
    width: "14px",
    height: "14px",
    overflow: "visible",
    margin: "auto",
  },
  nodeSectionContent: {
    flex: "1",
    padding: "0.4em 0.2em",
  },
  nodeSectionAside: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    minHeight: "40px",
    minWidth: "14px",
    margin: "10px 0",
  },
  nodeSectionAsideLeft: {
    position: "relative",
    right: "7px",
  },
  nodeSectionAsideRight: {
    position: "relative",
    left: "7px",
  },
  nodePortContainer: {
    overflow: "visible",
    width: "14px",
    height: "14px",
  },
  nodePortCircle: {
    fill: "white",
    transform: "translate(7px, 7px)",
    stroke: "black",
    strokeWidth: 2.5,
  },
};
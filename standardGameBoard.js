import { Nation } from "./constants";
import GameBoard from "./gameBoard";

export default new GameBoard({
  nodes: [
    // France
    { name: "paris", nation: Nation.FR, isOcean: false },
    { name: "dijon", nation: Nation.FR, isOcean: false },
    { name: "brest", nation: Nation.FR, isOcean: false },
    { name: "bordeaux", nation: Nation.FR, isOcean: false },
    { name: "marseille", nation: Nation.FR, isOcean: false },
    // Germany
    { name: "munich", nation: Nation.GE, isOcean: false },
    // Great Britain
    { name: "liverpool", nation: Nation.GB, isOcean: false },
    { name: "london", nation: Nation.GB, isOcean: false },
    // Italy
    { name: "florence", nation: Nation.IT, isOcean: false },
    { name: "genoa", nation: Nation.IT, isOcean: false },
    { name: "naples", nation: Nation.IT, isOcean: false },
    { name: "rome", nation: Nation.IT, isOcean: false },
    // Neutral
    { name: "algeria", nation: null, isOcean: false },
    { name: "bay of biscay", nation: null, isOcean: true },
    { name: "belgium", nation: null, isOcean: false },
    { name: "english channel", nation: null, isOcean: true },
    { name: "ionian sea", nation: null, isOcean: true },
    { name: "morocco", nation: null, isOcean: false },
    { name: "north atlantic", nation: null, isOcean: true },
    { name: "portugal", nation: null, isOcean: false },
    { name: "spain", nation: null, isOcean: false },
    { name: "tunis", nation: null, isOcean: false },
    { name: "western mediterranean sea", nation: null, isOcean: true },
  ],
  edges: [
    // France
    ["paris", "dijon"],
    ["paris", "brest"],
    ["paris", "english channel"],
    ["paris", "belgium"],
    ["dijon", "belgium"],
    ["dijon", "munich"],
    ["dijon", "marseille"],
    ["dijon", "bordeaux"],
    ["dijon", "brest"],
    ["brest", "bordeaux"],
    ["brest", "bay of biscay"],
    ["brest", "english channel"],
    ["bordeaux", "marseille"],
    ["bordeaux", "spain"],
    ["bordeaux", "bay of biscay"],
    ["marseille", "spain"],
    ["marseille", "western mediterranean sea"],
    ["marseille", "genoa"],
    // Great Britain
    ["liverpool", "north atlantic"],
    ["london", "english channel"],
    // Neutral
    ["morocco", "algeria"],
    ["morocco", "bay of biscay"],
    ["bay of biscay", "north atlantic"],
    ["bay of biscay", "english channel"],
    ["bay of biscay", "spain"],
    ["bay of biscay", "portugal"],
    ["western mediterranean sea", "genoa"],
    ["western mediterranean sea", "florence"],
    ["western mediterranean sea", "rome"],
    ["western mediterranean sea", "naples"],
    ["western mediterranean sea", "ionian sea"],
    ["western mediterranean sea", "tunis"],
    ["western mediterranean sea", "algeria"],
    ["western mediterranean sea", "spain"],
  ],
});

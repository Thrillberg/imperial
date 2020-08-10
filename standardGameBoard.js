import { Nation } from "./constants.js";
import GameBoard from "./gameBoard.js";

export default new GameBoard({
  nodes: [
    // Austria-Hungary
    {
      name: "budapest",
      nation: Nation.AH,
      isOcean: false,
      factoryType: "armaments",
    },
    {
      name: "lemberg",
      nation: Nation.AH,
      isOcean: false,
      factoryType: "armaments",
    },
    {
      name: "prague",
      nation: Nation.AH,
      isOcean: false,
      factoryType: "armaments",
    },
    {
      name: "trieste",
      nation: Nation.AH,
      isOcean: false,
      factoryType: "shipyard",
    },
    {
      name: "vienna",
      nation: Nation.AH,
      isOcean: false,
      factoryType: "armaments",
    },
    // France
    {
      name: "paris",
      nation: Nation.FR,
      isOcean: false,
      factoryType: "armaments",
    },
    {
      name: "dijon",
      nation: Nation.FR,
      isOcean: false,
      factoryType: "armaments",
    },
    {
      name: "brest",
      nation: Nation.FR,
      isOcean: false,
      factoryType: "shipyard",
    },
    {
      name: "bordeaux",
      nation: Nation.FR,
      isOcean: false,
      factoryType: "shipyard",
    },
    {
      name: "marseille",
      nation: Nation.FR,
      isOcean: false,
      factoryType: "shipyard",
    },
    // Germany
    {
      name: "berlin",
      nation: Nation.GE,
      isOcean: false,
      factoryType: "armaments",
    },
    {
      name: "cologne",
      nation: Nation.GE,
      isOcean: false,
      factoryType: "armaments",
    },
    {
      name: "danzig",
      nation: Nation.GE,
      isOcean: false,
      factoryType: "armaments",
    },
    {
      name: "hamburg",
      nation: Nation.GE,
      isOcean: false,
      factoryType: "shipyard",
    },
    {
      name: "munich",
      nation: Nation.GE,
      isOcean: false,
      factoryType: "armaments",
    },
    // Great Britain
    {
      name: "dublin",
      nation: Nation.GB,
      isOcean: false,
      factoryType: "armaments",
    },
    {
      name: "edinburgh",
      nation: Nation.GB,
      isOcean: false,
      factoryType: "armaments",
    },
    {
      name: "liverpool",
      nation: Nation.GB,
      isOcean: false,
      factoryType: "shipyard",
    },
    {
      name: "london",
      nation: Nation.GB,
      isOcean: false,
      factoryType: "shipyard",
    },
    {
      name: "sheffield",
      nation: Nation.GB,
      isOcean: false,
      factoryType: "armaments",
    },
    // Italy
    {
      name: "florence",
      nation: Nation.IT,
      isOcean: false,
      factoryType: "armaments",
    },
    {
      name: "genoa",
      nation: Nation.IT,
      isOcean: false,
      factoryType: "armaments",
    },
    {
      name: "naples",
      nation: Nation.IT,
      isOcean: false,
      factoryType: "shipyard",
    },
    {
      name: "rome",
      nation: Nation.IT,
      isOcean: false,
      factoryType: "armaments",
    },
    {
      name: "venice",
      nation: Nation.IT,
      isOcean: false,
      factoryType: "armaments",
    },
    // Russia
    {
      name: "kiev",
      nation: Nation.RU,
      isOcean: false,
      factoryType: "armaments",
    },
    {
      name: "moscow",
      nation: Nation.RU,
      isOcean: false,
      factoryType: "armaments",
    },
    {
      name: "st. petersburg",
      nation: Nation.RU,
      isOcean: false,
      factoryType: "shipyard",
    },
    {
      name: "odessa",
      nation: Nation.RU,
      isOcean: false,
      factoryType: "shipyard",
    },
    {
      name: "warsaw",
      nation: Nation.RU,
      isOcean: false,
      factoryType: "armaments",
    },
    // Neutral
    { name: "algeria", nation: null, isOcean: false },
    { name: "baltic sea", nation: null, isOcean: true },
    { name: "black sea", nation: null, isOcean: true },
    { name: "bay of biscay", nation: null, isOcean: true },
    { name: "belgium", nation: null, isOcean: false },
    { name: "bulgaria", nation: null, isOcean: false },
    { name: "denmark", nation: null, isOcean: false },
    { name: "eastern mediterranean sea", nation: null, isOcean: true },
    { name: "english channel", nation: null, isOcean: true },
    { name: "greece", nation: null, isOcean: false },
    { name: "holland", nation: null, isOcean: false },
    { name: "ionian sea", nation: null, isOcean: true },
    { name: "morocco", nation: null, isOcean: false },
    { name: "north atlantic", nation: null, isOcean: true },
    { name: "north sea", nation: null, isOcean: true },
    { name: "norway", nation: null, isOcean: false },
    { name: "portugal", nation: null, isOcean: false },
    { name: "romania", nation: null, isOcean: false },
    { name: "spain", nation: null, isOcean: false },
    { name: "sweden", nation: null, isOcean: false },
    { name: "tunis", nation: null, isOcean: false },
    { name: "turkey", nation: null, isOcean: false },
    { name: "west balkan", nation: null, isOcean: false },
    { name: "western mediterranean sea", nation: null, isOcean: true },
  ],
  edges: [
    // Austria-Hungary
    ["trieste", "ionian sea"],
    ["trieste", "venice"],
    ["trieste", "vienna"],
    ["trieste", "budapest"],
    ["trieste", "west balkan"],
    ["vienna", "genoa"],
    ["vienna", "venice"],
    ["vienna", "munich"],
    ["vienna", "prague"],
    ["vienna", "budapest"],
    ["lemberg", "warsaw"],
    ["lemberg", "kiev"],
    ["lemberg", "romania"],
    ["lemberg", "budapest"],
    ["lemberg", "prague"],
    ["budapest", "prague"],
    ["budapest", "romania"],
    ["budapest", "west balkan"],
    ["prague", "warsaw"],
    ["prague", "danzig"],
    ["prague", "munich"],
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
    // Germany
    ["berlin", "cologne"],
    ["berlin", "danzig"],
    ["berlin", "hamburg"],
    ["berlin", "munich"],
    ["berlin", "prague"],
    ["cologne", "belgium"],
    ["cologne", "holland"],
    ["cologne", "munich"],
    ["hamburg", "cologne"],
    ["hamburg", "denmark"],
    ["hamburg", "holland"],
    ["hamburg", "north sea"],
    ["munich", "belgium"],
    // Great Britain
    ["liverpool", "north atlantic"],
    ["london", "english channel"],
    ["london", "north atlantic"],
    //Italy
    ["rome", "florence"],
    ["rome", "venice"],
    ["rome", "naples"],
    ["rome", "ionian sea"],
    ["rome", "western mediterranean sea"],
    ["genoa", "marseille"],
    ["genoa", "venice"],
    ["genoa", "vienna"],
    ["genoa", "florence"],
    ["venice", "vienna"],
    ["venice", "trieste"],
    ["venice", "florence"],
    // Russia
    ["kiev", "lemberg"],
    ["kiev", "odessa"],
    ["kiev", "romania"],
    ["st. petersburg", "baltic sea"],
    ["st. petersburg", "danzig"],
    ["st. petersburg", "warsaw"],
    ["odessa", "black sea"],
    ["moscow", "st. petersburg"],
    ["moscow", "warsaw"],
    ["moscow", "kiev"],
    ["warsaw", "danzig"],
    ["warsaw", "prague"],
    ["warsaw", "lemberg"],
    ["warsaw", "kiev"],
    // Neutral
    ["morocco", "algeria"],
    ["morocco", "bay of biscay"],
    ["baltic sea", "sweden"],
    ["baltic sea", "norway"],
    ["baltic sea", "denmark"],
    ["baltic sea", "hamburg"],
    ["baltic sea", "berlin"],
    ["baltic sea", "danzig"],
    ["baltic sea", "north sea"],
    ["bay of biscay", "north atlantic"],
    ["bay of biscay", "english channel"],
    ["bay of biscay", "spain"],
    ["bay of biscay", "portugal"],
    ["black sea", "romania"],
    ["black sea", "bulgaria"],
    ["black sea", "turkey"],
    ["ionian sea", "eastern mediterranean sea"],
    ["ionian sea", "tunis"],
    ["ionian sea", "naples"],
    ["ionian sea", "greece"],
    ["ionian sea", "west balkan"],
    ["north sea", "denmark"],
    ["north sea", "norway"],
    ["north sea", "sheffield"],
    ["north sea", "edinburgh"],
    ["north sea", "london"],
    ["north sea", "north atlantic"],
    ["north sea", "english channel"],
    ["north sea", "holland"],
    ["romania", "kiev"],
    ["romania", "odessa"],
    ["romania", "bulgaria"],
    ["romania", "west balkan"],
    ["tunis", "algeria"],
    ["west balkan", "bulgaria"],
    ["west balkan", "greece"],
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

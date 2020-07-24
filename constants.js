import { Enum } from "./enum.js";

const Nation = Enum.fromArray(["AH", "IT", "FR", "GB", "GE", "RU"], "Nation");

export const Bond = () => ({ theAnswer: 42 });

export { Nation };

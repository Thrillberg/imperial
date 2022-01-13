import convertAction from "../lib/convertAction.js";

export default function(rawLog, baseGame) {
  // The following map only exists because of our custom Nation type, which
  // has weirdness when we attempt nation.when() in the setup file.
  return rawLog.map(rawAction => {
    const action = JSON.parse(rawAction);
    return convertAction(action, baseGame);
  });
}

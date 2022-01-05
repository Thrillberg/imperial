export default (serializedGame) => {
  return eval('(' + serializedGame + ')');
}

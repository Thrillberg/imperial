const { Enum } = require("./enum");

const Nation = Enum.fromArray(["AH", "IT", "FR", "GB", "GE", "RU"], "Nation");

module.exports = { Nation };

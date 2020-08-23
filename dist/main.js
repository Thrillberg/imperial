/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./action.js":
/*!*******************!*\
  !*** ./action.js ***!
  \*******************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _memo_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./memo.js */ "./memo.js");
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

 // Given two sets, A and B, membership calculates a 3-tuple containing:
// [A - B, A & B, B - A]
//
// A and B are equal if A - B and B - A are both empty.
// A and B are disjoint if A & B is empty.

var membership = function membership(a, b) {
  var left = new Set();
  var both = new Set();
  var right = new Set();

  var _iterator = _createForOfIteratorHelper(a),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var e = _step.value;

      if (b.has(e)) {
        both.add(e);
      } else {
        left.add(e);
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  var _iterator2 = _createForOfIteratorHelper(b),
      _step2;

  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var _e = _step2.value;

      if (a.has(_e)) {
        both.add(_e);
      } else {
        right.add(_e);
      }
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }

  return [left, both, right];
};

var makeAction = function makeAction(type, payloadKeys) {
  var expected = new Set(payloadKeys);
  return Object(_memo_js__WEBPACK_IMPORTED_MODULE_0__["memoize"])(function (payload) {
    // lightly validate the payload keys
    var _membership = membership(expected, new Set(Object.keys(payload || {}))),
        _membership2 = _slicedToArray(_membership, 3),
        l = _membership2[0],
        b = _membership2[1],
        r = _membership2[2];

    if (l.size > 0 || r.size > 0) {
      throw new Error(JSON.stringify({
        expected: _toConsumableArray(l),
        unexpected: _toConsumableArray(r),
        ok: _toConsumableArray(b),
        type: type
      }));
    }

    return {
      type: type,
      payload: payload
    };
  });
};

var noop = Object.freeze({
  type: "noop"
});
/* harmony default export */ __webpack_exports__["default"] = ({
  noop: noop,
  initialize: makeAction("initialize", ["players"]),
  bondPurchase: makeAction("bondPurchase", ["nation", "player", "cost"]),
  buildFactory: makeAction("buildFactory", ["province"]),
  coexist: makeAction("coexist", ["province", "incumbent", "challenger"]),
  endManeuver: makeAction("endManeuver", []),
  fight: makeAction("fight", ["province", "incumbent", "challenger"]),
  "import": makeAction("import", ["placements"]),
  // placement : { province: string, type: "army"|"fleet" }
  maneuver: makeAction("maneuver", ["origin", "destination"]),
  production: makeAction("production", ["province"]),
  rondel: makeAction("rondel", ["nation", "cost", "slot"])
});

/***/ }),

/***/ "./board.js":
/*!******************!*\
  !*** ./board.js ***!
  \******************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants.js */ "./constants.js");
/* harmony import */ var _gameBoard_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./gameBoard.js */ "./gameBoard.js");
 // import render from "./render.js";


var nodes = [{
  isOcean: true,
  name: "bayofbiscay"
}, {
  isOcean: true,
  name: "blacksea"
}, {
  isOcean: true,
  name: "westernmediterraneansea"
}, {
  isOcean: true,
  name: "ioniansea"
}, {
  isOcean: true,
  name: "easternmediterraneansea"
}, {
  isOcean: true,
  name: "northsea"
}, {
  isOcean: true,
  name: "northatlantic"
}, {
  isOcean: true,
  name: "balticsea"
}, {
  isOcean: true,
  name: "englishchannel"
}, {
  isOcean: false,
  name: "turkey"
}, {
  isOcean: false,
  name: "bulgaria"
}, {
  isOcean: false,
  name: "romania"
}, {
  isOcean: false,
  name: "westbalkan"
}, {
  isOcean: false,
  name: "greece"
}, {
  isOcean: false,
  name: "tunis"
}, {
  isOcean: false,
  name: "algeria"
}, {
  isOcean: false,
  name: "morocco"
}, {
  isOcean: false,
  name: "spain"
}, {
  isOcean: false,
  name: "portugal"
}, {
  isOcean: false,
  name: "belgium"
}, {
  isOcean: false,
  name: "holland"
}, {
  isOcean: false,
  name: "denmark"
}, {
  isOcean: false,
  name: "norway"
}, {
  isOcean: false,
  name: "sweden"
}, {
  nation: _constants_js__WEBPACK_IMPORTED_MODULE_0__["Nation"].RU,
  factoryType: "armaments",
  name: "moscow",
  isHome: true
}, {
  nation: _constants_js__WEBPACK_IMPORTED_MODULE_0__["Nation"].RU,
  factoryType: "armaments",
  name: "warsaw"
}, {
  nation: _constants_js__WEBPACK_IMPORTED_MODULE_0__["Nation"].RU,
  factoryType: "shipyard",
  name: "stpetersburg"
}, {
  nation: _constants_js__WEBPACK_IMPORTED_MODULE_0__["Nation"].RU,
  factoryType: "armaments",
  name: "kiev"
}, {
  nation: _constants_js__WEBPACK_IMPORTED_MODULE_0__["Nation"].RU,
  factoryType: "shipyard",
  name: "odessa",
  isHome: true
}, {
  nation: _constants_js__WEBPACK_IMPORTED_MODULE_0__["Nation"].GE,
  factoryType: "shipyard",
  name: "danzig"
}, {
  nation: _constants_js__WEBPACK_IMPORTED_MODULE_0__["Nation"].GE,
  factoryType: "armaments",
  name: "berlin",
  isHome: true
}, {
  nation: _constants_js__WEBPACK_IMPORTED_MODULE_0__["Nation"].GE,
  factoryType: "armaments",
  name: "munich"
}, {
  nation: _constants_js__WEBPACK_IMPORTED_MODULE_0__["Nation"].GE,
  factoryType: "armaments",
  name: "cologne"
}, {
  nation: _constants_js__WEBPACK_IMPORTED_MODULE_0__["Nation"].GE,
  factoryType: "shipyard",
  name: "hamburg",
  isHome: true
}, {
  nation: _constants_js__WEBPACK_IMPORTED_MODULE_0__["Nation"].GB,
  factoryType: "shipyard",
  name: "dublin"
}, {
  nation: _constants_js__WEBPACK_IMPORTED_MODULE_0__["Nation"].GB,
  factoryType: "shipyard",
  name: "edinburgh"
}, {
  nation: _constants_js__WEBPACK_IMPORTED_MODULE_0__["Nation"].GB,
  factoryType: "shipyard",
  name: "liverpool",
  isHome: true
}, {
  nation: _constants_js__WEBPACK_IMPORTED_MODULE_0__["Nation"].GB,
  factoryType: "armaments",
  name: "sheffield"
}, {
  nation: _constants_js__WEBPACK_IMPORTED_MODULE_0__["Nation"].GB,
  factoryType: "shipyard",
  name: "london",
  isHome: true
}, {
  nation: _constants_js__WEBPACK_IMPORTED_MODULE_0__["Nation"].FR,
  factoryType: "armaments",
  name: "paris",
  isHome: true
}, {
  nation: _constants_js__WEBPACK_IMPORTED_MODULE_0__["Nation"].FR,
  factoryType: "armaments",
  name: "dijon"
}, {
  nation: _constants_js__WEBPACK_IMPORTED_MODULE_0__["Nation"].FR,
  factoryType: "shipyard",
  name: "marseille"
}, {
  nation: _constants_js__WEBPACK_IMPORTED_MODULE_0__["Nation"].FR,
  factoryType: "shipyard",
  name: "bordeaux",
  isHome: true
}, {
  nation: _constants_js__WEBPACK_IMPORTED_MODULE_0__["Nation"].FR,
  factoryType: "shipyard",
  name: "brest"
}, {
  nation: _constants_js__WEBPACK_IMPORTED_MODULE_0__["Nation"].IT,
  factoryType: "shipyard",
  name: "genoa"
}, {
  nation: _constants_js__WEBPACK_IMPORTED_MODULE_0__["Nation"].IT,
  factoryType: "shipyard",
  name: "venice"
}, {
  nation: _constants_js__WEBPACK_IMPORTED_MODULE_0__["Nation"].IT,
  factoryType: "armaments",
  name: "florence"
}, {
  nation: _constants_js__WEBPACK_IMPORTED_MODULE_0__["Nation"].IT,
  factoryType: "armaments",
  name: "rome",
  isHome: true
}, {
  nation: _constants_js__WEBPACK_IMPORTED_MODULE_0__["Nation"].IT,
  factoryType: "shipyard",
  name: "naples",
  isHome: true
}, {
  nation: _constants_js__WEBPACK_IMPORTED_MODULE_0__["Nation"].AH,
  factoryType: "shipyard",
  name: "trieste"
}, {
  nation: _constants_js__WEBPACK_IMPORTED_MODULE_0__["Nation"].AH,
  factoryType: "armaments",
  name: "vienna",
  isHome: true
}, {
  nation: _constants_js__WEBPACK_IMPORTED_MODULE_0__["Nation"].AH,
  factoryType: "armaments",
  name: "budapest",
  isHome: true
}, {
  nation: _constants_js__WEBPACK_IMPORTED_MODULE_0__["Nation"].AH,
  factoryType: "armaments",
  name: "prague"
}, {
  nation: _constants_js__WEBPACK_IMPORTED_MODULE_0__["Nation"].AH,
  factoryType: "armaments",
  name: "lemberg"
}];
var edges = [["moscow", "kiev"], ["moscow", "warsaw"], ["moscow", "stpetersburg"], ["warsaw", "stpetersburg"], ["warsaw", "moscow"], ["warsaw", "kiev"], ["warsaw", "lemberg"], ["warsaw", "prague"], ["warsaw", "danzig"], ["stpetersburg", "moscow"], ["stpetersburg", "kiev"], ["stpetersburg", "warsaw"], ["stpetersburg", "danzig"], ["stpetersburg", "balticsea"], ["kiev", "moscow"], ["kiev", "odessa"], ["kiev", "romania"], ["kiev", "lemberg"], ["kiev", "warsaw"], ["odessa", "kiev"], ["odessa", "blacksea"], ["odessa", "romania"], ["blacksea", "odessa"], ["blacksea", "turkey"], ["blacksea", "easternmediterraneansea"], ["blacksea", "bulgaria"], ["blacksea", "romania"], ["turkey", "blacksea"], ["turkey", "easternmediterraneansea"], ["turkey", "bulgaria"], ["easternmediterraneansea", "turkey"], ["easternmediterraneansea", "ioniansea"], ["easternmediterraneansea", "greece"], ["easternmediterraneansea", "bulgaria"], ["easternmediterraneansea", "blacksea"], ["bulgaria", "romania"], ["bulgaria", "blacksea"], ["bulgaria", "turkey"], ["bulgaria", "easternmediterraneansea"], ["bulgaria", "greece"], ["bulgaria", "westbalkan"], ["romania", "lemberg"], ["romania", "kiev"], ["romania", "odessa"], ["romania", "blacksea"], ["romania", "bulgaria"], ["romania", "westbalkan"], ["romania", "budapest"], ["westbalkan", "budapest"], ["westbalkan", "romania"], ["westbalkan", "bulgaria"], ["westbalkan", "greece"], ["westbalkan", "ioniansea"], ["westbalkan", "trieste"], ["greece", "westbalkan"], ["greece", "bulgaria"], ["greece", "easternmediterraneansea"], ["greece", "ioniansea"], ["ioniansea", "trieste"], ["ioniansea", "westbalkan"], ["ioniansea", "greece"], ["ioniansea", "easternmediterraneansea"], ["ioniansea", "tunis"], ["ioniansea", "westernmediterraneansea"], ["ioniansea", "naples"], ["lemberg", "kiev"], ["lemberg", "romania"], ["lemberg", "budapest"], ["lemberg", "prague"], ["lemberg", "warsaw"], ["budapest", "lemberg"], ["budapest", "romania"], ["budapest", "westbalkan"], ["budapest", "trieste"], ["budapest", "vienna"], ["budapest", "prague"], ["prague", "danzig"], ["prague", "warsaw"], ["prague", "lemberg"], ["prague", "budapest"], ["prague", "vienna"], ["prague", "munich"], ["prague", "berlin"], ["vienna", "prague"], ["vienna", "budapest"], ["vienna", "trieste"], ["vienna", "venice"], // ["vienna", "switzerland"],
["vienna", "munich"], ["trieste", "vienna"], ["trieste", "budapest"], ["trieste", "westbalkan"], ["trieste", "ioniansea"], ["trieste", "venice"], ["venice", "vienna"], ["venice", "trieste"], ["venice", "ioniansea"], ["venice", "rome"], ["venice", "florence"], ["venice", "genoa"], ["rome", "venice"], ["rome", "ioniansea"], ["rome", "naples"], ["rome", "westernmediterraneansea"], ["rome", "florence"], ["naples", "rome"], ["naples", "ioniansea"], ["naples", "westernmediterraneansea"], ["florence", "genoa"], ["florence", "venice"], ["florence", "rome"], ["florence", "westernmediterraneansea"], // ["genoa", "switzerland"],
["genoa", "vienna"], ["genoa", "venice"], ["genoa", "florence"], ["genoa", "westernmediterraneansea"], ["genoa", "marseille"], ["marseille", "dijon"], // ["marseille", "switzerland"],
["marseille", "genoa"], ["marseille", "westernmediterraneansea"], ["marseille", "spain"], ["marseille", "bordeaux"], ["bordeaux", "brest"], ["bordeaux", "dijon"], ["bordeaux", "marseille"], ["bordeaux", "spain"], ["bordeaux", "bayofbiscay"], ["brest", "englishchannel"], ["brest", "paris"], ["brest", "dijon"], ["brest", "bordeaux"], ["brest", "bayofbiscay"], ["paris", "englishchannel"], ["paris", "belgium"], ["paris", "dijon"], ["paris", "brest"], ["dijon", "paris"], ["dijon", "belgium"], ["dijon", "munich"], // ["dijon", "switzerland"],
["dijon", "marseille"], ["dijon", "bordeaux"], ["dijon", "brest"], ["tunis", "easternmediterraneansea"], ["tunis", "westernmediterraneansea"], ["tunis", "algeria"], ["algeria", "westernmediterraneansea"], ["algeria", "tunis"], ["algeria", "morocco"], ["morocco", "bayofbiscay"], ["morocco", "algeria"], ["westernmediterraneansea", "marseille"], ["westernmediterraneansea", "genoa"], ["westernmediterraneansea", "florence"], ["westernmediterraneansea", "rome"], ["westernmediterraneansea", "naples"], ["westernmediterraneansea", "ioniansea"], ["westernmediterraneansea", "tunis"], ["westernmediterraneansea", "algeria"], ["westernmediterraneansea", "bayofbiscay"], ["westernmediterraneansea", "spain"], ["spain", "bayofbiscay"], ["spain", "bordeaux"], ["spain", "marseille"], ["spain", "westernmediterraneansea"], ["spain", "portugal"], ["portugal", "bayofbiscay"], ["portugal", "spain"], ["bayofbiscay", "northatlantic"], ["bayofbiscay", "englishchannel"], ["bayofbiscay", "brest"], ["bayofbiscay", "bordeaux"], ["bayofbiscay", "spain"], ["bayofbiscay", "portugal"], ["bayofbiscay", "morocco"], ["northatlantic", "dublin"], ["northatlantic", "edinburgh"], ["northatlantic", "northsea"], ["northatlantic", "liverpool"], ["northatlantic", "london"], ["northatlantic", "englishchannel"], ["northatlantic", "bayofbiscay"], ["dublin", "northatlantic"], ["edinburgh", "northatlantic"], ["edinburgh", "northsea"], ["edinburgh", "sheffield"], ["edinburgh", "liverpool"], ["liverpool", "edinburgh"], ["liverpool", "sheffield"], ["liverpool", "london"], ["liverpool", "northatlantic"], ["sheffield", "edinburgh"], ["sheffield", "northsea"], ["sheffield", "london"], ["sheffield", "liverpool"], ["london", "sheffield"], ["london", "northsea"], ["london", "englishchannel"], ["london", "northatlantic"], ["london", "liverpool"], ["northsea", "norway"], ["northsea", "balticsea"], ["northsea", "denmark"], ["northsea", "hamburg"], ["northsea", "holland"], ["northsea", "englishchannel"], ["northsea", "london"], ["northsea", "sheffield"], ["northsea", "edinburgh"], ["northsea", "northatlantic"], ["englishchannel", "northatlantic"], ["englishchannel", "london"], ["englishchannel", "holland"], ["englishchannel", "belgium"], ["englishchannel", "paris"], ["englishchannel", "brest"], ["englishchannel", "bayofbiscay"], ["belgium", "englishchannel"], ["belgium", "holland"], ["belgium", "cologne"], ["belgium", "munich"], ["belgium", "dijon"], ["belgium", "paris"], ["holland", "northsea"], ["holland", "hamburg"], ["holland", "cologne"], ["holland", "belgium"], ["holland", "englishchannel"], ["cologne", "belgium"], ["cologne", "holland"], ["cologne", "hamburg"], ["cologne", "berlin"], ["cologne", "munich"], ["munich", "cologne"], ["munich", "berlin"], ["munich", "prague"], ["munich", "vienna"], // ["munich", "switzerland"],
["munich", "dijon"], ["munich", "belgium"], ["berlin", "balticsea"], ["berlin", "danzig"], ["berlin", "prague"], ["berlin", "munich"], ["berlin", "cologne"], ["berlin", "hamburg"], ["hamburg", "denmark"], ["hamburg", "balticsea"], ["hamburg", "berlin"], ["hamburg", "cologne"], ["hamburg", "holland"], ["hamburg", "northsea"], ["danzig", "balticsea"], ["danzig", "stpetersburg"], ["danzig", "warsaw"], ["danzig", "prague"], ["danzig", "berlin"], ["norway", "northsea"], ["norway", "balticsea"], ["norway", "sweden"], ["sweden", "norway"], ["sweden", "balticsea"], ["balticsea", "stpetersburg"], ["balticsea", "danzig"], ["balticsea", "berlin"], ["balticsea", "hamburg"], ["balticsea", "denmark"], ["balticsea", "northsea"], ["balticsea", "sweden"]]; // render({ nodes, edges });

/* harmony default export */ __webpack_exports__["default"] = (new _gameBoard_js__WEBPACK_IMPORTED_MODULE_1__["default"]({
  nodes: nodes,
  edges: edges
}));

/***/ }),

/***/ "./constants.js":
/*!**********************!*\
  !*** ./constants.js ***!
  \**********************/
/*! exports provided: Bond, AllBonds, Nation */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Bond", function() { return Bond; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AllBonds", function() { return AllBonds; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Nation", function() { return Nation; });
/* harmony import */ var _enum_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./enum.js */ "./enum.js");
/* harmony import */ var _memo_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./memo.js */ "./memo.js");


var Nation = _enum_js__WEBPACK_IMPORTED_MODULE_0__["Enum"].fromArray(["AH", "IT", "FR", "GB", "GE", "RU"], "Nation");
var cost = {
  1: 2,
  2: 4,
  3: 6,
  4: 9,
  5: 12,
  6: 16,
  7: 20,
  8: 25,
  9: 30
};
var Bond = Object(_memo_js__WEBPACK_IMPORTED_MODULE_1__["memoize"])(function (nation, number) {
  return {
    nation: nation,
    number: number,
    cost: cost[number]
  };
});
var AllBonds = function AllBonds() {
  return new Set(["AH", "IT", "FR", "GB", "GE", "RU"].map(function (nation) {
    return Object.keys(cost).map(function (number) {
      return Bond(Nation[nation], parseInt(number));
    });
  }).flat());
};


/***/ }),

/***/ "./enum.js":
/*!*****************!*\
  !*** ./enum.js ***!
  \*****************/
/*! exports provided: Enum */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Enum", function() { return Enum; });
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var cleanroom = Object.freeze(Object.create(null));

var Enum = /*#__PURE__*/function () {
  function Enum(value, members, label) {
    _classCallCheck(this, Enum);

    Object.defineProperties(this, {
      value: {
        value: value,
        enumerable: true
      },
      members: {
        value: members,
        enumerable: false
      },
      label: {
        value: label,
        enumerable: true
      }
    });
    Object.freeze(this);
  }

  _createClass(Enum, [{
    key: "when",
    value: function when(cases) {
      var _iterator = _createForOfIteratorHelper(this.members),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var member = _step.value;

          if (!cases.hasOwnProperty(member)) {
            throw new Error("unhandled case ".concat(member));
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      var _iterator2 = _createForOfIteratorHelper(Object.getOwnPropertyNames(cases)),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var c = _step2.value;

          if (Object.is(this.value, c)) {
            return cases[c](this);
          }
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }

      throw new Error("unreachable");
    }
  }, {
    key: Symbol.toStringTag,
    get: function get() {
      return "".concat(this.label, ".").concat(this.value);
    }
  }], [{
    key: "fromArray",
    value: function fromArray(ary, label) {
      var store = new Map();
      var members = new Set(ary);

      if (label === undefined) {
        label = "<anonymous>";
      }

      ary.forEach(function (element) {
        store.set(element, new Enum(element, members, label));
      });
      return new Proxy(cleanroom, {
        get: function get(_target, property, _receiver) {
          if (store.has(property)) {
            return store.get(property);
          }

          if (property === Symbol.iterator) {
            return store.values.bind(store);
          }

          if (property === "toString") {
            return function () {
              return "".concat(label, "(").concat(Array.from(members).join("|"), ")");
            };
          }
          /* escape hatch for properties like Symbol(nodejs.util.inspect.custom) */


          if (_typeof(property) === "symbol") {
            return Reflect.get(Object, property, _receiver);
          }

          throw new Error("\"".concat(String(property), "\" not found in ").concat(label));
        },
        set: function set() {
          throw new Error("Enum ".concat(label, " cannot be mutated"));
        }
      });
    }
  }]);

  return Enum;
}();



/***/ }),

/***/ "./gameBoard.js":
/*!**********************!*\
  !*** ./gameBoard.js ***!
  \**********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return GameBoard; });
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var GameBoard = /*#__PURE__*/function () {
  function GameBoard(_ref) {
    var nodes = _ref.nodes,
        edges = _ref.edges;

    _classCallCheck(this, GameBoard);

    this.graph = new Map();
    this.byNation = new Map();
    this.setupGraph(nodes);
    this.setImmediateNeighbors(edges);
  }

  _createClass(GameBoard, [{
    key: "setupGraph",
    value: function setupGraph(nodes) {
      var _iterator = _createForOfIteratorHelper(nodes),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var _step$value = _step.value,
              province = _step$value.name,
              nation = _step$value.nation,
              isOcean = _step$value.isOcean,
              factoryType = _step$value.factoryType;
          this.graph.set(province, {
            nation: nation,
            neighbors: new Set(),
            isOcean: isOcean,
            factoryType: factoryType
          });

          if (!this.byNation.has(nation)) {
            this.byNation.set(nation, new Set());
          }

          this.byNation.get(nation).add(province);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
  }, {
    key: "setImmediateNeighbors",
    value: function setImmediateNeighbors(edges) {
      var _this = this;

      edges.forEach(function (_ref2) {
        var _ref3 = _slicedToArray(_ref2, 2),
            a = _ref3[0],
            b = _ref3[1];

        _this.graph.get(a).neighbors.add(b);

        _this.graph.get(b).neighbors.add(a);
      });
    }
  }, {
    key: "neighborsFor",
    value: function neighborsFor(_ref4) {
      var origin = _ref4.origin,
          nation = _ref4.nation,
          isFleet = _ref4.isFleet,
          friendlyFleets = _ref4.friendlyFleets;
      this.validate(origin);
      var out = new Set(); // Add all immediate neighbors

      var _iterator2 = _createForOfIteratorHelper(this.graph.get(origin).neighbors),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var _n3 = _step2.value;
          out.add(_n3);
        } // Add all home provinces if origin is in their home nation

      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }

      if (nation === this.graph.get(origin).nation && !isFleet) {
        var _iterator3 = _createForOfIteratorHelper(this.byNation.get(nation)),
            _step3;

        try {
          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
            var n = _step3.value;

            var _iterator4 = _createForOfIteratorHelper(this.graph.get(n).neighbors),
                _step4;

            try {
              for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
                var x = _step4.value;
                out.add(x);
              }
            } catch (err) {
              _iterator4.e(err);
            } finally {
              _iterator4.f();
            }
          }
        } catch (err) {
          _iterator3.e(err);
        } finally {
          _iterator3.f();
        }
      } // Convoy


      if (!isFleet) {
        var _iterator5 = _createForOfIteratorHelper(out),
            _step5;

        try {
          for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
            var _n2 = _step5.value;

            if (this.graph.get(_n2).isOcean) {
              if (friendlyFleets.has(_n2)) {
                var _iterator6 = _createForOfIteratorHelper(this.graph.get(_n2).neighbors),
                    _step6;

                try {
                  for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
                    var neighbor = _step6.value;
                    out.add(neighbor);
                  }
                } catch (err) {
                  _iterator6.e(err);
                } finally {
                  _iterator6.f();
                }
              }
            }
          }
        } catch (err) {
          _iterator5.e(err);
        } finally {
          _iterator5.f();
        }
      } // Armies can not swim
      // We all dwell where we belong
      // Navies can not walk


      var _iterator7 = _createForOfIteratorHelper(out),
          _step7;

      try {
        for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
          var _n4 = _step7.value;

          if (this.graph.get(_n4).isOcean ^ isFleet) {
            out["delete"](_n4);
          }
        } // Selflessness is a virtue

      } catch (err) {
        _iterator7.e(err);
      } finally {
        _iterator7.f();
      }

      out["delete"](origin);
      return out;
    }
  }, {
    key: "validate",
    value: function validate(origin) {
      if (!this.graph.has(origin)) throw new Error("province ".concat(origin, " not found. Available provinces are: ").concat(_toConsumableArray(this.graph.keys())));
    }
  }]);

  return GameBoard;
}();



/***/ }),

/***/ "./imperial.js":
/*!*********************!*\
  !*** ./imperial.js ***!
  \*********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Imperial; });
/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants.js */ "./constants.js");
/* harmony import */ var _action_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./action.js */ "./action.js");
/* harmony import */ var _board_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./board.js */ "./board.js");
/* harmony import */ var _standardSetup_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./standardSetup.js */ "./standardSetup.js");
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }






var Imperial = /*#__PURE__*/function () {
  _createClass(Imperial, null, [{
    key: "fromLog",
    value: function fromLog(log) {
      var game = new Imperial();
      log.forEach(function (entry) {
        return game.tick(entry);
      });
      return game;
    }
  }]);

  function Imperial(board) {
    _classCallCheck(this, Imperial);

    this.board = board || _board_js__WEBPACK_IMPORTED_MODULE_2__["default"];
    this.log = [];
  }

  _createClass(Imperial, [{
    key: "tick",
    value: function tick(action) {
      var _this = this;

      this.log.push(action);

      switch (action.type) {
        case "noop":
          return;

        case "initialize":
          var s = Object(_standardSetup_js__WEBPACK_IMPORTED_MODULE_3__["default"])({
            players: action.payload.players,
            provinceNames: Array.from(this.board.graph.keys())
          });
          this.availableBonds = s.availableBonds;
          this.currentNation = s.currentNation;
          this.investorCardHolder = s.investorCardHolder;
          this.nations = s.nations;
          this.order = s.order;
          this.players = s.players;
          this.provinces = s.provinces;
          this.units = s.units;
          this.currentPlayerName = this.nations.get(this.currentNation).controller;
          this.availableActions = new Set(this.rondelActions(_constants_js__WEBPACK_IMPORTED_MODULE_0__["Nation"].AH));
          return;

        case "bondPurchase":
          this.purchaseBond(action);
          this.handleAdvancePlayer();
          this.availableActions = new Set(this.rondelActions(this.currentNation));
          return;

        case "endManeuver":
          this.currentNation = this.nextNation(this.currentNation);
          this.availableActions = new Set(this.rondelActions(this.currentNation));
          return;

        case "fight":
          this.units.get(_constants_js__WEBPACK_IMPORTED_MODULE_0__["Nation"].FR).get(action.payload.province).fleets -= 1;
          this.units.get(_constants_js__WEBPACK_IMPORTED_MODULE_0__["Nation"].IT).get(action.payload.province).fleets -= 1;
          this.provinces.get(action.payload.province).flag = action.payload.incumbent;
          return;

        case "buildFactory":
          this.buildFactory(action);

          if (this.nations.get(this.currentNation).previousRondelPosition === "maneuver1") {
            this.endOfInvestorTurn();
          }

          this.handleAdvancePlayer();
          this.availableActions = new Set(this.rondelActions(this.currentNation));
          return;

        case "import":
          action.payload.placements.forEach(function (_ref) {
            var province = _ref.province,
                type = _ref.type;

            var nation = _this.board.graph.get(province).nation;

            if (type === "army") {
              _this.units.get(nation).get(province).armies++;
            } else {
              _this.units.get(nation).get(province).fleets++;
            }

            _this.nations.get(nation).treasury--;
          });
          var potentialPreInvestorSlots = ["maneuver1", "production1", "factory", "taxation", "maneuver2"];

          if (potentialPreInvestorSlots.includes(this.nations.get(this.currentNation).previousRondelPosition)) {
            this.endOfInvestorTurn();
            return;
          }

          this.handleAdvancePlayer();
          this.availableActions = new Set(this.rondelActions(this.currentNation));
          return;

        case "maneuver":
          var origin = action.payload.origin;
          var destination = action.payload.destination;
          var unitType = this.board.graph.get(destination).isOcean ? "fleet" : "army"; // Update province flag

          this.provinces.get(destination).flag = this.currentNation; // TODO: Do we really want to store (and need to update)
          // flag count like this?

          this.nations.get(this.currentNation).flagCount += 1; // Execute the unit movement

          if (unitType === "fleet") {
            this.units.get(this.currentNation).get(origin).fleets--;
            this.units.get(this.currentNation).get(destination).fleets++;
          }

          if (unitType === "army") {
            this.units.get(this.currentNation).get(origin).armies--;
            this.units.get(this.currentNation).get(destination).armies++; // Fleets cannot move after armies!

            this.unitsToMove = this.unitsToMove.filter(function (_ref2) {
              var _ref3 = _slicedToArray(_ref2, 2),
                  _ = _ref3[0],
                  type = _ref3[1];

              return type === "army";
            });
          } // Remove the unit that just moved from this.unitsToMove


          var i = this.unitsToMove.findIndex(function (arr) {
            return arr[0] === action.payload.origin && arr[1] === unitType;
          });
          this.unitsToMove.splice(i, 1); // Interrupt manuevers in case of potential conflict!

          var _iterator = _createForOfIteratorHelper(this.nations),
              _step;

          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              var _step$value = _slicedToArray(_step.value, 2),
                  nation = _step$value[0],
                  _ = _step$value[1];

              if (nation !== this.currentNation && (this.units.get(nation).get(destination).armies > 0 || this.units.get(nation).get(destination).fleets > 0)) {
                this.availableActions = new Set([_action_js__WEBPACK_IMPORTED_MODULE_1__["default"].coexist({
                  province: destination,
                  incumbent: nation,
                  challenger: this.currentNation
                }), _action_js__WEBPACK_IMPORTED_MODULE_1__["default"].fight({
                  province: destination,
                  incumbent: nation,
                  challenger: this.currentNation
                })]);
                return;
              }
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }

          if (this.unitsToMove.length > 0) {
            var provincesWithFleets = new Map();
            var provincesWithArmies = new Map();
            var out = new Set([_action_js__WEBPACK_IMPORTED_MODULE_1__["default"].endManeuver()]);
            this.unitsToMove.forEach(function (_ref4) {
              var _ref5 = _slicedToArray(_ref4, 2),
                  origin = _ref5[0],
                  type = _ref5[1];

              var units = _this.units.get(_this.currentNation).get(origin);

              if (units.fleets > 0) {
                provincesWithFleets.set(origin, units.fleets);
              } else if (units.armies > 0) {
                provincesWithArmies.set(origin, units.armies);
              }

              var _iterator2 = _createForOfIteratorHelper(provincesWithFleets),
                  _step2;

              try {
                for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                  var _step2$value = _slicedToArray(_step2.value, 2),
                      _origin = _step2$value[0],
                      count = _step2$value[1];

                  var _iterator5 = _createForOfIteratorHelper(_this.board.neighborsFor({
                    origin: _origin,
                    nation: _this.currentNation,
                    isFleet: true,
                    friendlyFleets: new Set()
                  })),
                      _step5;

                  try {
                    for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
                      var _destination = _step5.value;
                      out.add(_action_js__WEBPACK_IMPORTED_MODULE_1__["default"].maneuver({
                        origin: _origin,
                        destination: _destination
                      }));
                    }
                  } catch (err) {
                    _iterator5.e(err);
                  } finally {
                    _iterator5.f();
                  }
                }
              } catch (err) {
                _iterator2.e(err);
              } finally {
                _iterator2.f();
              }

              var friendlyFleets = new Set();

              var _iterator3 = _createForOfIteratorHelper(_this.units.get(_this.currentNation)),
                  _step3;

              try {
                for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
                  var _step3$value = _slicedToArray(_step3.value, 2),
                      province = _step3$value[0],
                      _units = _step3$value[1];

                  if (_units.fleets > 0) {
                    friendlyFleets.add(province);
                  }
                }
              } catch (err) {
                _iterator3.e(err);
              } finally {
                _iterator3.f();
              }

              var _iterator4 = _createForOfIteratorHelper(provincesWithArmies),
                  _step4;

              try {
                for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
                  var _step4$value = _slicedToArray(_step4.value, 2),
                      _origin2 = _step4$value[0],
                      _count = _step4$value[1];

                  var _iterator6 = _createForOfIteratorHelper(_this.board.neighborsFor({
                    origin: _origin2,
                    nation: _this.currentNation,
                    isFleet: false,
                    friendlyFleets: friendlyFleets
                  })),
                      _step6;

                  try {
                    for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
                      var _destination2 = _step6.value;
                      out.add(_action_js__WEBPACK_IMPORTED_MODULE_1__["default"].maneuver({
                        origin: _origin2,
                        destination: _destination2
                      }));
                    }
                  } catch (err) {
                    _iterator6.e(err);
                  } finally {
                    _iterator6.f();
                  }
                }
              } catch (err) {
                _iterator4.e(err);
              } finally {
                _iterator4.f();
              }
            });
            this.availableActions = out;
          } else {
            if (this.nations.get(this.currentNation).rondelPosition === "maneuver2") {
              var _potentialPreInvestorSlots = ["factory", "production1", "maneuver1"];

              if (_potentialPreInvestorSlots.includes(this.nations.get(this.currentNation).previousRondelPosition)) {
                this.endOfInvestorTurn();
              }
            }

            this.currentNation = this.nextNation(this.currentNation);
            this.availableActions = new Set(this.rondelActions(this.currentNation));
          }

          return;

        case "rondel":
          this.currentNation = action.payload.nation;
          this.nations.get(this.currentNation).previousRondelPosition = this.nations.get(this.currentNation).rondelPosition;
          this.nations.get(this.currentNation).rondelPosition = action.payload.slot;
          this.players[this.currentPlayerName].cash -= action.payload.cost;

          switch (action.payload.slot) {
            case "investor":
              var _loop = function _loop() {
                var player = _Object$keys[_i2];

                if (player !== _this.currentPlayerName) {
                  _this.playerBondsOfNation(player, action.payload.nation).forEach(function (bond) {
                    if (_this.nations.get(action.payload.nation).treasury >= bond.number) {
                      _this.nations.get(action.payload.nation).treasury -= bond.number;
                    } else {
                      _this.players[_this.currentPlayerName].cash -= bond.number;
                    }

                    _this.players[player].cash += bond.number;
                  });
                }
              };

              // 1. Nation pays bond-holders interest
              for (var _i2 = 0, _Object$keys = Object.keys(this.players); _i2 < _Object$keys.length; _i2++) {
                _loop();
              } // Nation pays its controller interest


              var amountOwedToController = _toConsumableArray(this.players[this.currentPlayerName].bonds).filter(function (bond) {
                return bond.nation === action.payload.nation;
              }).reduce(function (x, y) {
                return x + y.number;
              }, 0);

              if (this.nations.get(action.payload.nation).treasury > amountOwedToController) {
                this.players[this.currentPlayerName].cash += amountOwedToController;
                this.nations.get(action.payload.nation).treasury -= amountOwedToController;
              }

              this.endOfInvestorTurn();
              return;

            case "import":
              var availableActions = new Set([_action_js__WEBPACK_IMPORTED_MODULE_1__["default"]["import"]({
                placements: []
              })]);
              var homeProvinces = this.board.byNation.get(action.payload.nation);

              var _iterator7 = _createForOfIteratorHelper(homeProvinces),
                  _step7;

              try {
                for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
                  var province = _step7.value;
                  availableActions.add(_action_js__WEBPACK_IMPORTED_MODULE_1__["default"]["import"]({
                    placements: [{
                      province: province,
                      type: "army"
                    }]
                  }));

                  var _iterator8 = _createForOfIteratorHelper(homeProvinces),
                      _step8;

                  try {
                    for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
                      var province2 = _step8.value;
                      if (province2 === province) continue;
                      availableActions.add(_action_js__WEBPACK_IMPORTED_MODULE_1__["default"]["import"]({
                        placements: [{
                          province: province,
                          type: "army"
                        }, {
                          province: province2,
                          type: "army"
                        }]
                      }));

                      var _iterator9 = _createForOfIteratorHelper(homeProvinces),
                          _step9;

                      try {
                        for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
                          var province3 = _step9.value;
                          if (province === province3 || province2 === province3) continue;
                          availableActions.add(_action_js__WEBPACK_IMPORTED_MODULE_1__["default"]["import"]({
                            placements: [{
                              province: province,
                              type: "army"
                            }, {
                              province: province2,
                              type: "army"
                            }, {
                              province: province3,
                              type: "army"
                            }]
                          }));
                        }
                      } catch (err) {
                        _iterator9.e(err);
                      } finally {
                        _iterator9.f();
                      }
                    }
                  } catch (err) {
                    _iterator8.e(err);
                  } finally {
                    _iterator8.f();
                  }
                }
              } catch (err) {
                _iterator7.e(err);
              } finally {
                _iterator7.f();
              }

              this.availableActions = availableActions;
              return;

            case "production1":
            case "production2":
              Array.from(this.board.byNation.get(action.payload.nation)).filter(function (province) {
                return _this.provinces.get(province).factory !== null;
              }).forEach(function (province) {
                if (_this.provinces.get(province).factory === "shipyard") {
                  _this.units.get(action.payload.nation).get(province).fleets++;
                } else {
                  _this.units.get(action.payload.nation).get(province).armies++;
                }
              });

              if (action.payload.slot === "production2") {
                var _potentialPreInvestorSlots3 = ["maneuver1", "production1", "factory", "taxation"];

                if (_potentialPreInvestorSlots3.includes(this.nations.get(this.currentNation).previousRondelPosition)) {
                  this.endOfInvestorTurn();
                  this.handleAdvancePlayer();
                  return;
                }
              }

              this.handleAdvancePlayer();
              this.availableActions = new Set(this.rondelActions(this.currentNation));
              return;

            case "taxation":
              var nationName = action.payload.nation;

              var _nation = this.nations.get(nationName);

              var taxes = this.factoryCount(nationName) * 2 + _nation.flagCount;

              _nation.treasury += taxes - this.unitCount(nationName);
              this.players[this.nations.get(nationName).controller].cash += taxes - _nation.taxChartPosition;
              _nation.taxChartPosition = taxes;

              if (taxes === 6) {
                _nation.powerPoints += 1;
              } else {
                _nation.powerPoints += 3;
              }

              this.availableActions = new Set(this.rondelActions(this.nextNation(this.currentNation)));
              var _potentialPreInvestorSlots2 = ["maneuver1", "production1"];

              if (_potentialPreInvestorSlots2.includes(this.nations.get(this.currentNation).previousRondelPosition)) {
                this.endOfInvestorTurn();
              }

              return;

            case "maneuver1":
            case "maneuver2":
              var destinations = new Set([_action_js__WEBPACK_IMPORTED_MODULE_1__["default"].endManeuver()]); // Collect all units that are allowed to move on this turn

              this.unitsToMove = [];

              var _iterator10 = _createForOfIteratorHelper(this.units.get(action.payload.nation)),
                  _step10;

              try {
                for (_iterator10.s(); !(_step10 = _iterator10.n()).done;) {
                  var _step10$value = _slicedToArray(_step10.value, 2),
                      _province = _step10$value[0],
                      units = _step10$value[1];

                  var fleetCount = units.fleets;
                  var armyCount = units.armies;

                  while (fleetCount > 0 || armyCount > 0) {
                    if (fleetCount > 0) {
                      this.unitsToMove.push([_province, "fleet"]);
                      fleetCount--;
                    } else if (armyCount > 0) {
                      this.unitsToMove.push([_province, "army"]);
                      armyCount--;
                    }
                  }
                }
              } catch (err) {
                _iterator10.e(err);
              } finally {
                _iterator10.f();
              }

              var _provincesWithFleets = new Map();

              var _provincesWithArmies = new Map();

              var _iterator11 = _createForOfIteratorHelper(this.units.get(action.payload.nation)),
                  _step11;

              try {
                for (_iterator11.s(); !(_step11 = _iterator11.n()).done;) {
                  var _step11$value = _slicedToArray(_step11.value, 2),
                      _province2 = _step11$value[0],
                      _units2 = _step11$value[1];

                  if (_units2.fleets > 0) {
                    _provincesWithFleets.set(_province2, _units2.fleets);
                  }
                }
              } catch (err) {
                _iterator11.e(err);
              } finally {
                _iterator11.f();
              }

              var _iterator12 = _createForOfIteratorHelper(_provincesWithFleets),
                  _step12;

              try {
                for (_iterator12.s(); !(_step12 = _iterator12.n()).done;) {
                  var _step12$value = _slicedToArray(_step12.value, 2),
                      _origin3 = _step12$value[0],
                      count = _step12$value[1];

                  var _iterator15 = _createForOfIteratorHelper(this.board.neighborsFor({
                    origin: _origin3,
                    nation: action.payload.nation,
                    isFleet: true,
                    friendlyFleets: new Set()
                  })),
                      _step15;

                  try {
                    for (_iterator15.s(); !(_step15 = _iterator15.n()).done;) {
                      var _destination3 = _step15.value;
                      destinations.add(_action_js__WEBPACK_IMPORTED_MODULE_1__["default"].maneuver({
                        origin: _origin3,
                        destination: _destination3
                      }));
                    }
                  } catch (err) {
                    _iterator15.e(err);
                  } finally {
                    _iterator15.f();
                  }
                }
              } catch (err) {
                _iterator12.e(err);
              } finally {
                _iterator12.f();
              }

              var _iterator13 = _createForOfIteratorHelper(this.units.get(action.payload.nation)),
                  _step13;

              try {
                for (_iterator13.s(); !(_step13 = _iterator13.n()).done;) {
                  var _step13$value = _slicedToArray(_step13.value, 2),
                      _province3 = _step13$value[0],
                      _units3 = _step13$value[1];

                  if (_units3.armies > 0) {
                    _provincesWithArmies.set(_province3, _units3.armies);
                  }
                }
              } catch (err) {
                _iterator13.e(err);
              } finally {
                _iterator13.f();
              }

              var _iterator14 = _createForOfIteratorHelper(_provincesWithArmies),
                  _step14;

              try {
                for (_iterator14.s(); !(_step14 = _iterator14.n()).done;) {
                  var _step14$value = _slicedToArray(_step14.value, 2),
                      _origin4 = _step14$value[0],
                      _count2 = _step14$value[1];

                  var _iterator16 = _createForOfIteratorHelper(this.board.neighborsFor({
                    origin: _origin4,
                    nation: action.payload.nation,
                    isFleet: false,
                    friendlyFleets: new Set()
                  })),
                      _step16;

                  try {
                    for (_iterator16.s(); !(_step16 = _iterator16.n()).done;) {
                      var _destination4 = _step16.value;
                      destinations.add(_action_js__WEBPACK_IMPORTED_MODULE_1__["default"].maneuver({
                        origin: _origin4,
                        destination: _destination4
                      }));
                    }
                  } catch (err) {
                    _iterator16.e(err);
                  } finally {
                    _iterator16.f();
                  }
                }
              } catch (err) {
                _iterator14.e(err);
              } finally {
                _iterator14.f();
              }

              this.availableActions = destinations;
              return;

            case "factory":
              this.availableActions = new Set(this.buildFactoryAction(action.payload.nation));
              return;
          }

      }
    }
  }, {
    key: "endOfInvestorTurn",
    value: function endOfInvestorTurn() {
      var _this2 = this;

      // 2. Investor card holder gets 2m cash
      this.players[this.investorCardHolder].cash += 2; // Investor card holder may buy a bond belonging to the nation

      this.availableActions = new Set(_toConsumableArray(this.availableBonds).filter(function (bond) {
        var player = _this2.investorCardHolder;

        var exchangeableBondCosts = _toConsumableArray(_this2.players[player].bonds).filter(function (exchangeableBond) {
          return exchangeableBond.nation === bond.nation;
        }).map(function (x) {
          return x.cost;
        });

        var topBondCost = Math.max(exchangeableBondCosts) || 0;
        return bond.cost <= _this2.players[player].cash + topBondCost;
      }).map(function (bond) {
        return _action_js__WEBPACK_IMPORTED_MODULE_1__["default"].bondPurchase({
          nation: bond.nation,
          player: _this2.investorCardHolder,
          cost: bond.cost
        });
      })); // TODO: 3. Investing without a flag
    }
  }, {
    key: "playerBondsOfNation",
    value: function playerBondsOfNation(player, nation) {
      var out = [];

      var _iterator17 = _createForOfIteratorHelper(this.players[player].bonds),
          _step17;

      try {
        for (_iterator17.s(); !(_step17 = _iterator17.n()).done;) {
          var _bond = _step17.value;

          if (_bond.nation === nation) {
            out.push(_bond);
          }
        }
      } catch (err) {
        _iterator17.e(err);
      } finally {
        _iterator17.f();
      }

      return out;
    }
  }, {
    key: "handleAdvancePlayer",
    value: function handleAdvancePlayer() {
      this.currentNation = this.nextNation(this.currentNation);
      this.currentPlayerName = this.nations.get(this.currentNation).controller;
    }
  }, {
    key: "purchaseBond",
    value: function purchaseBond(action) {
      var uncost = {
        2: 1,
        4: 2,
        6: 3,
        9: 4,
        12: 5,
        16: 6,
        20: 7,
        25: 8,
        30: 9
      };
      var bonds = this.players[action.payload.player].bonds;

      if (action.payload.cost > this.players[action.payload.player].cash) {
        var tradeIn = _toConsumableArray(bonds).filter(function (_ref6) {
          var nation = _ref6.nation;
          return nation === action.payload.nation;
        }).map(function (_ref7) {
          var cost = _ref7.cost;
          return cost;
        })[0];

        if (tradeIn === undefined) {
          throw new Error("".concat(action.payload.player, " does not have any bonds to trade for ").concat(action.payload.nation));
        }

        var bondToTrade = Object(_constants_js__WEBPACK_IMPORTED_MODULE_0__["Bond"])(action.payload.nation, uncost[tradeIn]);
        var netCost = action.payload.cost - bondToTrade.cost;
        this.nations.get(action.payload.nation).treasury += netCost;
        this.availableBonds.add(bondToTrade);
        this.players[action.payload.player].cash -= netCost;
        this.players[action.payload.player].bonds["delete"](bondToTrade);
      } else {
        this.nations.get(action.payload.nation).treasury += action.payload.cost;
        this.players[action.payload.player].cash -= action.payload.cost;
      }

      var newBond = Object(_constants_js__WEBPACK_IMPORTED_MODULE_0__["Bond"])(action.payload.nation, uncost[action.payload.cost]);

      if (!this.availableBonds.has(newBond)) {
        throw new Error("".concat(bond, " not available"));
      }

      this.players[action.payload.player].bonds.add(newBond);
      this.availableBonds["delete"](newBond);

      if (this.nations.get(action.payload.nation).controller === null) {
        this.nations.get(action.payload.nation).controller = action.payload.player;
      }

      if (this.totalInvestmentInNation(action.payload.player, action.payload.nation) > this.totalInvestmentInNation(this.nations.get(action.payload.nation).controller, action.payload.nation)) {
        this.nations.get(action.payload.nation).controller = action.payload.player;
      }

      this.advanceInvestorCard();
    }
  }, {
    key: "totalInvestmentInNation",
    value: function totalInvestmentInNation(player, nation) {
      return _toConsumableArray(this.players[player].bonds).filter(function (bond) {
        return bond.nation === nation;
      }).reduce(function (x, y) {
        return x + y.cost;
      }, 0);
    }
  }, {
    key: "advanceInvestorCard",
    value: function advanceInvestorCard() {
      if (!!this.investorCardHolder) {
        var index = this.order.indexOf(this.investorCardHolder);

        if (index === 0) {
          this.investorCardHolder = this.order[this.order.length - 1];
        } else {
          this.investorCardHolder = this.order[index - 1];
        }
      }
    }
  }, {
    key: "unitCount",
    value: function unitCount(nation) {
      var out = 0;

      var _iterator18 = _createForOfIteratorHelper(this.units.get(nation)),
          _step18;

      try {
        for (_iterator18.s(); !(_step18 = _iterator18.n()).done;) {
          var _step18$value = _slicedToArray(_step18.value, 2),
              province = _step18$value[0],
              units = _step18$value[1];

          out += units.armies;
          out += units.fleets;
        }
      } catch (err) {
        _iterator18.e(err);
      } finally {
        _iterator18.f();
      }

      return out;
    }
  }, {
    key: "buildFactory",
    value: function buildFactory(action) {
      this.provinces.get(action.payload.province).factory = this.board.graph.get(action.payload.province).factoryType;
      this.nations.get(this.currentNation).treasury -= 5;
    }
  }, {
    key: "rondelActions",
    value: function rondelActions(nation) {
      var rondelPositions = ["factory", "production1", "maneuver1", "investor", "import", "production2", "maneuver2", "taxation"];
      var currentPosition = this.nations.get(nation).rondelPosition;
      var out = new Set();

      if (currentPosition) {
        var currentIndex = rondelPositions.indexOf(currentPosition);
        var distance = currentIndex - 8;
        [rondelPositions[currentIndex + 1] || rondelPositions[distance + 1], rondelPositions[currentIndex + 2] || rondelPositions[distance + 2], rondelPositions[currentIndex + 3] || rondelPositions[distance + 3]].forEach(function (slot) {
          out.add(_action_js__WEBPACK_IMPORTED_MODULE_1__["default"].rondel({
            nation: nation,
            cost: 0,
            slot: slot
          }));
        });
        out.add(_action_js__WEBPACK_IMPORTED_MODULE_1__["default"].rondel({
          nation: nation,
          cost: 2,
          slot: rondelPositions[currentIndex + 4] || rondelPositions[distance + 4]
        }));
        out.add(_action_js__WEBPACK_IMPORTED_MODULE_1__["default"].rondel({
          nation: nation,
          cost: 4,
          slot: rondelPositions[currentIndex + 5] || rondelPositions[distance + 5]
        }));
        out.add(_action_js__WEBPACK_IMPORTED_MODULE_1__["default"].rondel({
          nation: nation,
          cost: 6,
          slot: rondelPositions[currentIndex + 6] || rondelPositions[distance + 6]
        }));
      } else {
        rondelPositions.forEach(function (slot) {
          out.add(_action_js__WEBPACK_IMPORTED_MODULE_1__["default"].rondel({
            nation: nation,
            cost: 0,
            slot: slot
          }));
        });
      }

      return out;
    }
  }, {
    key: "nextNation",
    value: function nextNation(lastTurnNation) {
      var nextNation = lastTurnNation.when({
        AH: function AH() {
          return _constants_js__WEBPACK_IMPORTED_MODULE_0__["Nation"].IT;
        },
        IT: function IT() {
          return _constants_js__WEBPACK_IMPORTED_MODULE_0__["Nation"].FR;
        },
        FR: function FR() {
          return _constants_js__WEBPACK_IMPORTED_MODULE_0__["Nation"].GB;
        },
        GB: function GB() {
          return _constants_js__WEBPACK_IMPORTED_MODULE_0__["Nation"].GE;
        },
        GE: function GE() {
          return _constants_js__WEBPACK_IMPORTED_MODULE_0__["Nation"].RU;
        },
        RU: function RU() {
          return _constants_js__WEBPACK_IMPORTED_MODULE_0__["Nation"].AH;
        }
      });

      if (this.nations.get(nextNation).controller) {
        return nextNation;
      } else {
        return this.nextNation(nextNation);
      }
    }
  }, {
    key: "importAction",
    value: function importAction(nation) {
      var out = new Set();

      var _iterator19 = _createForOfIteratorHelper(this.board.byNation.get(nation)),
          _step19;

      try {
        for (_iterator19.s(); !(_step19 = _iterator19.n()).done;) {
          var province = _step19.value;

          if (this.board.graph.get(province).factoryType === "shipyard") {
            out.add(_action_js__WEBPACK_IMPORTED_MODULE_1__["default"]["import"]({
              placements: [{
                province: province,
                unit: "fleet"
              }]
            }));
          }

          out.add(_action_js__WEBPACK_IMPORTED_MODULE_1__["default"]["import"]({
            placements: [{
              province: province,
              unit: "army"
            }]
          }));
        }
      } catch (err) {
        _iterator19.e(err);
      } finally {
        _iterator19.f();
      }

      return out;
    }
  }, {
    key: "buildFactoryAction",
    value: function buildFactoryAction(nation) {
      return new Set(nation.when({
        AH: function AH() {
          return ["trieste", "prague", "lemburg"];
        },
        IT: function IT() {
          return ["genoa", "venice", "florence"];
        },
        FR: function FR() {
          return ["brest", "dijon", "marseille"];
        },
        GB: function GB() {
          return ["dublin", "sheffield", "edinburgh"];
        },
        GE: function GE() {
          return ["danzig", "munich", "cologne"];
        },
        RU: function RU() {
          return ["kiev", "st. petersburg", "warsaw"];
        }
      }).map(function (province) {
        return _action_js__WEBPACK_IMPORTED_MODULE_1__["default"].buildFactory({
          province: province
        });
      }));
    }
  }, {
    key: "factoryCount",
    value: function factoryCount(nation) {
      var count = 0;

      var _iterator20 = _createForOfIteratorHelper(this.board.byNation.get(nation)),
          _step20;

      try {
        for (_iterator20.s(); !(_step20 = _iterator20.n()).done;) {
          var province = _step20.value;

          if (this.provinces.get(province).factory) {
            count++;
          }
        }
      } catch (err) {
        _iterator20.e(err);
      } finally {
        _iterator20.f();
      }

      return count;
    }
  }]);

  return Imperial;
}();



/***/ }),

/***/ "./memo.js":
/*!*****************!*\
  !*** ./memo.js ***!
  \*****************/
/*! exports provided: memoize */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "memoize", function() { return memoize; });
function _toArray(arr) { return _arrayWithHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var NO_VALUE = Symbol("NO_VALUE");
var SET_START = Symbol("SET_START");
var ARY_START = Symbol("ARY_START");
var MAP_START = Symbol("MAP_START");
var OBJ_START = Symbol("OBJ_START");
var ITER_END = Symbol("ITER_END");

var Trie = /*#__PURE__*/function () {
  function Trie(value) {
    _classCallCheck(this, Trie);

    this.value = value;
    this.children = new Map();
  }

  _createClass(Trie, [{
    key: "getOrInsert",
    value: function getOrInsert(path, fn, args) {
      if (path.length === 0) {
        if (this.value === NO_VALUE) {
          this.value = fn.apply(void 0, _toConsumableArray(args));
        }

        return this.value;
      }

      var _path = _toArray(path),
          head = _path[0],
          tail = _path.slice(1);

      if (head instanceof Array) {
        return this.getOrInsert([ARY_START].concat(_toConsumableArray(head), [ITER_END], _toConsumableArray(tail)), fn, args);
      }

      if (head instanceof Set) {
        var entries = _toConsumableArray(head);

        entries.sort();
        return this.getOrInsert([SET_START].concat(_toConsumableArray(entries), [ITER_END], _toConsumableArray(tail)), fn, args);
      }

      if (head instanceof Map) {
        var _entries = _toConsumableArray(head.entries()).sort();

        return this.getOrInsert([MAP_START].concat(_toConsumableArray(_entries), [ITER_END], _toConsumableArray(tail)), fn, args);
      }

      if (head instanceof Object) {
        var _entries2 = Object.entries(head).sort();

        return this.getOrInsert([OBJ_START].concat(_toConsumableArray(_entries2), [ITER_END], _toConsumableArray(tail)), fn, args);
      }

      if (!this.children.has(head)) {
        this.children.set(head, new Trie(NO_VALUE));
      }

      return this.children.get(head).getOrInsert(tail, fn, args);
    }
  }]);

  return Trie;
}();

var memoize = function memoize(fn) {
  var memory = new Trie(NO_VALUE);
  return function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return memory.getOrInsert(args, fn, args);
  };
};



/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/style.css":
/*!*************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/style.css ***!
  \*************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(true);
// Module
___CSS_LOADER_EXPORT___.push([module.i, "button {\n  background: #224f4a;\n  border: none;\n  color: white;\n  font-size: 1.5rem;\n  margin: 0 auto;\n  padding: 2rem;\n}\n\n.buttons {\n  display: flex;\n  justify-content: space-around;\n}\n\n.bonds {\n  list-style: none;\n  padding-left: 0;\n}\n\nul {\n  display: flex;\n  justify-content: space-around;\n  list-style: none;\n  padding-left: 0;\n}\n\n.player {\n  background: #9dd7d0;\n  padding: 3rem;\n}\n\n.rondel {\n  text-align: center;\n}\n\n.current_player {\n  font-size: 3rem;\n  margin-top: 0.5rem;\n  padding: 1rem 0;\n  position: absolute;\n  top: -0.2rem;\n}\n\n.sm-flag {\n  height: 1rem;\n}\n", "",{"version":3,"sources":["style.css"],"names":[],"mappings":"AAAA;EACE,mBAAmB;EACnB,YAAY;EACZ,YAAY;EACZ,iBAAiB;EACjB,cAAc;EACd,aAAa;AACf;;AAEA;EACE,aAAa;EACb,6BAA6B;AAC/B;;AAEA;EACE,gBAAgB;EAChB,eAAe;AACjB;;AAEA;EACE,aAAa;EACb,6BAA6B;EAC7B,gBAAgB;EAChB,eAAe;AACjB;;AAEA;EACE,mBAAmB;EACnB,aAAa;AACf;;AAEA;EACE,kBAAkB;AACpB;;AAEA;EACE,eAAe;EACf,kBAAkB;EAClB,eAAe;EACf,kBAAkB;EAClB,YAAY;AACd;;AAEA;EACE,YAAY;AACd","file":"style.css","sourcesContent":["button {\n  background: #224f4a;\n  border: none;\n  color: white;\n  font-size: 1.5rem;\n  margin: 0 auto;\n  padding: 2rem;\n}\n\n.buttons {\n  display: flex;\n  justify-content: space-around;\n}\n\n.bonds {\n  list-style: none;\n  padding-left: 0;\n}\n\nul {\n  display: flex;\n  justify-content: space-around;\n  list-style: none;\n  padding-left: 0;\n}\n\n.player {\n  background: #9dd7d0;\n  padding: 3rem;\n}\n\n.rondel {\n  text-align: center;\n}\n\n.current_player {\n  font-size: 3rem;\n  margin-top: 0.5rem;\n  padding: 1rem 0;\n  position: absolute;\n  top: -0.2rem;\n}\n\n.sm-flag {\n  height: 1rem;\n}\n"]}]);
// Exports
/* harmony default export */ __webpack_exports__["default"] = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
// eslint-disable-next-line func-names
module.exports = function (useSourceMap) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = cssWithMappingToString(item, useSourceMap);

      if (item[2]) {
        return "@media ".concat(item[2], " {").concat(content, "}");
      }

      return content;
    }).join('');
  }; // import a list of modules into the list
  // eslint-disable-next-line func-names


  list.i = function (modules, mediaQuery, dedupe) {
    if (typeof modules === 'string') {
      // eslint-disable-next-line no-param-reassign
      modules = [[null, modules, '']];
    }

    var alreadyImportedModules = {};

    if (dedupe) {
      for (var i = 0; i < this.length; i++) {
        // eslint-disable-next-line prefer-destructuring
        var id = this[i][0];

        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }

    for (var _i = 0; _i < modules.length; _i++) {
      var item = [].concat(modules[_i]);

      if (dedupe && alreadyImportedModules[item[0]]) {
        // eslint-disable-next-line no-continue
        continue;
      }

      if (mediaQuery) {
        if (!item[2]) {
          item[2] = mediaQuery;
        } else {
          item[2] = "".concat(mediaQuery, " and ").concat(item[2]);
        }
      }

      list.push(item);
    }
  };

  return list;
};

function cssWithMappingToString(item, useSourceMap) {
  var content = item[1] || ''; // eslint-disable-next-line prefer-destructuring

  var cssMapping = item[3];

  if (!cssMapping) {
    return content;
  }

  if (useSourceMap && typeof btoa === 'function') {
    var sourceMapping = toComment(cssMapping);
    var sourceURLs = cssMapping.sources.map(function (source) {
      return "/*# sourceURL=".concat(cssMapping.sourceRoot || '').concat(source, " */");
    });
    return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
  }

  return [content].join('\n');
} // Adapted from convert-source-map (MIT)


function toComment(sourceMap) {
  // eslint-disable-next-line no-undef
  var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
  var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
  return "/*# ".concat(data, " */");
}

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isOldIE = function isOldIE() {
  var memo;
  return function memorize() {
    if (typeof memo === 'undefined') {
      // Test for IE <= 9 as proposed by Browserhacks
      // @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
      // Tests for existence of standard globals is to allow style-loader
      // to operate correctly into non-standard environments
      // @see https://github.com/webpack-contrib/style-loader/issues/177
      memo = Boolean(window && document && document.all && !window.atob);
    }

    return memo;
  };
}();

var getTarget = function getTarget() {
  var memo = {};
  return function memorize(target) {
    if (typeof memo[target] === 'undefined') {
      var styleTarget = document.querySelector(target); // Special case to return head of iframe instead of iframe itself

      if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
        try {
          // This will throw an exception if access to iframe is blocked
          // due to cross-origin restrictions
          styleTarget = styleTarget.contentDocument.head;
        } catch (e) {
          // istanbul ignore next
          styleTarget = null;
        }
      }

      memo[target] = styleTarget;
    }

    return memo[target];
  };
}();

var stylesInDom = [];

function getIndexByIdentifier(identifier) {
  var result = -1;

  for (var i = 0; i < stylesInDom.length; i++) {
    if (stylesInDom[i].identifier === identifier) {
      result = i;
      break;
    }
  }

  return result;
}

function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];

  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var index = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3]
    };

    if (index !== -1) {
      stylesInDom[index].references++;
      stylesInDom[index].updater(obj);
    } else {
      stylesInDom.push({
        identifier: identifier,
        updater: addStyle(obj, options),
        references: 1
      });
    }

    identifiers.push(identifier);
  }

  return identifiers;
}

function insertStyleElement(options) {
  var style = document.createElement('style');
  var attributes = options.attributes || {};

  if (typeof attributes.nonce === 'undefined') {
    var nonce =  true ? __webpack_require__.nc : undefined;

    if (nonce) {
      attributes.nonce = nonce;
    }
  }

  Object.keys(attributes).forEach(function (key) {
    style.setAttribute(key, attributes[key]);
  });

  if (typeof options.insert === 'function') {
    options.insert(style);
  } else {
    var target = getTarget(options.insert || 'head');

    if (!target) {
      throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
    }

    target.appendChild(style);
  }

  return style;
}

function removeStyleElement(style) {
  // istanbul ignore if
  if (style.parentNode === null) {
    return false;
  }

  style.parentNode.removeChild(style);
}
/* istanbul ignore next  */


var replaceText = function replaceText() {
  var textStore = [];
  return function replace(index, replacement) {
    textStore[index] = replacement;
    return textStore.filter(Boolean).join('\n');
  };
}();

function applyToSingletonTag(style, index, remove, obj) {
  var css = remove ? '' : obj.media ? "@media ".concat(obj.media, " {").concat(obj.css, "}") : obj.css; // For old IE

  /* istanbul ignore if  */

  if (style.styleSheet) {
    style.styleSheet.cssText = replaceText(index, css);
  } else {
    var cssNode = document.createTextNode(css);
    var childNodes = style.childNodes;

    if (childNodes[index]) {
      style.removeChild(childNodes[index]);
    }

    if (childNodes.length) {
      style.insertBefore(cssNode, childNodes[index]);
    } else {
      style.appendChild(cssNode);
    }
  }
}

function applyToTag(style, options, obj) {
  var css = obj.css;
  var media = obj.media;
  var sourceMap = obj.sourceMap;

  if (media) {
    style.setAttribute('media', media);
  } else {
    style.removeAttribute('media');
  }

  if (sourceMap && btoa) {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  } // For old IE

  /* istanbul ignore if  */


  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    while (style.firstChild) {
      style.removeChild(style.firstChild);
    }

    style.appendChild(document.createTextNode(css));
  }
}

var singleton = null;
var singletonCounter = 0;

function addStyle(obj, options) {
  var style;
  var update;
  var remove;

  if (options.singleton) {
    var styleIndex = singletonCounter++;
    style = singleton || (singleton = insertStyleElement(options));
    update = applyToSingletonTag.bind(null, style, styleIndex, false);
    remove = applyToSingletonTag.bind(null, style, styleIndex, true);
  } else {
    style = insertStyleElement(options);
    update = applyToTag.bind(null, style, options);

    remove = function remove() {
      removeStyleElement(style);
    };
  }

  update(obj);
  return function updateStyle(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap) {
        return;
      }

      update(obj = newObj);
    } else {
      remove();
    }
  };
}

module.exports = function (list, options) {
  options = options || {}; // Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
  // tags it will allow on a page

  if (!options.singleton && typeof options.singleton !== 'boolean') {
    options.singleton = isOldIE();
  }

  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];

    if (Object.prototype.toString.call(newList) !== '[object Array]') {
      return;
    }

    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDom[index].references--;
    }

    var newLastIdentifiers = modulesToDom(newList, options);

    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];

      var _index = getIndexByIdentifier(_identifier);

      if (stylesInDom[_index].references === 0) {
        stylesInDom[_index].updater();

        stylesInDom.splice(_index, 1);
      }
    }

    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ "./schnelleinsteigLog.js":
/*!*******************************!*\
  !*** ./schnelleinsteigLog.js ***!
  \*******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants.js */ "./constants.js");
/* harmony import */ var _action_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./action.js */ "./action.js");


/* harmony default export */ __webpack_exports__["default"] = ([// setup
_action_js__WEBPACK_IMPORTED_MODULE_1__["default"].initialize({
  players: [{
    id: "Daniel",
    nation: _constants_js__WEBPACK_IMPORTED_MODULE_0__["Nation"].RU
  }, {
    id: "Claudia",
    nation: _constants_js__WEBPACK_IMPORTED_MODULE_0__["Nation"].FR
  }, {
    id: "Bert",
    nation: _constants_js__WEBPACK_IMPORTED_MODULE_0__["Nation"].GB
  }, {
    id: "Anton",
    nation: _constants_js__WEBPACK_IMPORTED_MODULE_0__["Nation"].IT
  }]
}), _action_js__WEBPACK_IMPORTED_MODULE_1__["default"].noop, _action_js__WEBPACK_IMPORTED_MODULE_1__["default"].noop, _action_js__WEBPACK_IMPORTED_MODULE_1__["default"].noop, _action_js__WEBPACK_IMPORTED_MODULE_1__["default"].noop, _action_js__WEBPACK_IMPORTED_MODULE_1__["default"].noop, _action_js__WEBPACK_IMPORTED_MODULE_1__["default"].noop, _action_js__WEBPACK_IMPORTED_MODULE_1__["default"].noop, _action_js__WEBPACK_IMPORTED_MODULE_1__["default"].noop, _action_js__WEBPACK_IMPORTED_MODULE_1__["default"].noop, _action_js__WEBPACK_IMPORTED_MODULE_1__["default"].noop, _action_js__WEBPACK_IMPORTED_MODULE_1__["default"].noop, _action_js__WEBPACK_IMPORTED_MODULE_1__["default"].noop, _action_js__WEBPACK_IMPORTED_MODULE_1__["default"].noop, // first round
_action_js__WEBPACK_IMPORTED_MODULE_1__["default"].rondel({
  nation: _constants_js__WEBPACK_IMPORTED_MODULE_0__["Nation"].AH,
  cost: 0,
  slot: "import"
}), _action_js__WEBPACK_IMPORTED_MODULE_1__["default"]["import"]({
  placements: [{
    province: "trieste",
    type: "fleet"
  }, {
    province: "lemberg",
    type: "army"
  }]
}), _action_js__WEBPACK_IMPORTED_MODULE_1__["default"].noop, _action_js__WEBPACK_IMPORTED_MODULE_1__["default"].rondel({
  nation: _constants_js__WEBPACK_IMPORTED_MODULE_0__["Nation"].IT,
  cost: 0,
  slot: "investor"
}), _action_js__WEBPACK_IMPORTED_MODULE_1__["default"].bondPurchase({
  nation: _constants_js__WEBPACK_IMPORTED_MODULE_0__["Nation"].GE,
  player: "Daniel",
  cost: 4
}), _action_js__WEBPACK_IMPORTED_MODULE_1__["default"].rondel({
  nation: _constants_js__WEBPACK_IMPORTED_MODULE_0__["Nation"].FR,
  cost: 0,
  slot: "factory"
}), _action_js__WEBPACK_IMPORTED_MODULE_1__["default"].buildFactory({
  province: "marseille"
}), _action_js__WEBPACK_IMPORTED_MODULE_1__["default"].rondel({
  nation: _constants_js__WEBPACK_IMPORTED_MODULE_0__["Nation"].GB,
  cost: 0,
  slot: "production1"
}), _action_js__WEBPACK_IMPORTED_MODULE_1__["default"].rondel({
  nation: _constants_js__WEBPACK_IMPORTED_MODULE_0__["Nation"].GE,
  cost: 0,
  slot: "production2"
}), _action_js__WEBPACK_IMPORTED_MODULE_1__["default"].rondel({
  nation: _constants_js__WEBPACK_IMPORTED_MODULE_0__["Nation"].RU,
  cost: 0,
  slot: "investor"
}), _action_js__WEBPACK_IMPORTED_MODULE_1__["default"].bondPurchase({
  nation: _constants_js__WEBPACK_IMPORTED_MODULE_0__["Nation"].GE,
  player: "Anton",
  cost: 6
}), // second round
_action_js__WEBPACK_IMPORTED_MODULE_1__["default"].rondel({
  nation: _constants_js__WEBPACK_IMPORTED_MODULE_0__["Nation"].AH,
  cost: 0,
  slot: "production2"
}), _action_js__WEBPACK_IMPORTED_MODULE_1__["default"].rondel({
  nation: _constants_js__WEBPACK_IMPORTED_MODULE_0__["Nation"].IT,
  cost: 0,
  slot: "production2"
}), _action_js__WEBPACK_IMPORTED_MODULE_1__["default"].rondel({
  nation: _constants_js__WEBPACK_IMPORTED_MODULE_0__["Nation"].FR,
  cost: 0,
  slot: "production1"
}), _action_js__WEBPACK_IMPORTED_MODULE_1__["default"].rondel({
  nation: _constants_js__WEBPACK_IMPORTED_MODULE_0__["Nation"].GB,
  cost: 0,
  slot: "maneuver1"
}), _action_js__WEBPACK_IMPORTED_MODULE_1__["default"].maneuver({
  origin: "liverpool",
  destination: "northatlantic"
}), _action_js__WEBPACK_IMPORTED_MODULE_1__["default"].maneuver({
  origin: "london",
  destination: "englishchannel"
}), _action_js__WEBPACK_IMPORTED_MODULE_1__["default"].rondel({
  nation: _constants_js__WEBPACK_IMPORTED_MODULE_0__["Nation"].GE,
  cost: 0,
  slot: "maneuver2"
}), _action_js__WEBPACK_IMPORTED_MODULE_1__["default"].maneuver({
  origin: "hamburg",
  destination: "northsea"
}), _action_js__WEBPACK_IMPORTED_MODULE_1__["default"].maneuver({
  origin: "berlin",
  destination: "norway"
}), _action_js__WEBPACK_IMPORTED_MODULE_1__["default"].rondel({
  nation: _constants_js__WEBPACK_IMPORTED_MODULE_0__["Nation"].RU,
  cost: 0,
  slot: "import"
}), _action_js__WEBPACK_IMPORTED_MODULE_1__["default"]["import"]({
  placements: [{
    province: "stpetersburg",
    type: "fleet"
  }, {
    province: "moscow",
    type: "army"
  }, {
    province: "moscow",
    type: "army"
  }]
}), _action_js__WEBPACK_IMPORTED_MODULE_1__["default"].noop, _action_js__WEBPACK_IMPORTED_MODULE_1__["default"].noop, // third round
_action_js__WEBPACK_IMPORTED_MODULE_1__["default"].rondel({
  nation: _constants_js__WEBPACK_IMPORTED_MODULE_0__["Nation"].AH,
  cost: 0,
  slot: "maneuver2"
}), _action_js__WEBPACK_IMPORTED_MODULE_1__["default"].maneuver({
  origin: "trieste",
  destination: "ioniansea"
}), _action_js__WEBPACK_IMPORTED_MODULE_1__["default"].maneuver({
  origin: "lemberg",
  destination: "romania"
}), _action_js__WEBPACK_IMPORTED_MODULE_1__["default"].maneuver({
  origin: "budapest",
  destination: "westbalkan"
}), _action_js__WEBPACK_IMPORTED_MODULE_1__["default"].maneuver({
  origin: "vienna",
  destination: "tunis"
}), _action_js__WEBPACK_IMPORTED_MODULE_1__["default"].rondel({
  nation: _constants_js__WEBPACK_IMPORTED_MODULE_0__["Nation"].IT,
  cost: 0,
  slot: "maneuver2"
}), _action_js__WEBPACK_IMPORTED_MODULE_1__["default"].maneuver({
  origin: "naples",
  destination: "westernmediterraneansea"
}), _action_js__WEBPACK_IMPORTED_MODULE_1__["default"].maneuver({
  origin: "rome",
  destination: "spain"
}), _action_js__WEBPACK_IMPORTED_MODULE_1__["default"].rondel({
  nation: _constants_js__WEBPACK_IMPORTED_MODULE_0__["Nation"].FR,
  cost: 0,
  slot: "maneuver1"
}), _action_js__WEBPACK_IMPORTED_MODULE_1__["default"].maneuver({
  origin: "marseille",
  destination: "westernmediterraneansea"
}), _action_js__WEBPACK_IMPORTED_MODULE_1__["default"].fight({
  province: "westernmediterraneansea",
  incumbent: _constants_js__WEBPACK_IMPORTED_MODULE_0__["Nation"].IT,
  challenger: _constants_js__WEBPACK_IMPORTED_MODULE_0__["Nation"].FR
}), _action_js__WEBPACK_IMPORTED_MODULE_1__["default"].maneuver({
  origin: "bordeaux",
  destination: "bayofbiscay"
}), _action_js__WEBPACK_IMPORTED_MODULE_1__["default"].maneuver({
  origin: "paris",
  destination: "morocco"
}), _action_js__WEBPACK_IMPORTED_MODULE_1__["default"].rondel({
  nation: _constants_js__WEBPACK_IMPORTED_MODULE_0__["Nation"].GB,
  cost: 0,
  slot: "investor"
}), _action_js__WEBPACK_IMPORTED_MODULE_1__["default"].bondPurchase({
  nation: _constants_js__WEBPACK_IMPORTED_MODULE_0__["Nation"].RU,
  player: "Bert",
  cost: 6
}), _action_js__WEBPACK_IMPORTED_MODULE_1__["default"].rondel({
  nation: _constants_js__WEBPACK_IMPORTED_MODULE_0__["Nation"].GE,
  cost: 0,
  slot: "taxation"
}), _action_js__WEBPACK_IMPORTED_MODULE_1__["default"].rondel({
  nation: _constants_js__WEBPACK_IMPORTED_MODULE_0__["Nation"].RU,
  cost: 0,
  slot: "production2"
}), // fourth round
_action_js__WEBPACK_IMPORTED_MODULE_1__["default"].rondel({
  nation: _constants_js__WEBPACK_IMPORTED_MODULE_0__["Nation"].AH,
  cost: 0,
  slot: "taxation"
}), _action_js__WEBPACK_IMPORTED_MODULE_1__["default"].rondel({
  nation: _constants_js__WEBPACK_IMPORTED_MODULE_0__["Nation"].IT,
  cost: 0,
  slot: "production1"
}), _action_js__WEBPACK_IMPORTED_MODULE_1__["default"].rondel({
  nation: _constants_js__WEBPACK_IMPORTED_MODULE_0__["Nation"].FR,
  cost: 0,
  slot: "production2"
}), _action_js__WEBPACK_IMPORTED_MODULE_1__["default"].bondPurchase({
  nation: _constants_js__WEBPACK_IMPORTED_MODULE_0__["Nation"].AH,
  player: "Claudia",
  cost: 6
}), _action_js__WEBPACK_IMPORTED_MODULE_1__["default"].rondel({
  nation: _constants_js__WEBPACK_IMPORTED_MODULE_0__["Nation"].GB,
  cost: 0,
  slot: "production2"
}), _action_js__WEBPACK_IMPORTED_MODULE_1__["default"].rondel({
  nation: _constants_js__WEBPACK_IMPORTED_MODULE_0__["Nation"].GE,
  cost: 0,
  slot: "factory"
}), _action_js__WEBPACK_IMPORTED_MODULE_1__["default"].buildFactory({
  province: "cologne"
}), _action_js__WEBPACK_IMPORTED_MODULE_1__["default"].rondel({
  nation: _constants_js__WEBPACK_IMPORTED_MODULE_0__["Nation"].RU,
  cost: 0,
  slot: "maneuver2"
}), _action_js__WEBPACK_IMPORTED_MODULE_1__["default"].maneuver({
  origin: "stpetersburg",
  destination: "balticsea"
}), _action_js__WEBPACK_IMPORTED_MODULE_1__["default"].maneuver({
  origin: "odessa",
  destination: "blacksea"
}), _action_js__WEBPACK_IMPORTED_MODULE_1__["default"].maneuver({
  origin: "moscow",
  destination: "sweden"
}), _action_js__WEBPACK_IMPORTED_MODULE_1__["default"].maneuver({
  origin: "moscow",
  destination: "turkey"
}), _action_js__WEBPACK_IMPORTED_MODULE_1__["default"].maneuver({
  origin: "moscow",
  destination: "lemberg"
})]);

/***/ }),

/***/ "./src/app.js":
/*!********************!*\
  !*** ./src/app.js ***!
  \********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _imperial_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../imperial.js */ "./imperial.js");
/* harmony import */ var _schnelleinsteigLog_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../schnelleinsteigLog.js */ "./schnelleinsteigLog.js");
/* harmony import */ var _rondel_svg__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./rondel.svg */ "./src/rondel.svg");
/* harmony import */ var _rondel_svg__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_rondel_svg__WEBPACK_IMPORTED_MODULE_2__);
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }




Vue.component("player", {
  props: ["name", "cash", "bonds", "current_player"],
  template: "\n  <li class=\"player\">\n    <div v-if=\"name === current_player\" class=\"current_player\">\n      \uD83E\uDD29\n    </div>\n    <div class=\"contents\">\n      <h3>{{ name }}</h3>\n      <div>Cash: {{ cash }} million</div>\n      <div>\n        Bonds:\n        <ul class=\"bonds\">\n          <bond\n            v-for=\"bond in bonds\"\n            v-bind:nation=\"bond.nation.value\"\n            v-bind:cost=\"bond.cost\"\n            v-bind:key=\"bond.nation.value\"\n          ></bond>\n        </ul>\n      </div>\n    </div>\n  </li>\n  "
});
Vue.component("bond", {
  props: ["nation", "cost"],
  template: "<li class=\"bond\">{{ nation }}{{ cost }}</li>"
});
Vue.component("current-turn", {
  props: ["type", "payload"],
  template: "<div>{{ type }}{{ payload }}</div>"
});
Vue.component("action", {
  props: ["action", "dispatch", "text"],
  template: "<button v-on:click=\"dispatch(action)\">{{ text }}</button>"
});
Vue.component("rondel", _rondel_svg__WEBPACK_IMPORTED_MODULE_2___default.a);
/* harmony default export */ __webpack_exports__["default"] = (Vue.component("app", {
  data: function data() {
    return {
      game: {},
      gameStarted: false,
      rondel: ""
    };
  },
  methods: {
    startGame: function startGame() {
      this.game = _imperial_js__WEBPACK_IMPORTED_MODULE_0__["default"].fromLog(_schnelleinsteigLog_js__WEBPACK_IMPORTED_MODULE_1__["default"].slice(0, 2));
      this.gameStarted = true;
    },
    flag: function flag(nation) {
      switch (nation) {
        case "AH":
          return "flags/ah.svg";

        case "IT":
          return "flags/it.svg";

        case "FR":
          return "flags/fr.svg";

        case "GB":
          return "flags/gb.svg";

        case "GE":
          return "flags/ge.svg";

        case "RU":
          return "flags/ru.svg";
      }
    },
    tickWithAction: function tickWithAction(action) {
      this.game.tick(action);
      this.updateRondel();
    },
    actionToText: function actionToText(action) {
      if (action.type === "rondel") {
        return action.payload.slot;
      } else if (action.type === "import") {
        return "Import ".concat(action.payload.unit, " in ").concat(action.payload.province);
      } else if (action.type === "buildFactory") {
        return "Build factory in ".concat(action.payload.province);
      }
    },
    updateRondel: function updateRondel() {
      var _iterator = _createForOfIteratorHelper(this.game.nations),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var _step$value = _slicedToArray(_step.value, 2),
              nation = _step$value[0],
              rondelPosition = _step$value[1].rondelPosition;

          if (rondelPosition === null) continue;
          var el = document.getElementById(rondelPosition);
          var bBox = el.getBBox();
          var flag = document.createElementNS("http://www.w3.org/2000/svg", "image");
          flag.setAttribute("height", "20"); // This is a really rough way to get the center of the SVG path

          var step = el.getTotalLength() / 100;
          var totalX = 0;
          var totalY = 0;

          for (var dist = 0; dist < el.getTotalLength(); dist += step) {
            var pt = el.getPointAtLength(dist);
            totalX += pt.x;
            totalY += pt.y;
          }

          flag.setAttribute("x", totalX / 100);
          flag.setAttribute("y", totalY / 100);
          flag.setAttribute("href", this.flag(nation.value));
          el.parentNode.append(flag);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
  },
  template: "\n  <div v-if=\"gameStarted\">\n    <ul class=\"players\">\n      <player\n        v-for=\"player in game.players\"\n        v-bind:name=\"player.name\"\n        v-bind:cash=\"player.cash\"\n        v-bind:bonds=\"player.bonds\"\n        v-bind:current_player=\"game.currentPlayerName\"\n        v-bind:key=\"player.name\"\n      ></player>\n    </ul>\n    <div class=\"rondel\">\n      <rondel />\n    </div>\n    <current-turn\n      v-bind:type=\"game.log[game.log.length - 1].type\"\n      v-bind:payload=\"game.log[game.log.length - 1].payload\"\n    ></current-turn>\n    <div>\n      It is {{ game.currentNation.value }}'s turn\n    </div>\n    <div class=\"buttons\">\n      <action\n        v-for=\"action in game.availableActions\"\n        v-bind:key=\"JSON.stringify(action)\"\n        v-bind:action=\"action\"\n        v-bind:text=\"actionToText(action)\"\n        v-bind:dispatch=\"tickWithAction\"\n      ></action>\n    </div>\n  </div>\n  <div v-else class=\"buttons\">\n    <button v-on:click=\"startGame\">\n      Start Game\n    </button>\n  </div>\n"
}));

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./app */ "./src/app.js");
/* harmony import */ var _style_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./style.css */ "./src/style.css");
/* harmony import */ var _style_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_style_css__WEBPACK_IMPORTED_MODULE_1__);


new Vue({
  el: "#app",
  render: function render(h) {
    return h(_app__WEBPACK_IMPORTED_MODULE_0__["default"]);
  }
});

/***/ }),

/***/ "./src/rondel.svg":
/*!************************!*\
  !*** ./src/rondel.svg ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {
  functional: true,

  render(_h, _vm) {
    const {
      _c,
      _v,
      data,
      children = []
    } = _vm;
    const {
      class: classNames,
      staticClass,
      style,
      staticStyle,
      attrs = {},
      ...rest
    } = data;
    return _c('svg', {
      class: [classNames, staticClass],
      style: [style, staticStyle],
      attrs: Object.assign({
        "width": "470",
        "height": "456",
        "xmlns": "http://www.w3.org/2000/svg"
      }, attrs),
      ...rest
    }, children.concat([_c('g', {
      attrs: {
        "fill": "none",
        "fill-rule": "evenodd"
      }
    }, [_c('text', {
      attrs: {
        "transform": "rotate(25 3968.779 188.668)",
        "font-family": "Baskerville",
        "font-size": "24",
        "letter-spacing": ".617",
        "fill": "#000"
      }
    }, [_c('tspan', {
      attrs: {
        "x": "562.98",
        "y": "1585.124"
      }
    }, [_v('Taxation')])]), _c('text', {
      attrs: {
        "transform": "rotate(70 1692.295 721.896)",
        "font-family": "Baskerville",
        "font-size": "24",
        "letter-spacing": ".617",
        "fill": "#000"
      }
    }, [_c('tspan', {
      attrs: {
        "x": "682.98",
        "y": "1699.124"
      }
    }, [_v('Factory')])]), _c('text', {
      attrs: {
        "transform": "rotate(-70 -527.335 1284.352)",
        "font-family": "Baskerville",
        "font-size": "24",
        "letter-spacing": ".617",
        "fill": "#000"
      }
    }, [_c('tspan', {
      attrs: {
        "x": "658.98",
        "y": "1873.124"
      }
    }, [_v('Production')])]), _c('text', {
      attrs: {
        "transform": "rotate(-70 -944.335 1114.352)",
        "font-family": "Baskerville",
        "font-size": "24",
        "letter-spacing": ".617",
        "fill": "#000"
      }
    }, [_c('tspan', {
      attrs: {
        "x": "241.98",
        "y": "1703.124"
      }
    }, [_v('Production')])]), _c('text', {
      attrs: {
        "transform": "rotate(-30 -2420.36 1705.683)",
        "font-family": "Baskerville",
        "font-size": "24",
        "letter-spacing": ".617",
        "fill": "#000"
      }
    }, [_c('tspan', {
      attrs: {
        "x": "555.98",
        "y": "1981.124"
      }
    }, [_v('Maneuver')])]), _c('text', {
      attrs: {
        "transform": "rotate(-30 -2612.36 1310.683)",
        "font-family": "Baskerville",
        "font-size": "24",
        "letter-spacing": ".617",
        "fill": "#000"
      }
    }, [_c('tspan', {
      attrs: {
        "x": "363.98",
        "y": "1586.124"
      }
    }, [_v('Maneuver')])]), _c('text', {
      attrs: {
        "transform": "rotate(30 3171.82 690.565)",
        "font-family": "Baskerville",
        "font-size": "24",
        "letter-spacing": ".617",
        "fill": "#000"
      }
    }, [_c('tspan', {
      attrs: {
        "x": "373.98",
        "y": "1981.124"
      }
    }, [_v('Investor')])]), _c('text', {
      attrs: {
        "transform": "rotate(70 1277.795 890.896)",
        "font-family": "Baskerville",
        "font-size": "24",
        "letter-spacing": ".617",
        "fill": "#000"
      }
    }, [_c('tspan', {
      attrs: {
        "x": "270.98",
        "y": "1868.124"
      }
    }, [_v('Import')])]), _c('g', {
      attrs: {
        "transform": "translate(41 27)",
        "stroke": "#000"
      }
    }, [_c('path', {
      attrs: {
        "d": "M200 200L58.586 341.414A200 200 0 010 200h200z",
        "fill": "#F39D81",
        "fill-rule": "nonzero"
      }
    }), _c('path', {
      attrs: {
        "d": "M200 200H0A200 200 0 0158.586 58.586L200 200z",
        "fill": "#8C8798",
        "fill-rule": "nonzero"
      }
    }), _c('path', {
      attrs: {
        "d": "M200 200L58.586 58.586A200 200 0 01200 0v200z",
        "fill": "#7EA850",
        "fill-rule": "nonzero"
      }
    }), _c('path', {
      attrs: {
        "d": "M200 200V0a200 200 0 01141.414 58.586L200 200z",
        "fill": "#FFD281",
        "fill-rule": "nonzero"
      }
    }), _c('path', {
      attrs: {
        "d": "M200 200L341.414 58.586A200 200 0 01400 200H200z",
        "fill": "#8DBCFB",
        "fill-rule": "nonzero"
      }
    }), _c('path', {
      attrs: {
        "d": "M200 200h200a200 200 0 01-58.586 141.414L200 200z",
        "fill": "#8C8798",
        "fill-rule": "nonzero"
      }
    }), _c('path', {
      attrs: {
        "d": "M200 200l141.414 141.414A200 200 0 01200 400V200z",
        "fill": "#7EA850",
        "fill-rule": "nonzero"
      }
    }), _c('path', {
      attrs: {
        "d": "M200 200v200a200 200 0 01-141.414-58.586L200 200z",
        "fill": "#8EDFFF",
        "fill-rule": "nonzero"
      }
    }), _c('circle', {
      attrs: {
        "fill": "#FFF",
        "cx": "199.5",
        "cy": "200.5",
        "r": "37"
      }
    })])])]));
  }

};

/***/ }),

/***/ "./src/style.css":
/*!***********************!*\
  !*** ./src/style.css ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var api = __webpack_require__(/*! ../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
            var content = __webpack_require__(/*! !../node_modules/css-loader/dist/cjs.js!./style.css */ "./node_modules/css-loader/dist/cjs.js!./src/style.css");

            content = content.__esModule ? content.default : content;

            if (typeof content === 'string') {
              content = [[module.i, content, '']];
            }

var options = {};

options.insert = "head";
options.singleton = false;

var update = api(content, options);



module.exports = content.locals || {};

/***/ }),

/***/ "./standardSetup.js":
/*!**************************!*\
  !*** ./standardSetup.js ***!
  \**************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants.js */ "./constants.js");
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }



var error = function error(want) {
  return function (x) {
    throw new Error("got=".concat(x.value, ", want=").concat(want));
  };
};

/* harmony default export */ __webpack_exports__["default"] = (function (_ref) {
  var players = _ref.players,
      provinceNames = _ref.provinceNames;
  var nationAssignments = {
    2: function _(_ref2) {
      var id = _ref2.id,
          nation = _ref2.nation;
      return nation.when({
        AH: function AH() {
          return [{
            id: id,
            nation: _constants_js__WEBPACK_IMPORTED_MODULE_0__["Nation"].AH
          }, {
            id: id,
            nation: _constants_js__WEBPACK_IMPORTED_MODULE_0__["Nation"].FR
          }, {
            id: id,
            nation: _constants_js__WEBPACK_IMPORTED_MODULE_0__["Nation"].GE
          }];
        },
        IT: function IT() {
          return [{
            id: id,
            nation: _constants_js__WEBPACK_IMPORTED_MODULE_0__["Nation"].IT
          }, {
            id: id,
            nation: _constants_js__WEBPACK_IMPORTED_MODULE_0__["Nation"].RU
          }, {
            id: id,
            nation: _constants_js__WEBPACK_IMPORTED_MODULE_0__["Nation"].GB
          }];
        },
        FR: error("AH|IT"),
        GB: error("AH|IT"),
        RU: error("AH|IT"),
        GE: error("AH|IT")
      });
    },
    3: function _(_ref3) {
      var id = _ref3.id,
          nation = _ref3.nation;
      return nation.when({
        AH: function AH() {
          return [{
            id: id,
            nation: _constants_js__WEBPACK_IMPORTED_MODULE_0__["Nation"].AH
          }, {
            id: id,
            nation: _constants_js__WEBPACK_IMPORTED_MODULE_0__["Nation"].GB
          }];
        },
        IT: function IT() {
          return [{
            id: id,
            nation: _constants_js__WEBPACK_IMPORTED_MODULE_0__["Nation"].IT
          }, {
            id: id,
            nation: _constants_js__WEBPACK_IMPORTED_MODULE_0__["Nation"].RU
          }];
        },
        FR: function FR() {
          return [{
            id: id,
            nation: _constants_js__WEBPACK_IMPORTED_MODULE_0__["Nation"].FR
          }, {
            id: id,
            nation: _constants_js__WEBPACK_IMPORTED_MODULE_0__["Nation"].GE
          }];
        },
        GB: error("AH|IT|FR"),
        RU: error("AH|IT|FR"),
        GE: error("AH|IT|FR")
      });
    },
    4: function _(x) {
      return [x];
    },
    5: function _(x) {
      return [x];
    },
    6: function _(x) {
      return [x];
    }
  };
  var out = {
    availableBonds: Object(_constants_js__WEBPACK_IMPORTED_MODULE_0__["AllBonds"])(),
    nations: new Map(),
    order: players.map(function (p) {
      return p.id;
    }),
    players: {}
  };
  /* From the initial nation assignments, distribute bonds to the players. */

  players.map(nationAssignments[players.length]).flat().forEach(function (_ref4) {
    var id = _ref4.id,
        nation = _ref4.nation;

    if (out.players[id] === undefined) {
      out.players[id] = {
        name: id,
        cash: 2,
        bonds: new Set()
      };
    }

    var smallerBondNation = nation.when({
      GE: function GE() {
        return _constants_js__WEBPACK_IMPORTED_MODULE_0__["Nation"].IT;
      },
      RU: function RU() {
        return _constants_js__WEBPACK_IMPORTED_MODULE_0__["Nation"].FR;
      },
      AH: function AH() {
        return _constants_js__WEBPACK_IMPORTED_MODULE_0__["Nation"].GE;
      },
      IT: function IT() {
        return _constants_js__WEBPACK_IMPORTED_MODULE_0__["Nation"].GB;
      },
      FR: function FR() {
        return _constants_js__WEBPACK_IMPORTED_MODULE_0__["Nation"].AH;
      },
      GB: function GB() {
        return _constants_js__WEBPACK_IMPORTED_MODULE_0__["Nation"].RU;
      }
    });
    out.availableBonds["delete"](Object(_constants_js__WEBPACK_IMPORTED_MODULE_0__["Bond"])(nation, 4));
    out.availableBonds["delete"](Object(_constants_js__WEBPACK_IMPORTED_MODULE_0__["Bond"])(smallerBondNation, 1));
    out.players[id].bonds.add(Object(_constants_js__WEBPACK_IMPORTED_MODULE_0__["Bond"])(nation, 4));
    out.players[id].bonds.add(Object(_constants_js__WEBPACK_IMPORTED_MODULE_0__["Bond"])(smallerBondNation, 1));
  });
  /* Gather bonds as a list of
   *
   *   { nation : Nation , cost : number , number : number }
   *
   * so we can filter by nation, use the cost in our
   * calculation of each nation's treasury, and set the
   * controlling player.
   */

  var purchasedBonds = new Set();
  Object.keys(out.players).forEach(function (id) {
    var _iterator = _createForOfIteratorHelper(out.players[id].bonds),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var bond = _step.value;
        purchasedBonds.add(bond);
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  });
  /* Calculate treasury and controller for each nation */

  var _iterator2 = _createForOfIteratorHelper(_constants_js__WEBPACK_IMPORTED_MODULE_0__["Nation"]),
      _step2;

  try {
    var _loop = function _loop() {
      var n = _step2.value;

      /* Find bonds for the given nation, sorted by descending cost */
      var forNation = _toConsumableArray(purchasedBonds).filter(function (b) {
        return b.nation === n;
      }).sort(function (_ref5, _ref6) {
        var aCost = _ref5.cost;
        var bCost = _ref6.cost;
        return aCost < bCost ? 1 : aCost > bCost ? -1 : 0;
      });
      /* The rules describe in prose this decision table
       *
       *   bonds purchased | controller
       *   ----------------|-----------
       *   none            | none
       *   2               | owner of 2
       *   9               | owner of 9
       *   9, 2            | owner of 9
       *
       * So, we'll set the controller to be the owner of
       * the highest cost bond, or null if there are no
       * bonds.
       */


      var highestBond = forNation[0];
      var highestBondOwner = Object.keys(out.players).find(function (id) {
        return out.players[id].bonds.has(highestBond);
      }) || null;
      var totalCost = forNation.reduce(function (sum, _ref7) {
        var cost = _ref7.cost;
        return sum + cost;
      }, 0);
      out.nations.set(n, {
        controller: highestBondOwner,
        treasury: totalCost,
        rondelPosition: null,
        flagCount: 0,
        powerPoints: 0,
        taxChartPosition: 5
      });
      var AHPlayer = out.nations.get(_constants_js__WEBPACK_IMPORTED_MODULE_0__["Nation"].AH).controller;
      var AHPlayerIndex = out.order.indexOf(AHPlayer);

      if (AHPlayerIndex === 0) {
        out.investorCardHolder = out.order[out.order.length - 1];
      } else {
        out.investorCardHolder = out.order[AHPlayerIndex - 1];
      }
    };

    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      _loop();
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }

  var emptyProvinces = function emptyProvinces() {
    var provinces = new Map();

    var _iterator3 = _createForOfIteratorHelper(provinceNames),
        _step3;

    try {
      for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
        var province = _step3.value;
        provinces.set(province, {
          armies: 0,
          fleets: 0
        });
      }
    } catch (err) {
      _iterator3.e(err);
    } finally {
      _iterator3.f();
    }

    return provinces;
  };

  var units = new Map();
  [_constants_js__WEBPACK_IMPORTED_MODULE_0__["Nation"].AH, _constants_js__WEBPACK_IMPORTED_MODULE_0__["Nation"].IT, _constants_js__WEBPACK_IMPORTED_MODULE_0__["Nation"].FR, _constants_js__WEBPACK_IMPORTED_MODULE_0__["Nation"].GB, _constants_js__WEBPACK_IMPORTED_MODULE_0__["Nation"].GE, _constants_js__WEBPACK_IMPORTED_MODULE_0__["Nation"].RU].map(function (nation) {
    units.set(nation, emptyProvinces());
  });
  out.units = units;
  var provinces = new Map();
  var armaments = ["vienna", "budapest", "paris", "berlin", "rome", "moscow"];
  var shipyard = ["bordeaux", "london", "liverpool", "hamburg", "naples", "odessa"];

  var _iterator4 = _createForOfIteratorHelper(provinceNames),
      _step4;

  try {
    for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
      var province = _step4.value;
      var factory = null;

      if (armaments.includes(province)) {
        factory = "armaments";
      } else if (shipyard.includes(province)) {
        factory = "shipyard";
      }

      provinces.set(province, {
        factory: factory
      });
    }
  } catch (err) {
    _iterator4.e(err);
  } finally {
    _iterator4.f();
  }

  out.provinces = provinces;
  out.currentNation = _constants_js__WEBPACK_IMPORTED_MODULE_0__["Nation"].AH;
  return out;
});

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vYWN0aW9uLmpzIiwid2VicGFjazovLy8uL2JvYXJkLmpzIiwid2VicGFjazovLy8uL2NvbnN0YW50cy5qcyIsIndlYnBhY2s6Ly8vLi9lbnVtLmpzIiwid2VicGFjazovLy8uL2dhbWVCb2FyZC5qcyIsIndlYnBhY2s6Ly8vLi9pbXBlcmlhbC5qcyIsIndlYnBhY2s6Ly8vLi9tZW1vLmpzIiwid2VicGFjazovLy8uL3NyYy9zdHlsZS5jc3MiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanMiLCJ3ZWJwYWNrOi8vLy4vc2NobmVsbGVpbnN0ZWlnTG9nLmpzIiwid2VicGFjazovLy8uL3NyYy9hcHAuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9yb25kZWwuc3ZnIiwid2VicGFjazovLy8uL3NyYy9zdHlsZS5jc3M/NzE2MyIsIndlYnBhY2s6Ly8vLi9zdGFuZGFyZFNldHVwLmpzIl0sIm5hbWVzIjpbIm1lbWJlcnNoaXAiLCJhIiwiYiIsImxlZnQiLCJTZXQiLCJib3RoIiwicmlnaHQiLCJlIiwiaGFzIiwiYWRkIiwibWFrZUFjdGlvbiIsInR5cGUiLCJwYXlsb2FkS2V5cyIsImV4cGVjdGVkIiwibWVtb2l6ZSIsInBheWxvYWQiLCJPYmplY3QiLCJrZXlzIiwibCIsInIiLCJzaXplIiwiRXJyb3IiLCJKU09OIiwic3RyaW5naWZ5IiwidW5leHBlY3RlZCIsIm9rIiwibm9vcCIsImZyZWV6ZSIsImluaXRpYWxpemUiLCJib25kUHVyY2hhc2UiLCJidWlsZEZhY3RvcnkiLCJjb2V4aXN0IiwiZW5kTWFuZXV2ZXIiLCJmaWdodCIsIm1hbmV1dmVyIiwicHJvZHVjdGlvbiIsInJvbmRlbCIsIm5vZGVzIiwiaXNPY2VhbiIsIm5hbWUiLCJuYXRpb24iLCJOYXRpb24iLCJSVSIsImZhY3RvcnlUeXBlIiwiaXNIb21lIiwiR0UiLCJHQiIsIkZSIiwiSVQiLCJBSCIsImVkZ2VzIiwiR2FtZUJvYXJkIiwiRW51bSIsImZyb21BcnJheSIsImNvc3QiLCJCb25kIiwibnVtYmVyIiwiQWxsQm9uZHMiLCJtYXAiLCJwYXJzZUludCIsImZsYXQiLCJjbGVhbnJvb20iLCJjcmVhdGUiLCJ2YWx1ZSIsIm1lbWJlcnMiLCJsYWJlbCIsImRlZmluZVByb3BlcnRpZXMiLCJlbnVtZXJhYmxlIiwiY2FzZXMiLCJtZW1iZXIiLCJoYXNPd25Qcm9wZXJ0eSIsImdldE93blByb3BlcnR5TmFtZXMiLCJjIiwiaXMiLCJTeW1ib2wiLCJ0b1N0cmluZ1RhZyIsImFyeSIsInN0b3JlIiwiTWFwIiwidW5kZWZpbmVkIiwiZm9yRWFjaCIsImVsZW1lbnQiLCJzZXQiLCJQcm94eSIsImdldCIsIl90YXJnZXQiLCJwcm9wZXJ0eSIsIl9yZWNlaXZlciIsIml0ZXJhdG9yIiwidmFsdWVzIiwiYmluZCIsIkFycmF5IiwiZnJvbSIsImpvaW4iLCJSZWZsZWN0IiwiU3RyaW5nIiwiZ3JhcGgiLCJieU5hdGlvbiIsInNldHVwR3JhcGgiLCJzZXRJbW1lZGlhdGVOZWlnaGJvcnMiLCJwcm92aW5jZSIsIm5laWdoYm9ycyIsIm9yaWdpbiIsImlzRmxlZXQiLCJmcmllbmRseUZsZWV0cyIsInZhbGlkYXRlIiwib3V0IiwibiIsIngiLCJuZWlnaGJvciIsIkltcGVyaWFsIiwibG9nIiwiZ2FtZSIsImVudHJ5IiwidGljayIsImJvYXJkIiwic3RhbmRhcmRHYW1lQm9hcmQiLCJhY3Rpb24iLCJwdXNoIiwicyIsInNldHVwIiwicGxheWVycyIsInByb3ZpbmNlTmFtZXMiLCJhdmFpbGFibGVCb25kcyIsImN1cnJlbnROYXRpb24iLCJpbnZlc3RvckNhcmRIb2xkZXIiLCJuYXRpb25zIiwib3JkZXIiLCJwcm92aW5jZXMiLCJ1bml0cyIsImN1cnJlbnRQbGF5ZXJOYW1lIiwiY29udHJvbGxlciIsImF2YWlsYWJsZUFjdGlvbnMiLCJyb25kZWxBY3Rpb25zIiwicHVyY2hhc2VCb25kIiwiaGFuZGxlQWR2YW5jZVBsYXllciIsIm5leHROYXRpb24iLCJmbGVldHMiLCJmbGFnIiwiaW5jdW1iZW50IiwicHJldmlvdXNSb25kZWxQb3NpdGlvbiIsImVuZE9mSW52ZXN0b3JUdXJuIiwicGxhY2VtZW50cyIsImFybWllcyIsInRyZWFzdXJ5IiwicG90ZW50aWFsUHJlSW52ZXN0b3JTbG90cyIsImluY2x1ZGVzIiwiZGVzdGluYXRpb24iLCJ1bml0VHlwZSIsImZsYWdDb3VudCIsInVuaXRzVG9Nb3ZlIiwiZmlsdGVyIiwiXyIsImkiLCJmaW5kSW5kZXgiLCJhcnIiLCJzcGxpY2UiLCJBY3Rpb24iLCJjaGFsbGVuZ2VyIiwibGVuZ3RoIiwicHJvdmluY2VzV2l0aEZsZWV0cyIsInByb3ZpbmNlc1dpdGhBcm1pZXMiLCJjb3VudCIsIm5laWdoYm9yc0ZvciIsInJvbmRlbFBvc2l0aW9uIiwic2xvdCIsImNhc2giLCJwbGF5ZXIiLCJwbGF5ZXJCb25kc09mTmF0aW9uIiwiYm9uZCIsImFtb3VudE93ZWRUb0NvbnRyb2xsZXIiLCJib25kcyIsInJlZHVjZSIsInkiLCJob21lUHJvdmluY2VzIiwicHJvdmluY2UyIiwicHJvdmluY2UzIiwiZmFjdG9yeSIsIm5hdGlvbk5hbWUiLCJ0YXhlcyIsImZhY3RvcnlDb3VudCIsInVuaXRDb3VudCIsInRheENoYXJ0UG9zaXRpb24iLCJwb3dlclBvaW50cyIsImRlc3RpbmF0aW9ucyIsImZsZWV0Q291bnQiLCJhcm15Q291bnQiLCJidWlsZEZhY3RvcnlBY3Rpb24iLCJleGNoYW5nZWFibGVCb25kQ29zdHMiLCJleGNoYW5nZWFibGVCb25kIiwidG9wQm9uZENvc3QiLCJNYXRoIiwibWF4IiwidW5jb3N0IiwidHJhZGVJbiIsImJvbmRUb1RyYWRlIiwibmV0Q29zdCIsIm5ld0JvbmQiLCJ0b3RhbEludmVzdG1lbnRJbk5hdGlvbiIsImFkdmFuY2VJbnZlc3RvckNhcmQiLCJpbmRleCIsImluZGV4T2YiLCJyb25kZWxQb3NpdGlvbnMiLCJjdXJyZW50UG9zaXRpb24iLCJjdXJyZW50SW5kZXgiLCJkaXN0YW5jZSIsImxhc3RUdXJuTmF0aW9uIiwid2hlbiIsInVuaXQiLCJOT19WQUxVRSIsIlNFVF9TVEFSVCIsIkFSWV9TVEFSVCIsIk1BUF9TVEFSVCIsIk9CSl9TVEFSVCIsIklURVJfRU5EIiwiVHJpZSIsImNoaWxkcmVuIiwicGF0aCIsImZuIiwiYXJncyIsImhlYWQiLCJ0YWlsIiwiZ2V0T3JJbnNlcnQiLCJlbnRyaWVzIiwic29ydCIsIm1lbW9yeSIsImlkIiwiVnVlIiwiY29tcG9uZW50IiwicHJvcHMiLCJ0ZW1wbGF0ZSIsIlJvbmRlbCIsImRhdGEiLCJnYW1lU3RhcnRlZCIsIm1ldGhvZHMiLCJzdGFydEdhbWUiLCJmcm9tTG9nIiwic2xpY2UiLCJ0aWNrV2l0aEFjdGlvbiIsInVwZGF0ZVJvbmRlbCIsImFjdGlvblRvVGV4dCIsImVsIiwiZG9jdW1lbnQiLCJnZXRFbGVtZW50QnlJZCIsImJCb3giLCJnZXRCQm94IiwiY3JlYXRlRWxlbWVudE5TIiwic2V0QXR0cmlidXRlIiwic3RlcCIsImdldFRvdGFsTGVuZ3RoIiwidG90YWxYIiwidG90YWxZIiwiZGlzdCIsInB0IiwiZ2V0UG9pbnRBdExlbmd0aCIsInBhcmVudE5vZGUiLCJhcHBlbmQiLCJyZW5kZXIiLCJoIiwiQXBwIiwibW9kdWxlIiwiZXhwb3J0cyIsImZ1bmN0aW9uYWwiLCJfaCIsIl92bSIsIl9jIiwiX3YiLCJjbGFzcyIsImNsYXNzTmFtZXMiLCJzdGF0aWNDbGFzcyIsInN0eWxlIiwic3RhdGljU3R5bGUiLCJhdHRycyIsInJlc3QiLCJhc3NpZ24iLCJjb25jYXQiLCJlcnJvciIsIndhbnQiLCJuYXRpb25Bc3NpZ25tZW50cyIsInAiLCJzbWFsbGVyQm9uZE5hdGlvbiIsInB1cmNoYXNlZEJvbmRzIiwiZm9yTmF0aW9uIiwiYUNvc3QiLCJiQ29zdCIsImhpZ2hlc3RCb25kIiwiaGlnaGVzdEJvbmRPd25lciIsImZpbmQiLCJ0b3RhbENvc3QiLCJzdW0iLCJBSFBsYXllciIsIkFIUGxheWVySW5kZXgiLCJlbXB0eVByb3ZpbmNlcyIsImFybWFtZW50cyIsInNoaXB5YXJkIl0sIm1hcHBpbmdzIjoiO1FBQUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7OztRQUdBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwwQ0FBMEMsZ0NBQWdDO1FBQzFFO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0Esd0RBQXdELGtCQUFrQjtRQUMxRTtRQUNBLGlEQUFpRCxjQUFjO1FBQy9EOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSx5Q0FBeUMsaUNBQWlDO1FBQzFFLGdIQUFnSCxtQkFBbUIsRUFBRTtRQUNySTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDJCQUEyQiwwQkFBMEIsRUFBRTtRQUN2RCxpQ0FBaUMsZUFBZTtRQUNoRDtRQUNBO1FBQ0E7O1FBRUE7UUFDQSxzREFBc0QsK0RBQStEOztRQUVySDtRQUNBOzs7UUFHQTtRQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0NDaEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0EsSUFBTUEsVUFBVSxHQUFHLFNBQWJBLFVBQWEsQ0FBQ0MsQ0FBRCxFQUFJQyxDQUFKLEVBQVU7QUFDM0IsTUFBTUMsSUFBSSxHQUFHLElBQUlDLEdBQUosRUFBYjtBQUNBLE1BQU1DLElBQUksR0FBRyxJQUFJRCxHQUFKLEVBQWI7QUFDQSxNQUFNRSxLQUFLLEdBQUcsSUFBSUYsR0FBSixFQUFkOztBQUgyQiw2Q0FJWEgs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OztBQWlMN0N2RSxLQUFHLENBQUNzQixTQUFKLEdBQWdCQSxTQUFoQjtBQUNBdEIsS0FBRyxDQUFDa0IsYUFBSixHQUFvQm5GLG9EQUFNLENBQUNRLEVBQTNCO0FBRUEsU0FBT3lELEdBQVA7QUFDRCxDQXJMRCxFIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy9pbmRleC5qc1wiKTtcbiIsImltcG9ydCB7IG1lbW9pemUgfSBmcm9tIFwiLi9tZW1vLmpzXCI7XG5cbi8vIEdpdmVuIHR3byBzZXRzLCBBIGFuZCBCLCBtZW1iZXJzaGlwIGNhbGN1bGF0ZXMgYSAzLXR1cGxlIGNvbnRhaW5pbmc6XG4vLyBbQSAtIEIsIEEgJiBCLCBCIC0gQV1cbi8vXG4vLyBBIGFuZCBCIGFyZSBlcXVhbCBpZiBBIC0gQiBhbmQgQiAtIEEgYXJlIGJvdGggZW1wdHkuXG4vLyBBIGFuZCBCIGFyZSBkaXNqb2ludCBpZiBBICYgQiBpcyBlbXB0eS5cbmNvbnN0IG1lbWJlcnNoaXAgPSAoYSwgYikgPT4ge1xuICBjb25zdCBsZWZ0ID0gbmV3IFNldCgpO1xuICBjb25zdCBib3RoID0gbmV3IFNldCgpO1xuICBjb25zdCByaWdodCA9IG5ldyBTZXQoKTtcbiAgZm9yIChjb25zdCBlIG9mIGEpIHtcbiAgICBpZiAoYi5oYXMoZSkpIHtcbiAgICAgIGJvdGguYWRkKGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBsZWZ0LmFkZChlKTtcbiAgICB9XG4gIH1cbiAgZm9yIChjb25zdCBlIG9mIGIpIHtcbiAgICBpZiAoYS5oYXMoZSkpIHtcbiAgICAgIGJvdGguYWRkKGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICByaWdodC5hZGQoZSk7XG4gICAgfVxuICB9XG4gIHJldHVybiBbbGVmdCwgYm90aCwgcmlnaHRdO1xufTtcblxuY29uc3QgbWFrZUFjdGlvbiA9ICh0eXBlLCBwYXlsb2FkS2V5cykgPT4ge1xuICBjb25zdCBleHBlY3RlZCA9IG5ldyBTZXQocGF5bG9hZEtleXMpO1xuICByZXR1cm4gbWVtb2l6ZSgocGF5bG9hZCkgPT4ge1xuICAgIC8vIGxpZ2h0bHkgdmFsaWRhdGUgdGhlIHBheWxvYWQga2V5c1xuICAgIGNvbnN0IFtsLCBiLCByXSA9IG1lbWJlcnNoaXAoZXhwZWN0ZWQsIG5ldyBTZXQoT2JqZWN0LmtleXMocGF5bG9hZCB8fCB7fSkpKTtcbiAgICBpZiAobC5zaXplID4gMCB8fCByLnNpemUgPiAwKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICBleHBlY3RlZDogWy4uLmxdLFxuICAgICAgICAgIHVuZXhwZWN0ZWQ6IFsuLi5yXSxcbiAgICAgICAgICBvazogWy4uLmJdLFxuICAgICAgICAgIHR5cGU6IHR5cGUsXG4gICAgICAgIH0pXG4gICAgICApO1xuICAgIH1cbiAgICByZXR1cm4geyB0eXBlLCBwYXlsb2FkIH07XG4gIH0pO1xufTtcblxuY29uc3Qgbm9vcCA9IE9iamVjdC5mcmVlemUoeyB0eXBlOiBcIm5vb3BcIiB9KTtcblxuZXhwb3J0IGRlZmF1bHQge1xuICBub29wLFxuICBpbml0aWFsaXplOiBtYWtlQWN0aW9uKFwiaW5pdGlhbGl6ZVwiLCBbXCJwbGF5ZXJzXCJdKSxcbiAgYm9uZFB1cmNoYXNlOiBtYWtlQWN0aW9uKFwiYm9uZFB1cmNoYXNlXCIsIFtcIm5hdGlvblwiLCBcInBsYXllclwiLCBcImNvc3RcIl0pLFxuICBidWlsZEZhY3Rvcnk6IG1ha2VBY3Rpb24oXCJidWlsZEZhY3RvcnlcIiwgW1wicHJvdmluY2VcIl0pLFxuICBjb2V4aXN0OiBtYWtlQWN0aW9uKFwiY29leGlzdFwiLCBbXCJwcm92aW5jZVwiLCBcImluY3VtYmVudFwiLCBcImNoYWxsZW5nZXJcIl0pLFxuICBlbmRNYW5ldXZlcjogbWFrZUFjdGlvbihcImVuZE1hbmV1dmVyXCIsIFtdKSxcbiAgZmlnaHQ6IG1ha2VBY3Rpb24oXCJmaWdodFwiLCBbXCJwcm92aW5jZVwiLCBcImluY3VtYmVudFwiLCBcImNoYWxsZW5nZXJcIl0pLFxuICBpbXBvcnQ6IG1ha2VBY3Rpb24oXCJpbXBvcnRcIiwgW1wicGxhY2VtZW50c1wiXSksIC8vIHBsYWNlbWVudCA6IHsgcHJvdmluY2U6IHN0cmluZywgdHlwZTogXCJhcm15XCJ8XCJmbGVldFwiIH1cbiAgbWFuZXV2ZXI6IG1ha2VBY3Rpb24oXCJtYW5ldXZlclwiLCBbXCJvcmlnaW5cIiwgXCJkZXN0aW5hdGlvblwiXSksXG4gIHByb2R1Y3Rpb246IG1ha2VBY3Rpb24oXCJwcm9kdWN0aW9uXCIsIFtcInByb3ZpbmNlXCJdKSxcbiAgcm9uZGVsOiBtYWtlQWN0aW9uKFwicm9uZGVsXCIsIFtcIm5hdGlvblwiLCBcImNvc3RcIiwgXCJzbG90XCJdKSxcbn07XG4iLCJpbXBvcnQgeyBOYXRpb24gfSBmcm9tIFwiLi9jb25zdGFudHMuanNcIjtcbi8vIGltcG9ydCByZW5kZXIgZnJvbSBcIi4vcmVuZGVyLmpzXCI7XG5pbXBvcnQgR2FtZUJvYXJkIGZyb20gXCIuL2dhbWVCb2FyZC5qc1wiO1xuXG5jb25zdCBub2RlcyA9IFtcbiAgeyBpc09jZWFuOiB0cnVlLCBuYW1lOiBcImJheW9mYmlzY2F5XCIgfSxcbiAgeyBpc09jZWFuOiB0cnVlLCBuYW1lOiBcImJsYWNrc2VhXCIgfSxcbiAgeyBpc09jZWFuOiB0cnVlLCBuYW1lOiBcIndlc3Rlcm5tZWRpdGVycmFuZWFuc2VhXCIgfSxcbiAgeyBpc09jZWFuOiB0cnVlLCBuYW1lOiBcImlvbmlhbnNlYVwiIH0sXG4gIHsgaXNPY2VhbjogdHJ1ZSwgbmFtZTogXCJlYXN0ZXJubWVkaXRlcnJhbmVhbnNlYVwiIH0sXG4gIHsgaXNPY2VhbjogdHJ1ZSwgbmFtZTogXCJub3J0aHNlYVwiIH0sXG4gIHsgaXNPY2VhbjogdHJ1ZSwgbmFtZTogXCJub3J0aGF0bGFudGljXCIgfSxcbiAgeyBpc09jZWFuOiB0cnVlLCBuYW1lOiBcImJhbHRpY3NlYVwiIH0sXG4gIHsgaXNPY2VhbjogdHJ1ZSwgbmFtZTogXCJlbmdsaXNoY2hhbm5lbFwiIH0sXG4gIHsgaXNPY2VhbjogZmFsc2UsIG5hbWU6IFwidHVya2V5XCIgfSxcbiAgeyBpc09jZWFuOiBmYWxzZSwgbmFtZTogXCJidWxnYXJpYVwiIH0sXG4gIHsgaXNPY2VhbjogZmFsc2UsIG5hbWU6IFwicm9tYW5pYVwiIH0sXG4gIHsgaXNPY2VhbjogZmFsc2UsIG5hbWU6IFwid2VzdGJhbGthblwiIH0sXG4gIHsgaXNPY2VhbjogZmFsc2UsIG5hbWU6IFwiZ3JlZWNlXCIgfSxcbiAgeyBpc09jZWFuOiBmYWxzZSwgbmFtZTogXCJ0dW5pc1wiIH0sXG4gIHsgaXNPY2VhbjogZmFsc2UsIG5hbWU6IFwiYWxnZXJpYVwiIH0sXG4gIHsgaXNPY2VhbjogZmFsc2UsIG5hbWU6IFwibW9yb2Njb1wiIH0sXG4gIHsgaXNPY2VhbjogZmFsc2UsIG5hbWU6IFwic3BhaW5cIiB9LFxuICB7IGlzT2NlYW46IGZhbHNlLCBuYW1lOiBcInBvcnR1Z2FsXCIgfSxcbiAgeyBpc09jZWFuOiBmYWxzZSwgbmFtZTogXCJiZWxnaXVtXCIgfSxcbiAgeyBpc09jZWFuOiBmYWxzZSwgbmFtZTogXCJob2xsYW5kXCIgfSxcbiAgeyBpc09jZWFuOiBmYWxzZSwgbmFtZTogXCJkZW5tYXJrXCIgfSxcbiAgeyBpc09jZWFuOiBmYWxzZSwgbmFtZTogXCJub3J3YXlcIiB9LFxuICB7IGlzT2NlYW46IGZhbHNlLCBuYW1lOiBcInN3ZWRlblwiIH0sXG4gIHsgbmF0aW9uOiBOYXRpb24uUlUsIGZhY3RvcnlUeXBlOiBcImFybWFtZW50c1wiLCBuYW1lOiBcIm1vc2Nvd1wiLCBpc0hvbWU6IHRydWUgfSxcbiAgeyBuYXRpb246IE5hdGlvbi5SVSwgZmFjdG9yeVR5cGU6IFwiYXJtYW1lbnRzXCIsIG5hbWU6IFwid2Fyc2F3XCIgfSxcbiAgeyBuYXRpb246IE5hdGlvbi5SVSwgZmFjdG9yeVR5cGU6IFwic2hpcHlhcmRcIiwgbmFtZTogXCJzdHBldGVyc2J1cmdcIiB9LFxuICB7IG5hdGlvbjogTmF0aW9uLlJVLCBmYWN0b3J5VHlwZTogXCJhcm1hbWVudHNcIiwgbmFtZTogXCJraWV2XCIgfSxcbiAgeyBuYXRpb246IE5hdGlvbi5SVSwgZmFjdG9yeVR5cGU6IFwic2hpcHlhcmRcIiwgbmFtZTogXCJvZGVzc2FcIiwgaXNIb21lOiB0cnVlIH0sXG4gIHsgbmF0aW9uOiBOYXRpb24uR0UsIGZhY3RvcnlUeXBlOiBcInNoaXB5YXJkXCIsIG5hbWU6IFwiZGFuemlnXCIgfSxcbiAgeyBuYXRpb246IE5hdGlvbi5HRSwgZmFjdG9yeVR5cGU6IFwiYXJtYW1lbnRzXCIsIG5hbWU6IFwiYmVybGluXCIsIGlzSG9tZTogdHJ1ZSB9LFxuICB7IG5hdGlvbjogTmF0aW9uLkdFLCBmYWN0b3J5VHlwZTogXCJhcm1hbWVudHNcIiwgbmFtZTogXCJtdW5pY2hcIiB9LFxuICB7IG5hdGlvbjogTmF0aW9uLkdFLCBmYWN0b3J5VHlwZTogXCJhcm1hbWVudHNcIiwgbmFtZTogXCJjb2xvZ25lXCIgfSxcbiAgeyBuYXRpb246IE5hdGlvbi5HRSwgZmFjdG9yeVR5cGU6IFwic2hpcHlhcmRcIiwgbmFtZTogXCJoYW1idXJnXCIsIGlzSG9tZTogdHJ1ZSB9LFxuICB7IG5hdGlvbjogTmF0aW9uLkdCLCBmYWN0b3J5VHlwZTogXCJzaGlweWFyZFwiLCBuYW1lOiBcImR1YmxpblwiIH0sXG4gIHsgbmF0aW9uOiBOYXRpb24uR0IsIGZhY3RvcnlUeXBlOiBcInNoaXB5YXJkXCIsIG5hbWU6IFwiZWRpbmJ1cmdoXCIgfSxcbiAge1xuICAgIG5hdGlvbjogTmF0aW9uLkdCLFxuICAgIGZhY3RvcnlUeXBlOiBcInNoaXB5YXJkXCIsXG4gICAgbmFtZTogXCJsaXZlcnBvb2xcIixcbiAgICBpc0hvbWU6IHRydWUsXG4gIH0sXG4gIHsgbmF0aW9uOiBOYXRpb24uR0IsIGZhY3RvcnlUeXBlOiBcImFybWFtZW50c1wiLCBuYW1lOiBcInNoZWZmaWVsZFwiIH0sXG4gIHsgbmF0aW9uOiBOYXRpb24uR0IsIGZhY3RvcnlUeXBlOiBcInNoaXB5YXJkXCIsIG5hbWU6IFwibG9uZG9uXCIsIGlzSG9tZTogdHJ1ZSB9LFxuICB7IG5hdGlvbjogTmF0aW9uLkZSLCBmYWN0b3J5VHlwZTogXCJhcm1hbWVudHNcIiwgbmFtZTogXCJwYXJpc1wiLCBpc0hvbWU6IHRydWUgfSxcbiAgeyBuYXRpb246IE5hdGlvbi5GUiwgZmFjdG9yeVR5cGU6IFwiYXJtYW1lbnRzXCIsIG5hbWU6IFwiZGlqb25cIiB9LFxuICB7IG5hdGlvbjogTmF0aW9uLkZSLCBmYWN0b3J5VHlwZTogXCJzaGlweWFyZFwiLCBuYW1lOiBcIm1hcnNlaWxsZVwiIH0sXG4gIHtcbiAgICBuYXRpb246IE5hdGlvbi5GUixcbiAgICBmYWN0b3J5VHlwZTogXCJzaGlweWFyZFwiLFxuICAgIG5hbWU6IFwiYm9yZGVhdXhcIixcbiAgICBpc0hvbWU6IHRydWUsXG4gIH0sXG4gIHsgbmF0aW9uOiBOYXRpb24uRlIsIGZhY3RvcnlUeXBlOiBcInNoaXB5YXJkXCIsIG5hbWU6IFwiYnJlc3RcIiB9LFxuICB7IG5hdGlvbjogTmF0aW9uLklULCBmYWN0b3J5VHlwZTogXCJzaGlweWFyZFwiLCBuYW1lOiBcImdlbm9hXCIgfSxcbiAgeyBuYXRpb246IE5hdGlvbi5JVCwgZmFjdG9yeVR5cGU6IFwic2hpcHlhcmRcIiwgbmFtZTogXCJ2ZW5pY2VcIiB9LFxuICB7IG5hdGlvbjogTmF0aW9uLklULCBmYWN0b3J5VHlwZTogXCJhcm1hbWVudHNcIiwgbmFtZTogXCJmbG9yZW5jZVwiIH0sXG4gIHsgbmF0aW9uOiBOYXRpb24uSVQsIGZhY3RvcnlUeXBlOiBcImFybWFtZW50c1wiLCBuYW1lOiBcInJvbWVcIiwgaXNIb21lOiB0cnVlIH0sXG4gIHsgbmF0aW9uOiBOYXRpb24uSVQsIGZhY3RvcnlUeXBlOiBcInNoaXB5YXJkXCIsIG5hbWU6IFwibmFwbGVzXCIsIGlzSG9tZTogdHJ1ZSB9LFxuICB7IG5hdGlvbjogTmF0aW9uLkFILCBmYWN0b3J5VHlwZTogXCJzaGlweWFyZFwiLCBuYW1lOiBcInRyaWVzdGVcIiB9LFxuICB7IG5hdGlvbjogTmF0aW9uLkFILCBmYWN0b3J5VHlwZTogXCJhcm1hbWVudHNcIiwgbmFtZTogXCJ2aWVubmFcIiwgaXNIb21lOiB0cnVlIH0sXG4gIHtcbiAgICBuYXRpb246IE5hdGlvbi5BSCxcbiAgICBmYWN0b3J5VHlwZTogXCJhcm1hbWVudHNcIixcbiAgICBuYW1lOiBcImJ1ZGFwZXN0XCIsXG4gICAgaXNIb21lOiB0cnVlLFxuICB9LFxuICB7IG5hdGlvbjogTmF0aW9uLkFILCBmYWN0b3J5VHlwZTogXCJhcm1hbWVudHNcIiwgbmFtZTogXCJwcmFndWVcIiB9LFxuICB7IG5hdGlvbjogTmF0aW9uLkFILCBmYWN0b3J5VHlwZTogXCJhcm1hbWVudHNcIiwgbmFtZTogXCJsZW1iZXJnXCIgfSxcbl07XG5cbmNvbnN0IGVkZ2VzID0gW1xuICBbXCJtb3Njb3dcIiwgXCJraWV2XCJdLFxuICBbXCJtb3Njb3dcIiwgXCJ3YXJzYXdcIl0sXG4gIFtcIm1vc2Nvd1wiLCBcInN0cGV0ZXJzYnVyZ1wiXSxcbiAgW1wid2Fyc2F3XCIsIFwic3RwZXRlcnNidXJnXCJdLFxuICBbXCJ3YXJzYXdcIiwgXCJtb3Njb3dcIl0sXG4gIFtcIndhcnNhd1wiLCBcImtpZXZcIl0sXG4gIFtcIndhcnNhd1wiLCBcImxlbWJlcmdcIl0sXG4gIFtcIndhcnNhd1wiLCBcInByYWd1ZVwiXSxcbiAgW1wid2Fyc2F3XCIsIFwiZGFuemlnXCJdLFxuICBbXCJzdHBldGVyc2J1cmdcIiwgXCJtb3Njb3dcIl0sXG4gIFtcInN0cGV0ZXJzYnVyZ1wiLCBcImtpZXZcIl0sXG4gIFtcInN0cGV0ZXJzYnVyZ1wiLCBcIndhcnNhd1wiXSxcbiAgW1wic3RwZXRlcnNidXJnXCIsIFwiZGFuemlnXCJdLFxuICBbXCJzdHBldGVyc2J1cmdcIiwgXCJiYWx0aWNzZWFcIl0sXG4gIFtcImtpZXZcIiwgXCJtb3Njb3dcIl0sXG4gIFtcImtpZXZcIiwgXCJvZGVzc2FcIl0sXG4gIFtcImtpZXZcIiwgXCJyb21hbmlhXCJdLFxuICBbXCJraWV2XCIsIFwibGVtYmVyZ1wiXSxcbiAgW1wia2lldlwiLCBcIndhcnNhd1wiXSxcbiAgW1wib2Rlc3NhXCIsIFwia2lldlwiXSxcbiAgW1wib2Rlc3NhXCIsIFwiYmxhY2tzZWFcIl0sXG4gIFtcIm9kZXNzYVwiLCBcInJvbWFuaWFcIl0sXG4gIFtcImJsYWNrc2VhXCIsIFwib2Rlc3NhXCJdLFxuICBbXCJibGFja3NlYVwiLCBcInR1cmtleVwiXSxcbiAgW1wiYmxhY2tzZWFcIiwgXCJlYXN0ZXJubWVkaXRlcnJhbmVhbnNlYVwiXSxcbiAgW1wiYmxhY2tzZWFcIiwgXCJidWxnYXJpYVwiXSxcbiAgW1wiYmxhY2tzZWFcIiwgXCJyb21hbmlhXCJdLFxuICBbXCJ0dXJrZXlcIiwgXCJibGFja3NlYVwiXSxcbiAgW1widHVya2V5XCIsIFwiZWFzdGVybm1lZGl0ZXJyYW5lYW5zZWFcIl0sXG4gIFtcInR1cmtleVwiLCBcImJ1bGdhcmlhXCJdLFxuICBbXCJlYXN0ZXJubWVkaXRlcnJhbmVhbnNlYVwiLCBcInR1cmtleVwiXSxcbiAgW1wiZWFzdGVybm1lZGl0ZXJyYW5lYW5zZWFcIiwgXCJpb25pYW5zZWFcIl0sXG4gIFtcImVhc3Rlcm5tZWRpdGVycmFuZWFuc2VhXCIsIFwiZ3JlZWNlXCJdLFxuICBbXCJlYXN0ZXJubWVkaXRlcnJhbmVhbnNlYVwiLCBcImJ1bGdhcmlhXCJdLFxuICBbXCJlYXN0ZXJubWVkaXRlcnJhbmVhbnNlYVwiLCBcImJsYWNrc2VhXCJdLFxuICBbXCJidWxnYXJpYVwiLCBcInJvbWFuaWFcIl0sXG4gIFtcImJ1bGdhcmlhXCIsIFwiYmxhY2tzZWFcIl0sXG4gIFtcImJ1bGdhcmlhXCIsIFwidHVya2V5XCJdLFxuICBbXCJidWxnYXJpYVwiLCBcImVhc3Rlcm5tZWRpdGVycmFuZWFuc2VhXCJdLFxuICBbXCJidWxnYXJpYVwiLCBcImdyZWVjZVwiXSxcbiAgW1wiYnVsZ2FyaWFcIiwgXCJ3ZXN0YmFsa2FuXCJdLFxuICBbXCJyb21hbmlhXCIsIFwibGVtYmVyZ1wiXSxcbiAgW1wicm9tYW5pYVwiLCBcImtpZXZcIl0sXG4gIFtcInJvbWFuaWFcIiwgXCJvZGVzc2FcIl0sXG4gIFtcInJvbWFuaWFcIiwgXCJibGFja3NlYVwiXSxcbiAgW1wicm9tYW5pYVwiLCBcImJ1bGdhcmlhXCJdLFxuICBbXCJyb21hbmlhXCIsIFwid2VzdGJhbGthblwiXSxcbiAgW1wicm9tYW5pYVwiLCBcImJ1ZGFwZXN0XCJdLFxuICBbXCJ3ZXN0YmFsa2FuXCIsIFwiYnVkYXBlc3RcIl0sXG4gIFtcIndlc3RiYWxrYW5cIiwgXCJyb21hbmlhXCJdLFxuICBbXCJ3ZXN0YmFsa2FuXCIsIFwiYnVsZ2FyaWFcIl0sXG4gIFtcIndlc3RiYWxrYW5cIiwgXCJncmVlY2VcIl0sXG4gIFtcIndlc3RiYWxrYW5cIiwgXCJpb25pYW5zZWFcIl0sXG4gIFtcIndlc3RiYWxrYW5cIiwgXCJ0cmllc3RlXCJdLFxuICBbXCJncmVlY2VcIiwgXCJ3ZXN0YmFsa2FuXCJdLFxuICBbXCJncmVlY2VcIiwgXCJidWxnYXJpYVwiXSxcbiAgW1wiZ3JlZWNlXCIsIFwiZWFzdGVybm1lZGl0ZXJyYW5lYW5zZWFcIl0sXG4gIFtcImdyZWVjZVwiLCBcImlvbmlhbnNlYVwiXSxcbiAgW1wiaW9uaWFuc2VhXCIsIFwidHJpZXN0ZVwiXSxcbiAgW1wiaW9uaWFuc2VhXCIsIFwid2VzdGJhbGthblwiXSxcbiAgW1wiaW9uaWFuc2VhXCIsIFwiZ3JlZWNlXCJdLFxuICBbXCJpb25pYW5zZWFcIiwgXCJlYXN0ZXJubWVkaXRlcnJhbmVhbnNlYVwiXSxcbiAgW1wiaW9uaWFuc2VhXCIsIFwidHVuaXNcIl0sXG4gIFtcImlvbmlhbnNlYVwiLCBcIndlc3Rlcm5tZWRpdGVycmFuZWFuc2VhXCJdLFxuICBbXCJpb25pYW5zZWFcIiwgXCJuYXBsZXNcIl0sXG4gIFtcImxlbWJlcmdcIiwgXCJraWV2XCJdLFxuICBbXCJsZW1iZXJnXCIsIFwicm9tYW5pYVwiXSxcbiAgW1wibGVtYmVyZ1wiLCBcImJ1ZGFwZXN0XCJdLFxuICBbXCJsZW1iZXJnXCIsIFwicHJhZ3VlXCJdLFxuICBbXCJsZW1iZXJnXCIsIFwid2Fyc2F3XCJdLFxuICBbXCJidWRhcGVzdFwiLCBcImxlbWJlcmdcIl0sXG4gIFtcImJ1ZGFwZXN0XCIsIFwicm9tYW5pYVwiXSxcbiAgW1wiYnVkYXBlc3RcIiwgXCJ3ZXN0YmFsa2FuXCJdLFxuICBbXCJidWRhcGVzdFwiLCBcInRyaWVzdGVcIl0sXG4gIFtcImJ1ZGFwZXN0XCIsIFwidmllbm5hXCJdLFxuICBbXCJidWRhcGVzdFwiLCBcInByYWd1ZVwiXSxcbiAgW1wicHJhZ3VlXCIsIFwiZGFuemlnXCJdLFxuICBbXCJwcmFndWVcIiwgXCJ3YXJzYXdcIl0sXG4gIFtcInByYWd1ZVwiLCBcImxlbWJlcmdcIl0sXG4gIFtcInByYWd1ZVwiLCBcImJ1ZGFwZXN0XCJdLFxuICBbXCJwcmFndWVcIiwgXCJ2aWVubmFcIl0sXG4gIFtcInByYWd1ZVwiLCBcIm11bmljaFwiXSxcbiAgW1wicHJhZ3VlXCIsIFwiYmVybGluXCJdLFxuICBbXCJ2aWVubmFcIiwgXCJwcmFndWVcIl0sXG4gIFtcInZpZW5uYVwiLCBcImJ1ZGFwZXN0XCJdLFxuICBbXCJ2aWVubmFcIiwgXCJ0cmllc3RlXCJdLFxuICBbXCJ2aWVubmFcIiwgXCJ2ZW5pY2VcIl0sXG4gIC8vIFtcInZpZW5uYVwiLCBcInN3aXR6ZXJsYW5kXCJdLFxuICBbXCJ2aWVubmFcIiwgXCJtdW5pY2hcIl0sXG4gIFtcInRyaWVzdGVcIiwgXCJ2aWVubmFcIl0sXG4gIFtcInRyaWVzdGVcIiwgXCJidWRhcGVzdFwiXSxcbiAgW1widHJpZXN0ZVwiLCBcIndlc3RiYWxrYW5cIl0sXG4gIFtcInRyaWVzdGVcIiwgXCJpb25pYW5zZWFcIl0sXG4gIFtcInRyaWVzdGVcIiwgXCJ2ZW5pY2VcIl0sXG4gIFtcInZlbmljZVwiLCBcInZpZW5uYVwiXSxcbiAgW1widmVuaWNlXCIsIFwidHJpZXN0ZVwiXSxcbiAgW1widmVuaWNlXCIsIFwiaW9uaWFuc2VhXCJdLFxuICBbXCJ2ZW5pY2VcIiwgXCJyb21lXCJdLFxuICBbXCJ2ZW5pY2VcIiwgXCJmbG9yZW5jZVwiXSxcbiAgW1widmVuaWNlXCIsIFwiZ2Vub2FcIl0sXG4gIFtcInJvbWVcIiwgXCJ2ZW5pY2VcIl0sXG4gIFtcInJvbWVcIiwgXCJpb25pYW5zZWFcIl0sXG4gIFtcInJvbWVcIiwgXCJuYXBsZXNcIl0sXG4gIFtcInJvbWVcIiwgXCJ3ZXN0ZXJubWVkaXRlcnJhbmVhbnNlYVwiXSxcbiAgW1wicm9tZVwiLCBcImZsb3JlbmNlXCJdLFxuICBbXCJuYXBsZXNcIiwgXCJyb21lXCJdLFxuICBbXCJuYXBsZXNcIiwgXCJpb25pYW5zZWFcIl0sXG4gIFtcIm5hcGxlc1wiLCBcIndlc3Rlcm5tZWRpdGVycmFuZWFuc2VhXCJdLFxuICBbXCJmbG9yZW5jZVwiLCBcImdlbm9hXCJdLFxuICBbXCJmbG9yZW5jZVwiLCBcInZlbmljZVwiXSxcbiAgW1wiZmxvcmVuY2VcIiwgXCJyb21lXCJdLFxuICBbXCJmbG9yZW5jZVwiLCBcIndlc3Rlcm5tZWRpdGVycmFuZWFuc2VhXCJdLFxuICAvLyBbXCJnZW5vYVwiLCBcInN3aXR6ZXJsYW5kXCJdLFxuICBbXCJnZW5vYVwiLCBcInZpZW5uYVwiXSxcbiAgW1wiZ2Vub2FcIiwgXCJ2ZW5pY2VcIl0sXG4gIFtcImdlbm9hXCIsIFwiZmxvcmVuY2VcIl0sXG4gIFtcImdlbm9hXCIsIFwid2VzdGVybm1lZGl0ZXJyYW5lYW5zZWFcIl0sXG4gIFtcImdlbm9hXCIsIFwibWFyc2VpbGxlXCJdLFxuICBbXCJtYXJzZWlsbGVcIiwgXCJkaWpvblwiXSxcbiAgLy8gW1wibWFyc2VpbGxlXCIsIFwic3dpdHplcmxhbmRcIl0sXG4gIFtcIm1hcnNlaWxsZVwiLCBcImdlbm9hXCJdLFxuICBbXCJtYXJzZWlsbGVcIiwgXCJ3ZXN0ZXJubWVkaXRlcnJhbmVhbnNlYVwiXSxcbiAgW1wibWFyc2VpbGxlXCIsIFwic3BhaW5cIl0sXG4gIFtcIm1hcnNlaWxsZVwiLCBcImJvcmRlYXV4XCJdLFxuICBbXCJib3JkZWF1eFwiLCBcImJyZXN0XCJdLFxuICBbXCJib3JkZWF1eFwiLCBcImRpam9uXCJdLFxuICBbXCJib3JkZWF1eFwiLCBcIm1hcnNlaWxsZVwiXSxcbiAgW1wiYm9yZGVhdXhcIiwgXCJzcGFpblwiXSxcbiAgW1wiYm9yZGVhdXhcIiwgXCJiYXlvZmJpc2NheVwiXSxcbiAgW1wiYnJlc3RcIiwgXCJlbmdsaXNoY2hhbm5lbFwiXSxcbiAgW1wiYnJlc3RcIiwgXCJwYXJpc1wiXSxcbiAgW1wiYnJlc3RcIiwgXCJkaWpvblwiXSxcbiAgW1wiYnJlc3RcIiwgXCJib3JkZWF1eFwiXSxcbiAgW1wiYnJlc3RcIiwgXCJiYXlvZmJpc2NheVwiXSxcbiAgW1wicGFyaXNcIiwgXCJlbmdsaXNoY2hhbm5lbFwiXSxcbiAgW1wicGFyaXNcIiwgXCJiZWxnaXVtXCJdLFxuICBbXCJwYXJpc1wiLCBcImRpam9uXCJdLFxuICBbXCJwYXJpc1wiLCBcImJyZXN0XCJdLFxuICBbXCJkaWpvblwiLCBcInBhcmlzXCJdLFxuICBbXCJkaWpvblwiLCBcImJlbGdpdW1cIl0sXG4gIFtcImRpam9uXCIsIFwibXVuaWNoXCJdLFxuICAvLyBbXCJkaWpvblwiLCBcInN3aXR6ZXJsYW5kXCJdLFxuICBbXCJkaWpvblwiLCBcIm1hcnNlaWxsZVwiXSxcbiAgW1wiZGlqb25cIiwgXCJib3JkZWF1eFwiXSxcbiAgW1wiZGlqb25cIiwgXCJicmVzdFwiXSxcbiAgW1widHVuaXNcIiwgXCJlYXN0ZXJubWVkaXRlcnJhbmVhbnNlYVwiXSxcbiAgW1widHVuaXNcIiwgXCJ3ZXN0ZXJubWVkaXRlcnJhbmVhbnNlYVwiXSxcbiAgW1widHVuaXNcIiwgXCJhbGdlcmlhXCJdLFxuICBbXCJhbGdlcmlhXCIsIFwid2VzdGVybm1lZGl0ZXJyYW5lYW5zZWFcIl0sXG4gIFtcImFsZ2VyaWFcIiwgXCJ0dW5pc1wiXSxcbiAgW1wiYWxnZXJpYVwiLCBcIm1vcm9jY29cIl0sXG4gIFtcIm1vcm9jY29cIiwgXCJiYXlvZmJpc2NheVwiXSxcbiAgW1wibW9yb2Njb1wiLCBcImFsZ2VyaWFcIl0sXG4gIFtcIndlc3Rlcm5tZWRpdGVycmFuZWFuc2VhXCIsIFwibWFyc2VpbGxlXCJdLFxuICBbXCJ3ZXN0ZXJubWVkaXRlcnJhbmVhbnNlYVwiLCBcImdlbm9hXCJdLFxuICBbXCJ3ZXN0ZXJubWVkaXRlcnJhbmVhbnNlYVwiLCBcImZsb3JlbmNlXCJdLFxuICBbXCJ3ZXN0ZXJubWVkaXRlcnJhbmVhbnNlYVwiLCBcInJvbWVcIl0sXG4gIFtcIndlc3Rlcm5tZWRpdGVycmFuZWFuc2VhXCIsIFwibmFwbGVzXCJdLFxuICBbXCJ3ZXN0ZXJubWVkaXRlcnJhbmVhbnNlYVwiLCBcImlvbmlhbnNlYVwiXSxcbiAgW1wid2VzdGVybm1lZGl0ZXJyYW5lYW5zZWFcIiwgXCJ0dW5pc1wiXSxcbiAgW1wid2VzdGVybm1lZGl0ZXJyYW5lYW5zZWFcIiwgXCJhbGdlcmlhXCJdLFxuICBbXCJ3ZXN0ZXJubWVkaXRlcnJhbmVhbnNlYVwiLCBcImJheW9mYmlzY2F5XCJdLFxuICBbXCJ3ZXN0ZXJubWVkaXRlcnJhbmVhbnNlYVwiLCBcInNwYWluXCJdLFxuICBbXCJzcGFpblwiLCBcImJheW9mYmlzY2F5XCJdLFxuICBbXCJzcGFpblwiLCBcImJvcmRlYXV4XCJdLFxuICBbXCJzcGFpblwiLCBcIm1hcnNlaWxsZVwiXSxcbiAgW1wic3BhaW5cIiwgXCJ3ZXN0ZXJubWVkaXRlcnJhbmVhbnNlYVwiXSxcbiAgW1wic3BhaW5cIiwgXCJwb3J0dWdhbFwiXSxcbiAgW1wicG9ydHVnYWxcIiwgXCJiYXlvZmJpc2NheVwiXSxcbiAgW1wicG9ydHVnYWxcIiwgXCJzcGFpblwiXSxcbiAgW1wiYmF5b2ZiaXNjYXlcIiwgXCJub3J0aGF0bGFudGljXCJdLFxuICBbXCJiYXlvZmJpc2NheVwiLCBcImVuZ2xpc2hjaGFubmVsXCJdLFxuICBbXCJiYXlvZmJpc2NheVwiLCBcImJyZXN0XCJdLFxuICBbXCJiYXlvZmJpc2NheVwiLCBcImJvcmRlYXV4XCJdLFxuICBbXCJiYXlvZmJpc2NheVwiLCBcInNwYWluXCJdLFxuICBbXCJiYXlvZmJpc2NheVwiLCBcInBvcnR1Z2FsXCJdLFxuICBbXCJiYXlvZmJpc2NheVwiLCBcIm1vcm9jY29cIl0sXG4gIFtcIm5vcnRoYXRsYW50aWNcIiwgXCJkdWJsaW5cIl0sXG4gIFtcIm5vcnRoYXRsYW50aWNcIiwgXCJlZGluYnVyZ2hcIl0sXG4gIFtcIm5vcnRoYXRsYW50aWNcIiwgXCJub3J0aHNlYVwiXSxcbiAgW1wibm9ydGhhdGxhbnRpY1wiLCBcImxpdmVycG9vbFwiXSxcbiAgW1wibm9ydGhhdGxhbnRpY1wiLCBcImxvbmRvblwiXSxcbiAgW1wibm9ydGhhdGxhbnRpY1wiLCBcImVuZ2xpc2hjaGFubmVsXCJdLFxuICBbXCJub3J0aGF0bGFudGljXCIsIFwiYmF5b2ZiaXNjYXlcIl0sXG4gIFtcImR1YmxpblwiLCBcIm5vcnRoYXRsYW50aWNcIl0sXG4gIFtcImVkaW5idXJnaFwiLCBcIm5vcnRoYXRsYW50aWNcIl0sXG4gIFtcImVkaW5idXJnaFwiLCBcIm5vcnRoc2VhXCJdLFxuICBbXCJlZGluYnVyZ2hcIiwgXCJzaGVmZmllbGRcIl0sXG4gIFtcImVkaW5idXJnaFwiLCBcImxpdmVycG9vbFwiXSxcbiAgW1wibGl2ZXJwb29sXCIsIFwiZWRpbmJ1cmdoXCJdLFxuICBbXCJsaXZlcnBvb2xcIiwgXCJzaGVmZmllbGRcIl0sXG4gIFtcImxpdmVycG9vbFwiLCBcImxvbmRvblwiXSxcbiAgW1wibGl2ZXJwb29sXCIsIFwibm9ydGhhdGxhbnRpY1wiXSxcbiAgW1wic2hlZmZpZWxkXCIsIFwiZWRpbmJ1cmdoXCJdLFxuICBbXCJzaGVmZmllbGRcIiwgXCJub3J0aHNlYVwiXSxcbiAgW1wic2hlZmZpZWxkXCIsIFwibG9uZG9uXCJdLFxuICBbXCJzaGVmZmllbGRcIiwgXCJsaXZlcnBvb2xcIl0sXG4gIFtcImxvbmRvblwiLCBcInNoZWZmaWVsZFwiXSxcbiAgW1wibG9uZG9uXCIsIFwibm9ydGhzZWFcIl0sXG4gIFtcImxvbmRvblwiLCBcImVuZ2xpc2hjaGFubmVsXCJdLFxuICBbXCJsb25kb25cIiwgXCJub3J0aGF0bGFudGljXCJdLFxuICBbXCJsb25kb25cIiwgXCJsaXZlcnBvb2xcIl0sXG4gIFtcIm5vcnRoc2VhXCIsIFwibm9yd2F5XCJdLFxuICBbXCJub3J0aHNlYVwiLCBcImJhbHRpY3NlYVwiXSxcbiAgW1wibm9ydGhzZWFcIiwgXCJkZW5tYXJrXCJdLFxuICBbXCJub3J0aHNlYVwiLCBcImhhbWJ1cmdcIl0sXG4gIFtcIm5vcnRoc2VhXCIsIFwiaG9sbGFuZFwiXSxcbiAgW1wibm9ydGhzZWFcIiwgXCJlbmdsaXNoY2hhbm5lbFwiXSxcbiAgW1wibm9ydGhzZWFcIiwgXCJsb25kb25cIl0sXG4gIFtcIm5vcnRoc2VhXCIsIFwic2hlZmZpZWxkXCJdLFxuICBbXCJub3J0aHNlYVwiLCBcImVkaW5idXJnaFwiXSxcbiAgW1wibm9ydGhzZWFcIiwgXCJub3J0aGF0bGFudGljXCJdLFxuICBbXCJlbmdsaXNoY2hhbm5lbFwiLCBcIm5vcnRoYXRsYW50aWNcIl0sXG4gIFtcImVuZ2xpc2hjaGFubmVsXCIsIFwibG9uZG9uXCJdLFxuICBbXCJlbmdsaXNoY2hhbm5lbFwiLCBcImhvbGxhbmRcIl0sXG4gIFtcImVuZ2xpc2hjaGFubmVsXCIsIFwiYmVsZ2l1bVwiXSxcbiAgW1wiZW5nbGlzaGNoYW5uZWxcIiwgXCJwYXJpc1wiXSxcbiAgW1wiZW5nbGlzaGNoYW5uZWxcIiwgXCJicmVzdFwiXSxcbiAgW1wiZW5nbGlzaGNoYW5uZWxcIiwgXCJiYXlvZmJpc2NheVwiXSxcbiAgW1wiYmVsZ2l1bVwiLCBcImVuZ2xpc2hjaGFubmVsXCJdLFxuICBbXCJiZWxnaXVtXCIsIFwiaG9sbGFuZFwiXSxcbiAgW1wiYmVsZ2l1bVwiLCBcImNvbG9nbmVcIl0sXG4gIFtcImJlbGdpdW1cIiwgXCJtdW5pY2hcIl0sXG4gIFtcImJlbGdpdW1cIiwgXCJkaWpvblwiXSxcbiAgW1wiYmVsZ2l1bVwiLCBcInBhcmlzXCJdLFxuICBbXCJob2xsYW5kXCIsIFwibm9ydGhzZWFcIl0sXG4gIFtcImhvbGxhbmRcIiwgXCJoYW1idXJnXCJdLFxuICBbXCJob2xsYW5kXCIsIFwiY29sb2duZVwiXSxcbiAgW1wiaG9sbGFuZFwiLCBcImJlbGdpdW1cIl0sXG4gIFtcImhvbGxhbmRcIiwgXCJlbmdsaXNoY2hhbm5lbFwiXSxcbiAgW1wiY29sb2duZVwiLCBcImJlbGdpdW1cIl0sXG4gIFtcImNvbG9nbmVcIiwgXCJob2xsYW5kXCJdLFxuICBbXCJjb2xvZ25lXCIsIFwiaGFtYnVyZ1wiXSxcbiAgW1wiY29sb2duZVwiLCBcImJlcmxpblwiXSxcbiAgW1wiY29sb2duZVwiLCBcIm11bmljaFwiXSxcbiAgW1wibXVuaWNoXCIsIFwiY29sb2duZVwiXSxcbiAgW1wibXVuaWNoXCIsIFwiYmVybGluXCJdLFxuICBbXCJtdW5pY2hcIiwgXCJwcmFndWVcIl0sXG4gIFtcIm11bmljaFwiLCBcInZpZW5uYVwiXSxcbiAgLy8gW1wibXVuaWNoXCIsIFwic3dpdHplcmxhbmRcIl0sXG4gIFtcIm11bmljaFwiLCBcImRpam9uXCJdLFxuICBbXCJtdW5pY2hcIiwgXCJiZWxnaXVtXCJdLFxuICBbXCJiZXJsaW5cIiwgXCJiYWx0aWNzZWFcIl0sXG4gIFtcImJlcmxpblwiLCBcImRhbnppZ1wiXSxcbiAgW1wiYmVybGluXCIsIFwicHJhZ3VlXCJdLFxuICBbXCJiZXJsaW5cIiwgXCJtdW5pY2hcIl0sXG4gIFtcImJlcmxpblwiLCBcImNvbG9nbmVcIl0sXG4gIFtcImJlcmxpblwiLCBcImhhbWJ1cmdcIl0sXG4gIFtcImhhbWJ1cmdcIiwgXCJkZW5tYXJrXCJdLFxuICBbXCJoYW1idXJnXCIsIFwiYmFsdGljc2VhXCJdLFxuICBbXCJoYW1idXJnXCIsIFwiYmVybGluXCJdLFxuICBbXCJoYW1idXJnXCIsIFwiY29sb2duZVwiXSxcbiAgW1wiaGFtYnVyZ1wiLCBcImhvbGxhbmRcIl0sXG4gIFtcImhhbWJ1cmdcIiwgXCJub3J0aHNlYVwiXSxcbiAgW1wiZGFuemlnXCIsIFwiYmFsdGljc2VhXCJdLFxuICBbXCJkYW56aWdcIiwgXCJzdHBldGVyc2J1cmdcIl0sXG4gIFtcImRhbnppZ1wiLCBcIndhcnNhd1wiXSxcbiAgW1wiZGFuemlnXCIsIFwicHJhZ3VlXCJdLFxuICBbXCJkYW56aWdcIiwgXCJiZXJsaW5cIl0sXG4gIFtcIm5vcndheVwiLCBcIm5vcnRoc2VhXCJdLFxuICBbXCJub3J3YXlcIiwgXCJiYWx0aWNzZWFcIl0sXG4gIFtcIm5vcndheVwiLCBcInN3ZWRlblwiXSxcbiAgW1wic3dlZGVuXCIsIFwibm9yd2F5XCJdLFxuICBbXCJzd2VkZW5cIiwgXCJiYWx0aWNzZWFcIl0sXG4gIFtcImJhbHRpY3NlYVwiLCBcInN0cGV0ZXJzYnVyZ1wiXSxcbiAgW1wiYmFsdGljc2VhXCIsIFwiZGFuemlnXCJdLFxuICBbXCJiYWx0aWNzZWFcIiwgXCJiZXJsaW5cIl0sXG4gIFtcImJhbHRpY3NlYVwiLCBcImhhbWJ1cmdcIl0sXG4gIFtcImJhbHRpY3NlYVwiLCBcImRlbm1hcmtcIl0sXG4gIFtcImJhbHRpY3NlYVwiLCBcIm5vcnRoc2VhXCJdLFxuICBbXCJiYWx0aWNzZWFcIiwgXCJzd2VkZW5cIl0sXG5dO1xuXG4vLyByZW5kZXIoeyBub2RlcywgZWRnZXMgfSk7XG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBHYW1lQm9hcmQoeyBub2RlcywgZWRnZXMgfSk7XG4iLCJpbXBvcnQgeyBFbnVtIH0gZnJvbSBcIi4vZW51bS5qc1wiO1xuaW1wb3J0IHsgbWVtb2l6ZSB9IGZyb20gXCIuL21lbW8uanNcIjtcblxuY29uc3QgTmF0aW9uID0gRW51bS5mcm9tQXJyYXkoW1wiQUhcIiwgXCJJVFwiLCBcIkZSXCIsIFwiR0JcIiwgXCJHRVwiLCBcIlJVXCJdLCBcIk5hdGlvblwiKTtcblxuY29uc3QgY29zdCA9IHtcbiAgMTogMixcbiAgMjogNCxcbiAgMzogNixcbiAgNDogOSxcbiAgNTogMTIsXG4gIDY6IDE2LFxuICA3OiAyMCxcbiAgODogMjUsXG4gIDk6IDMwLFxufTtcbmV4cG9ydCBjb25zdCBCb25kID0gbWVtb2l6ZSgobmF0aW9uLCBudW1iZXIpID0+ICh7XG4gIG5hdGlvbixcbiAgbnVtYmVyLFxuICBjb3N0OiBjb3N0W251bWJlcl0sXG59KSk7XG5leHBvcnQgY29uc3QgQWxsQm9uZHMgPSAoKSA9PlxuICBuZXcgU2V0KFxuICAgIFtcIkFIXCIsIFwiSVRcIiwgXCJGUlwiLCBcIkdCXCIsIFwiR0VcIiwgXCJSVVwiXVxuICAgICAgLm1hcCgobmF0aW9uKSA9PlxuICAgICAgICBPYmplY3Qua2V5cyhjb3N0KS5tYXAoKG51bWJlcikgPT5cbiAgICAgICAgICBCb25kKE5hdGlvbltuYXRpb25dLCBwYXJzZUludChudW1iZXIpKVxuICAgICAgICApXG4gICAgICApXG4gICAgICAuZmxhdCgpXG4gICk7XG5cbmV4cG9ydCB7IE5hdGlvbiB9O1xuIiwiY29uc3QgY2xlYW5yb29tID0gT2JqZWN0LmZyZWV6ZShPYmplY3QuY3JlYXRlKG51bGwpKTtcblxuY2xhc3MgRW51bSB7XG4gIGNvbnN0cnVjdG9yKHZhbHVlLCBtZW1iZXJzLCBsYWJlbCkge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHRoaXMsIHtcbiAgICAgIHZhbHVlOiB7IHZhbHVlOiB2YWx1ZSwgZW51bWVyYWJsZTogdHJ1ZSB9LFxuICAgICAgbWVtYmVyczogeyB2YWx1ZTogbWVtYmVycywgZW51bWVyYWJsZTogZmFsc2UgfSxcbiAgICAgIGxhYmVsOiB7IHZhbHVlOiBsYWJlbCwgZW51bWVyYWJsZTogdHJ1ZSB9LFxuICAgIH0pO1xuXG4gICAgT2JqZWN0LmZyZWV6ZSh0aGlzKTtcbiAgfVxuXG4gIHdoZW4oY2FzZXMpIHtcbiAgICBmb3IgKGNvbnN0IG1lbWJlciBvZiB0aGlzLm1lbWJlcnMpIHtcbiAgICAgIGlmICghY2FzZXMuaGFzT3duUHJvcGVydHkobWVtYmVyKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYHVuaGFuZGxlZCBjYXNlICR7bWVtYmVyfWApO1xuICAgICAgfVxuICAgIH1cbiAgICBmb3IgKGNvbnN0IGMgb2YgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoY2FzZXMpKSB7XG4gICAgICBpZiAoT2JqZWN0LmlzKHRoaXMudmFsdWUsIGMpKSB7XG4gICAgICAgIHJldHVybiBjYXNlc1tjXSh0aGlzKTtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhyb3cgbmV3IEVycm9yKFwidW5yZWFjaGFibGVcIik7XG4gIH1cblxuICBnZXQgW1N5bWJvbC50b1N0cmluZ1RhZ10oKSB7XG4gICAgcmV0dXJuIGAke3RoaXMubGFiZWx9LiR7dGhpcy52YWx1ZX1gO1xuICB9XG5cbiAgc3RhdGljIGZyb21BcnJheShhcnksIGxhYmVsKSB7XG4gICAgY29uc3Qgc3RvcmUgPSBuZXcgTWFwKCk7XG4gICAgY29uc3QgbWVtYmVycyA9IG5ldyBTZXQoYXJ5KTtcblxuICAgIGlmIChsYWJlbCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBsYWJlbCA9IFwiPGFub255bW91cz5cIjtcbiAgICB9XG5cbiAgICBhcnkuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xuICAgICAgc3RvcmUuc2V0KGVsZW1lbnQsIG5ldyBFbnVtKGVsZW1lbnQsIG1lbWJlcnMsIGxhYmVsKSk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gbmV3IFByb3h5KGNsZWFucm9vbSwge1xuICAgICAgZ2V0KF90YXJnZXQsIHByb3BlcnR5LCBfcmVjZWl2ZXIpIHtcbiAgICAgICAgaWYgKHN0b3JlLmhhcyhwcm9wZXJ0eSkpIHtcbiAgICAgICAgICByZXR1cm4gc3RvcmUuZ2V0KHByb3BlcnR5KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwcm9wZXJ0eSA9PT0gU3ltYm9sLml0ZXJhdG9yKSB7XG4gICAgICAgICAgcmV0dXJuIHN0b3JlLnZhbHVlcy5iaW5kKHN0b3JlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwcm9wZXJ0eSA9PT0gXCJ0b1N0cmluZ1wiKSB7XG4gICAgICAgICAgcmV0dXJuICgpID0+IGAke2xhYmVsfSgke0FycmF5LmZyb20obWVtYmVycykuam9pbihcInxcIil9KWA7XG4gICAgICAgIH1cblxuICAgICAgICAvKiBlc2NhcGUgaGF0Y2ggZm9yIHByb3BlcnRpZXMgbGlrZSBTeW1ib2wobm9kZWpzLnV0aWwuaW5zcGVjdC5jdXN0b20pICovXG4gICAgICAgIGlmICh0eXBlb2YgcHJvcGVydHkgPT09IFwic3ltYm9sXCIpIHtcbiAgICAgICAgICByZXR1cm4gUmVmbGVjdC5nZXQoT2JqZWN0LCBwcm9wZXJ0eSwgX3JlY2VpdmVyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgXCIke1N0cmluZyhwcm9wZXJ0eSl9XCIgbm90IGZvdW5kIGluICR7bGFiZWx9YCk7XG4gICAgICB9LFxuICAgICAgc2V0KCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEVudW0gJHtsYWJlbH0gY2Fubm90IGJlIG11dGF0ZWRgKTtcbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cbn1cblxuZXhwb3J0IHsgRW51bSB9O1xuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2FtZUJvYXJkIHtcbiAgY29uc3RydWN0b3IoeyBub2RlcywgZWRnZXMgfSkge1xuICAgIHRoaXMuZ3JhcGggPSBuZXcgTWFwKCk7XG4gICAgdGhpcy5ieU5hdGlvbiA9IG5ldyBNYXAoKTtcblxuICAgIHRoaXMuc2V0dXBHcmFwaChub2Rlcyk7XG4gICAgdGhpcy5zZXRJbW1lZGlhdGVOZWlnaGJvcnMoZWRnZXMpO1xuICB9XG5cbiAgc2V0dXBHcmFwaChub2Rlcykge1xuICAgIGZvciAoY29uc3QgeyBuYW1lOiBwcm92aW5jZSwgbmF0aW9uLCBpc09jZWFuLCBmYWN0b3J5VHlwZSB9IG9mIG5vZGVzKSB7XG4gICAgICB0aGlzLmdyYXBoLnNldChwcm92aW5jZSwge1xuICAgICAgICBuYXRpb24sXG4gICAgICAgIG5laWdoYm9yczogbmV3IFNldCgpLFxuICAgICAgICBpc09jZWFuLFxuICAgICAgICBmYWN0b3J5VHlwZSxcbiAgICAgIH0pO1xuXG4gICAgICBpZiAoIXRoaXMuYnlOYXRpb24uaGFzKG5hdGlvbikpIHtcbiAgICAgICAgdGhpcy5ieU5hdGlvbi5zZXQobmF0aW9uLCBuZXcgU2V0KCkpO1xuICAgICAgfVxuICAgICAgdGhpcy5ieU5hdGlvbi5nZXQobmF0aW9uKS5hZGQocHJvdmluY2UpO1xuICAgIH1cbiAgfVxuXG4gIHNldEltbWVkaWF0ZU5laWdoYm9ycyhlZGdlcykge1xuICAgIGVkZ2VzLmZvckVhY2goKFthLCBiXSkgPT4ge1xuICAgICAgdGhpcy5ncmFwaC5nZXQoYSkubmVpZ2hib3JzLmFkZChiKTtcbiAgICAgIHRoaXMuZ3JhcGguZ2V0KGIpLm5laWdoYm9ycy5hZGQoYSk7XG4gICAgfSk7XG4gIH1cblxuICBuZWlnaGJvcnNGb3IoeyBvcmlnaW4sIG5hdGlvbiwgaXNGbGVldCwgZnJpZW5kbHlGbGVldHMgfSkge1xuICAgIHRoaXMudmFsaWRhdGUob3JpZ2luKTtcblxuICAgIGNvbnN0IG91dCA9IG5ldyBTZXQoKTtcblxuICAgIC8vIEFkZCBhbGwgaW1tZWRpYXRlIG5laWdoYm9yc1xuICAgIGZvciAoY29uc3QgbiBvZiB0aGlzLmdyYXBoLmdldChvcmlnaW4pLm5laWdoYm9ycykge1xuICAgICAgb3V0LmFkZChuKTtcbiAgICB9XG5cbiAgICAvLyBBZGQgYWxsIGhvbWUgcHJvdmluY2VzIGlmIG9yaWdpbiBpcyBpbiB0aGVpciBob21lIG5hdGlvblxuICAgIGlmIChuYXRpb24gPT09IHRoaXMuZ3JhcGguZ2V0KG9yaWdpbikubmF0aW9uICYmICFpc0ZsZWV0KSB7XG4gICAgICBmb3IgKGNvbnN0IG4gb2YgdGhpcy5ieU5hdGlvbi5nZXQobmF0aW9uKSkge1xuICAgICAgICBmb3IgKGNvbnN0IHggb2YgdGhpcy5ncmFwaC5nZXQobikubmVpZ2hib3JzKSB7XG4gICAgICAgICAgb3V0LmFkZCh4KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIENvbnZveVxuICAgIGlmICghaXNGbGVldCkge1xuICAgICAgZm9yIChjb25zdCBuIG9mIG91dCkge1xuICAgICAgICBpZiAodGhpcy5ncmFwaC5nZXQobikuaXNPY2Vhbikge1xuICAgICAgICAgIGlmIChmcmllbmRseUZsZWV0cy5oYXMobikpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgbmVpZ2hib3Igb2YgdGhpcy5ncmFwaC5nZXQobikubmVpZ2hib3JzKSB7XG4gICAgICAgICAgICAgIG91dC5hZGQobmVpZ2hib3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIEFybWllcyBjYW4gbm90IHN3aW1cbiAgICAvLyBXZSBhbGwgZHdlbGwgd2hlcmUgd2UgYmVsb25nXG4gICAgLy8gTmF2aWVzIGNhbiBub3Qgd2Fsa1xuICAgIGZvciAoY29uc3QgbiBvZiBvdXQpIHtcbiAgICAgIGlmICh0aGlzLmdyYXBoLmdldChuKS5pc09jZWFuIF4gaXNGbGVldCkge1xuICAgICAgICBvdXQuZGVsZXRlKG4pO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFNlbGZsZXNzbmVzcyBpcyBhIHZpcnR1ZVxuICAgIG91dC5kZWxldGUob3JpZ2luKTtcblxuICAgIHJldHVybiBvdXQ7XG4gIH1cblxuICB2YWxpZGF0ZShvcmlnaW4pIHtcbiAgICBpZiAoIXRoaXMuZ3JhcGguaGFzKG9yaWdpbikpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIGBwcm92aW5jZSAke29yaWdpbn0gbm90IGZvdW5kLiBBdmFpbGFibGUgcHJvdmluY2VzIGFyZTogJHtbXG4gICAgICAgICAgLi4udGhpcy5ncmFwaC5rZXlzKCksXG4gICAgICAgIF19YFxuICAgICAgKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgTmF0aW9uLCBCb25kIH0gZnJvbSBcIi4vY29uc3RhbnRzLmpzXCI7XG5pbXBvcnQgQWN0aW9uIGZyb20gXCIuL2FjdGlvbi5qc1wiO1xuaW1wb3J0IHN0YW5kYXJkR2FtZUJvYXJkIGZyb20gXCIuL2JvYXJkLmpzXCI7XG5pbXBvcnQgc2V0dXAgZnJvbSBcIi4vc3RhbmRhcmRTZXR1cC5qc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBJbXBlcmlhbCB7XG4gIHN0YXRpYyBmcm9tTG9nKGxvZykge1xuICAgIGxldCBnYW1lID0gbmV3IEltcGVyaWFsKCk7XG4gICAgbG9nLmZvckVhY2goKGVudHJ5KSA9PiBnYW1lLnRpY2soZW50cnkpKTtcbiAgICByZXR1cm4gZ2FtZTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKGJvYXJkKSB7XG4gICAgdGhpcy5ib2FyZCA9IGJvYXJkIHx8IHN0YW5kYXJkR2FtZUJvYXJkO1xuICAgIHRoaXMubG9nID0gW107XG4gIH1cblxuICB0aWNrKGFjdGlvbikge1xuICAgIHRoaXMubG9nLnB1c2goYWN0aW9uKTtcblxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcbiAgICAgIGNhc2UgXCJub29wXCI6XG4gICAgICAgIHJldHVybjtcbiAgICAgIGNhc2UgXCJpbml0aWFsaXplXCI6XG4gICAgICAgIGNvbnN0IHMgPSBzZXR1cCh7XG4gICAgICAgICAgcGxheWVyczogYWN0aW9uLnBheWxvYWQucGxheWVycyxcbiAgICAgICAgICBwcm92aW5jZU5hbWVzOiBBcnJheS5mcm9tKHRoaXMuYm9hcmQuZ3JhcGgua2V5cygpKSxcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuYXZhaWxhYmxlQm9uZHMgPSBzLmF2YWlsYWJsZUJvbmRzO1xuICAgICAgICB0aGlzLmN1cnJlbnROYXRpb24gPSBzLmN1cnJlbnROYXRpb247XG4gICAgICAgIHRoaXMuaW52ZXN0b3JDYXJkSG9sZGVyID0gcy5pbnZlc3RvckNhcmRIb2xkZXI7XG4gICAgICAgIHRoaXMubmF0aW9ucyA9IHMubmF0aW9ucztcbiAgICAgICAgdGhpcy5vcmRlciA9IHMub3JkZXI7XG4gICAgICAgIHRoaXMucGxheWVycyA9IHMucGxheWVycztcbiAgICAgICAgdGhpcy5wcm92aW5jZXMgPSBzLnByb3ZpbmNlcztcbiAgICAgICAgdGhpcy51bml0cyA9IHMudW5pdHM7XG4gICAgICAgIHRoaXMuY3VycmVudFBsYXllck5hbWUgPSB0aGlzLm5hdGlvbnMuZ2V0KFxuICAgICAgICAgIHRoaXMuY3VycmVudE5hdGlvblxuICAgICAgICApLmNvbnRyb2xsZXI7XG4gICAgICAgIHRoaXMuYXZhaWxhYmxlQWN0aW9ucyA9IG5ldyBTZXQodGhpcy5yb25kZWxBY3Rpb25zKE5hdGlvbi5BSCkpO1xuICAgICAgICByZXR1cm47XG4gICAgICBjYXNlIFwiYm9uZFB1cmNoYXNlXCI6XG4gICAgICAgIHRoaXMucHVyY2hhc2VCb25kKGFjdGlvbik7XG4gICAgICAgIHRoaXMuaGFuZGxlQWR2YW5jZVBsYXllcigpO1xuICAgICAgICB0aGlzLmF2YWlsYWJsZUFjdGlvbnMgPSBuZXcgU2V0KHRoaXMucm9uZGVsQWN0aW9ucyh0aGlzLmN1cnJlbnROYXRpb24pKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgY2FzZSBcImVuZE1hbmV1dmVyXCI6XG4gICAgICAgIHRoaXMuY3VycmVudE5hdGlvbiA9IHRoaXMubmV4dE5hdGlvbih0aGlzLmN1cnJlbnROYXRpb24pO1xuICAgICAgICB0aGlzLmF2YWlsYWJsZUFjdGlvbnMgPSBuZXcgU2V0KHRoaXMucm9uZGVsQWN0aW9ucyh0aGlzLmN1cnJlbnROYXRpb24pKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgY2FzZSBcImZpZ2h0XCI6XG4gICAgICAgIHRoaXMudW5pdHMuZ2V0KE5hdGlvbi5GUikuZ2V0KGFjdGlvbi5wYXlsb2FkLnByb3ZpbmNlKS5mbGVldHMgLT0gMTtcbiAgICAgICAgdGhpcy51bml0cy5nZXQoTmF0aW9uLklUKS5nZXQoYWN0aW9uLnBheWxvYWQucHJvdmluY2UpLmZsZWV0cyAtPSAxO1xuICAgICAgICB0aGlzLnByb3ZpbmNlcy5nZXQoYWN0aW9uLnBheWxvYWQucHJvdmluY2UpLmZsYWcgPVxuICAgICAgICAgIGFjdGlvbi5wYXlsb2FkLmluY3VtYmVudDtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgY2FzZSBcImJ1aWxkRmFjdG9yeVwiOlxuICAgICAgICB0aGlzLmJ1aWxkRmFjdG9yeShhY3Rpb24pO1xuICAgICAgICBpZiAoXG4gICAgICAgICAgdGhpcy5uYXRpb25zLmdldCh0aGlzLmN1cnJlbnROYXRpb24pLnByZXZpb3VzUm9uZGVsUG9zaXRpb24gPT09XG4gICAgICAgICAgXCJtYW5ldXZlcjFcIlxuICAgICAgICApIHtcbiAgICAgICAgICB0aGlzLmVuZE9mSW52ZXN0b3JUdXJuKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5oYW5kbGVBZHZhbmNlUGxheWVyKCk7XG4gICAgICAgIHRoaXMuYXZhaWxhYmxlQWN0aW9ucyA9IG5ldyBTZXQodGhpcy5yb25kZWxBY3Rpb25zKHRoaXMuY3VycmVudE5hdGlvbikpO1xuICAgICAgICByZXR1cm47XG4gICAgICBjYXNlIFwiaW1wb3J0XCI6XG4gICAgICAgIGFjdGlvbi5wYXlsb2FkLnBsYWNlbWVudHMuZm9yRWFjaCgoeyBwcm92aW5jZSwgdHlwZSB9KSA9PiB7XG4gICAgICAgICAgY29uc3QgbmF0aW9uID0gdGhpcy5ib2FyZC5ncmFwaC5nZXQocHJvdmluY2UpLm5hdGlvbjtcbiAgICAgICAgICBpZiAodHlwZSA9PT0gXCJhcm15XCIpIHtcbiAgICAgICAgICAgIHRoaXMudW5pdHMuZ2V0KG5hdGlvbikuZ2V0KHByb3ZpbmNlKS5hcm1pZXMrKztcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy51bml0cy5nZXQobmF0aW9uKS5nZXQocHJvdmluY2UpLmZsZWV0cysrO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLm5hdGlvbnMuZ2V0KG5hdGlvbikudHJlYXN1cnktLTtcbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnN0IHBvdGVudGlhbFByZUludmVzdG9yU2xvdHMgPSBbXG4gICAgICAgICAgXCJtYW5ldXZlcjFcIixcbiAgICAgICAgICBcInByb2R1Y3Rpb24xXCIsXG4gICAgICAgICAgXCJmYWN0b3J5XCIsXG4gICAgICAgICAgXCJ0YXhhdGlvblwiLFxuICAgICAgICAgIFwibWFuZXV2ZXIyXCIsXG4gICAgICAgIF07XG4gICAgICAgIGlmIChcbiAgICAgICAgICBwb3RlbnRpYWxQcmVJbnZlc3RvclNsb3RzLmluY2x1ZGVzKFxuICAgICAgICAgICAgdGhpcy5uYXRpb25zLmdldCh0aGlzLmN1cnJlbnROYXRpb24pLnByZXZpb3VzUm9uZGVsUG9zaXRpb25cbiAgICAgICAgICApXG4gICAgICAgICkge1xuICAgICAgICAgIHRoaXMuZW5kT2ZJbnZlc3RvclR1cm4oKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5oYW5kbGVBZHZhbmNlUGxheWVyKCk7XG4gICAgICAgIHRoaXMuYXZhaWxhYmxlQWN0aW9ucyA9IG5ldyBTZXQodGhpcy5yb25kZWxBY3Rpb25zKHRoaXMuY3VycmVudE5hdGlvbikpO1xuICAgICAgICByZXR1cm47XG4gICAgICBjYXNlIFwibWFuZXV2ZXJcIjpcbiAgICAgICAgY29uc3Qgb3JpZ2luID0gYWN0aW9uLnBheWxvYWQub3JpZ2luO1xuICAgICAgICBjb25zdCBkZXN0aW5hdGlvbiA9IGFjdGlvbi5wYXlsb2FkLmRlc3RpbmF0aW9uO1xuICAgICAgICBjb25zdCB1bml0VHlwZSA9IHRoaXMuYm9hcmQuZ3JhcGguZ2V0KGRlc3RpbmF0aW9uKS5pc09jZWFuXG4gICAgICAgICAgPyBcImZsZWV0XCJcbiAgICAgICAgICA6IFwiYXJteVwiO1xuXG4gICAgICAgIC8vIFVwZGF0ZSBwcm92aW5jZSBmbGFnXG4gICAgICAgIHRoaXMucHJvdmluY2VzLmdldChkZXN0aW5hdGlvbikuZmxhZyA9IHRoaXMuY3VycmVudE5hdGlvbjtcbiAgICAgICAgLy8gVE9ETzogRG8gd2UgcmVhbGx5IHdhbnQgdG8gc3RvcmUgKGFuZCBuZWVkIHRvIHVwZGF0ZSlcbiAgICAgICAgLy8gZmxhZyBjb3VudCBsaWtlIHRoaXM/XG4gICAgICAgIHRoaXMubmF0aW9ucy5nZXQodGhpcy5jdXJyZW50TmF0aW9uKS5mbGFnQ291bnQgKz0gMTtcblxuICAgICAgICAvLyBFeGVjdXRlIHRoZSB1bml0IG1vdmVtZW50XG4gICAgICAgIGlmICh1bml0VHlwZSA9PT0gXCJmbGVldFwiKSB7XG4gICAgICAgICAgdGhpcy51bml0cy5nZXQodGhpcy5jdXJyZW50TmF0aW9uKS5nZXQob3JpZ2luKS5mbGVldHMtLTtcbiAgICAgICAgICB0aGlzLnVuaXRzLmdldCh0aGlzLmN1cnJlbnROYXRpb24pLmdldChkZXN0aW5hdGlvbikuZmxlZXRzKys7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHVuaXRUeXBlID09PSBcImFybXlcIikge1xuICAgICAgICAgIHRoaXMudW5pdHMuZ2V0KHRoaXMuY3VycmVudE5hdGlvbikuZ2V0KG9yaWdpbikuYXJtaWVzLS07XG4gICAgICAgICAgdGhpcy51bml0cy5nZXQodGhpcy5jdXJyZW50TmF0aW9uKS5nZXQoZGVzdGluYXRpb24pLmFybWllcysrO1xuXG4gICAgICAgICAgLy8gRmxlZXRzIGNhbm5vdCBtb3ZlIGFmdGVyIGFybWllcyFcbiAgICAgICAgICB0aGlzLnVuaXRzVG9Nb3ZlID0gdGhpcy51bml0c1RvTW92ZS5maWx0ZXIoXG4gICAgICAgICAgICAoW18sIHR5cGVdKSA9PiB0eXBlID09PSBcImFybXlcIlxuICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBSZW1vdmUgdGhlIHVuaXQgdGhhdCBqdXN0IG1vdmVkIGZyb20gdGhpcy51bml0c1RvTW92ZVxuICAgICAgICBjb25zdCBpID0gdGhpcy51bml0c1RvTW92ZS5maW5kSW5kZXgoXG4gICAgICAgICAgKGFycikgPT4gYXJyWzBdID09PSBhY3Rpb24ucGF5bG9hZC5vcmlnaW4gJiYgYXJyWzFdID09PSB1bml0VHlwZVxuICAgICAgICApO1xuICAgICAgICB0aGlzLnVuaXRzVG9Nb3ZlLnNwbGljZShpLCAxKTtcblxuICAgICAgICAvLyBJbnRlcnJ1cHQgbWFudWV2ZXJzIGluIGNhc2Ugb2YgcG90ZW50aWFsIGNvbmZsaWN0IVxuICAgICAgICBmb3IgKGNvbnN0IFtuYXRpb24sIF9dIG9mIHRoaXMubmF0aW9ucykge1xuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgIG5hdGlvbiAhPT0gdGhpcy5jdXJyZW50TmF0aW9uICYmXG4gICAgICAgICAgICAodGhpcy51bml0cy5nZXQobmF0aW9uKS5nZXQoZGVzdGluYXRpb24pLmFybWllcyA+IDAgfHxcbiAgICAgICAgICAgICAgdGhpcy51bml0cy5nZXQobmF0aW9uKS5nZXQoZGVzdGluYXRpb24pLmZsZWV0cyA+IDApXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICB0aGlzLmF2YWlsYWJsZUFjdGlvbnMgPSBuZXcgU2V0KFtcbiAgICAgICAgICAgICAgQWN0aW9uLmNvZXhpc3Qoe1xuICAgICAgICAgICAgICAgIHByb3ZpbmNlOiBkZXN0aW5hdGlvbixcbiAgICAgICAgICAgICAgICBpbmN1bWJlbnQ6IG5hdGlvbixcbiAgICAgICAgICAgICAgICBjaGFsbGVuZ2VyOiB0aGlzLmN1cnJlbnROYXRpb24sXG4gICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICBBY3Rpb24uZmlnaHQoe1xuICAgICAgICAgICAgICAgIHByb3ZpbmNlOiBkZXN0aW5hdGlvbixcbiAgICAgICAgICAgICAgICBpbmN1bWJlbnQ6IG5hdGlvbixcbiAgICAgICAgICAgICAgICBjaGFsbGVuZ2VyOiB0aGlzLmN1cnJlbnROYXRpb24sXG4gICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgXSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMudW5pdHNUb01vdmUubGVuZ3RoID4gMCkge1xuICAgICAgICAgIGNvbnN0IHByb3ZpbmNlc1dpdGhGbGVldHMgPSBuZXcgTWFwKCk7XG4gICAgICAgICAgY29uc3QgcHJvdmluY2VzV2l0aEFybWllcyA9IG5ldyBNYXAoKTtcbiAgICAgICAgICBjb25zdCBvdXQgPSBuZXcgU2V0KFtBY3Rpb24uZW5kTWFuZXV2ZXIoKV0pO1xuICAgICAgICAgIHRoaXMudW5pdHNUb01vdmUuZm9yRWFjaCgoW29yaWdpbiwgdHlwZV0pID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHVuaXRzID0gdGhpcy51bml0cy5nZXQodGhpcy5jdXJyZW50TmF0aW9uKS5nZXQob3JpZ2luKTtcbiAgICAgICAgICAgIGlmICh1bml0cy5mbGVldHMgPiAwKSB7XG4gICAgICAgICAgICAgIHByb3ZpbmNlc1dpdGhGbGVldHMuc2V0KG9yaWdpbiwgdW5pdHMuZmxlZXRzKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodW5pdHMuYXJtaWVzID4gMCkge1xuICAgICAgICAgICAgICBwcm92aW5jZXNXaXRoQXJtaWVzLnNldChvcmlnaW4sIHVuaXRzLmFybWllcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IgKGNvbnN0IFtvcmlnaW4sIGNvdW50XSBvZiBwcm92aW5jZXNXaXRoRmxlZXRzKSB7XG4gICAgICAgICAgICAgIGZvciAoY29uc3QgZGVzdGluYXRpb24gb2YgdGhpcy5ib2FyZC5uZWlnaGJvcnNGb3Ioe1xuICAgICAgICAgICAgICAgIG9yaWdpbixcbiAgICAgICAgICAgICAgICBuYXRpb246IHRoaXMuY3VycmVudE5hdGlvbixcbiAgICAgICAgICAgICAgICBpc0ZsZWV0OiB0cnVlLFxuICAgICAgICAgICAgICAgIGZyaWVuZGx5RmxlZXRzOiBuZXcgU2V0KCksXG4gICAgICAgICAgICAgIH0pKSB7XG4gICAgICAgICAgICAgICAgb3V0LmFkZChBY3Rpb24ubWFuZXV2ZXIoeyBvcmlnaW4sIGRlc3RpbmF0aW9uIH0pKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgZnJpZW5kbHlGbGVldHMgPSBuZXcgU2V0KCk7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IFtwcm92aW5jZSwgdW5pdHNdIG9mIHRoaXMudW5pdHMuZ2V0KFxuICAgICAgICAgICAgICB0aGlzLmN1cnJlbnROYXRpb25cbiAgICAgICAgICAgICkpIHtcbiAgICAgICAgICAgICAgaWYgKHVuaXRzLmZsZWV0cyA+IDApIHtcbiAgICAgICAgICAgICAgICBmcmllbmRseUZsZWV0cy5hZGQocHJvdmluY2UpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IgKGNvbnN0IFtvcmlnaW4sIGNvdW50XSBvZiBwcm92aW5jZXNXaXRoQXJtaWVzKSB7XG4gICAgICAgICAgICAgIGZvciAoY29uc3QgZGVzdGluYXRpb24gb2YgdGhpcy5ib2FyZC5uZWlnaGJvcnNGb3Ioe1xuICAgICAgICAgICAgICAgIG9yaWdpbixcbiAgICAgICAgICAgICAgICBuYXRpb246IHRoaXMuY3VycmVudE5hdGlvbixcbiAgICAgICAgICAgICAgICBpc0ZsZWV0OiBmYWxzZSxcbiAgICAgICAgICAgICAgICBmcmllbmRseUZsZWV0cyxcbiAgICAgICAgICAgICAgfSkpIHtcbiAgICAgICAgICAgICAgICBvdXQuYWRkKEFjdGlvbi5tYW5ldXZlcih7IG9yaWdpbiwgZGVzdGluYXRpb24gfSkpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgdGhpcy5hdmFpbGFibGVBY3Rpb25zID0gb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgIHRoaXMubmF0aW9ucy5nZXQodGhpcy5jdXJyZW50TmF0aW9uKS5yb25kZWxQb3NpdGlvbiA9PT0gXCJtYW5ldXZlcjJcIlxuICAgICAgICAgICkge1xuICAgICAgICAgICAgY29uc3QgcG90ZW50aWFsUHJlSW52ZXN0b3JTbG90cyA9IFtcbiAgICAgICAgICAgICAgXCJmYWN0b3J5XCIsXG4gICAgICAgICAgICAgIFwicHJvZHVjdGlvbjFcIixcbiAgICAgICAgICAgICAgXCJtYW5ldXZlcjFcIixcbiAgICAgICAgICAgIF07XG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgIHBvdGVudGlhbFByZUludmVzdG9yU2xvdHMuaW5jbHVkZXMoXG4gICAgICAgICAgICAgICAgdGhpcy5uYXRpb25zLmdldCh0aGlzLmN1cnJlbnROYXRpb24pLnByZXZpb3VzUm9uZGVsUG9zaXRpb25cbiAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgIHRoaXMuZW5kT2ZJbnZlc3RvclR1cm4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy5jdXJyZW50TmF0aW9uID0gdGhpcy5uZXh0TmF0aW9uKHRoaXMuY3VycmVudE5hdGlvbik7XG4gICAgICAgICAgdGhpcy5hdmFpbGFibGVBY3Rpb25zID0gbmV3IFNldChcbiAgICAgICAgICAgIHRoaXMucm9uZGVsQWN0aW9ucyh0aGlzLmN1cnJlbnROYXRpb24pXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm47XG4gICAgICBjYXNlIFwicm9uZGVsXCI6XG4gICAgICAgIHRoaXMuY3VycmVudE5hdGlvbiA9IGFjdGlvbi5wYXlsb2FkLm5hdGlvbjtcbiAgICAgICAgdGhpcy5uYXRpb25zLmdldChcbiAgICAgICAgICB0aGlzLmN1cnJlbnROYXRpb25cbiAgICAgICAgKS5wcmV2aW91c1JvbmRlbFBvc2l0aW9uID0gdGhpcy5uYXRpb25zLmdldChcbiAgICAgICAgICB0aGlzLmN1cnJlbnROYXRpb25cbiAgICAgICAgKS5yb25kZWxQb3NpdGlvbjtcbiAgICAgICAgdGhpcy5uYXRpb25zLmdldCh0aGlzLmN1cnJlbnROYXRpb24pLnJvbmRlbFBvc2l0aW9uID1cbiAgICAgICAgICBhY3Rpb24ucGF5bG9hZC5zbG90O1xuICAgICAgICB0aGlzLnBsYXllcnNbdGhpcy5jdXJyZW50UGxheWVyTmFtZV0uY2FzaCAtPSBhY3Rpb24ucGF5bG9hZC5jb3N0O1xuXG4gICAgICAgIHN3aXRjaCAoYWN0aW9uLnBheWxvYWQuc2xvdCkge1xuICAgICAgICAgIGNhc2UgXCJpbnZlc3RvclwiOlxuICAgICAgICAgICAgLy8gMS4gTmF0aW9uIHBheXMgYm9uZC1ob2xkZXJzIGludGVyZXN0XG4gICAgICAgICAgICBmb3IgKGNvbnN0IHBsYXllciBvZiBPYmplY3Qua2V5cyh0aGlzLnBsYXllcnMpKSB7XG4gICAgICAgICAgICAgIGlmIChwbGF5ZXIgIT09IHRoaXMuY3VycmVudFBsYXllck5hbWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnBsYXllckJvbmRzT2ZOYXRpb24ocGxheWVyLCBhY3Rpb24ucGF5bG9hZC5uYXRpb24pLmZvckVhY2goXG4gICAgICAgICAgICAgICAgICAoYm9uZCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgdGhpcy5uYXRpb25zLmdldChhY3Rpb24ucGF5bG9hZC5uYXRpb24pLnRyZWFzdXJ5ID49XG4gICAgICAgICAgICAgICAgICAgICAgYm9uZC5udW1iZXJcbiAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgdGhpcy5uYXRpb25zLmdldChhY3Rpb24ucGF5bG9hZC5uYXRpb24pLnRyZWFzdXJ5IC09XG4gICAgICAgICAgICAgICAgICAgICAgICBib25kLm51bWJlcjtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsYXllcnNbdGhpcy5jdXJyZW50UGxheWVyTmFtZV0uY2FzaCAtPSBib25kLm51bWJlcjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0aGlzLnBsYXllcnNbcGxheWVyXS5jYXNoICs9IGJvbmQubnVtYmVyO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIE5hdGlvbiBwYXlzIGl0cyBjb250cm9sbGVyIGludGVyZXN0XG4gICAgICAgICAgICBjb25zdCBhbW91bnRPd2VkVG9Db250cm9sbGVyID0gW1xuICAgICAgICAgICAgICAuLi50aGlzLnBsYXllcnNbdGhpcy5jdXJyZW50UGxheWVyTmFtZV0uYm9uZHMsXG4gICAgICAgICAgICBdXG4gICAgICAgICAgICAgIC5maWx0ZXIoKGJvbmQpID0+IGJvbmQubmF0aW9uID09PSBhY3Rpb24ucGF5bG9hZC5uYXRpb24pXG4gICAgICAgICAgICAgIC5yZWR1Y2UoKHgsIHkpID0+IHggKyB5Lm51bWJlciwgMCk7XG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgIHRoaXMubmF0aW9ucy5nZXQoYWN0aW9uLnBheWxvYWQubmF0aW9uKS50cmVhc3VyeSA+XG4gICAgICAgICAgICAgIGFtb3VudE93ZWRUb0NvbnRyb2xsZXJcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICB0aGlzLnBsYXllcnNbXG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50UGxheWVyTmFtZVxuICAgICAgICAgICAgICBdLmNhc2ggKz0gYW1vdW50T3dlZFRvQ29udHJvbGxlcjtcbiAgICAgICAgICAgICAgdGhpcy5uYXRpb25zLmdldChcbiAgICAgICAgICAgICAgICBhY3Rpb24ucGF5bG9hZC5uYXRpb25cbiAgICAgICAgICAgICAgKS50cmVhc3VyeSAtPSBhbW91bnRPd2VkVG9Db250cm9sbGVyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5lbmRPZkludmVzdG9yVHVybigpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIGNhc2UgXCJpbXBvcnRcIjpcbiAgICAgICAgICAgIGNvbnN0IGF2YWlsYWJsZUFjdGlvbnMgPSBuZXcgU2V0KFtcbiAgICAgICAgICAgICAgQWN0aW9uLmltcG9ydCh7IHBsYWNlbWVudHM6IFtdIH0pLFxuICAgICAgICAgICAgXSk7XG4gICAgICAgICAgICBjb25zdCBob21lUHJvdmluY2VzID0gdGhpcy5ib2FyZC5ieU5hdGlvbi5nZXQoXG4gICAgICAgICAgICAgIGFjdGlvbi5wYXlsb2FkLm5hdGlvblxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGZvciAoY29uc3QgcHJvdmluY2Ugb2YgaG9tZVByb3ZpbmNlcykge1xuICAgICAgICAgICAgICBhdmFpbGFibGVBY3Rpb25zLmFkZChcbiAgICAgICAgICAgICAgICBBY3Rpb24uaW1wb3J0KHsgcGxhY2VtZW50czogW3sgcHJvdmluY2UsIHR5cGU6IFwiYXJteVwiIH1dIH0pXG4gICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgZm9yIChjb25zdCBwcm92aW5jZTIgb2YgaG9tZVByb3ZpbmNlcykge1xuICAgICAgICAgICAgICAgIGlmIChwcm92aW5jZTIgPT09IHByb3ZpbmNlKSBjb250aW51ZTtcblxuICAgICAgICAgICAgICAgIGF2YWlsYWJsZUFjdGlvbnMuYWRkKFxuICAgICAgICAgICAgICAgICAgQWN0aW9uLmltcG9ydCh7XG4gICAgICAgICAgICAgICAgICAgIHBsYWNlbWVudHM6IFtcbiAgICAgICAgICAgICAgICAgICAgICB7IHByb3ZpbmNlLCB0eXBlOiBcImFybXlcIiB9LFxuICAgICAgICAgICAgICAgICAgICAgIHsgcHJvdmluY2U6IHByb3ZpbmNlMiwgdHlwZTogXCJhcm15XCIgfSxcbiAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgcHJvdmluY2UzIG9mIGhvbWVQcm92aW5jZXMpIHtcbiAgICAgICAgICAgICAgICAgIGlmIChwcm92aW5jZSA9PT0gcHJvdmluY2UzIHx8IHByb3ZpbmNlMiA9PT0gcHJvdmluY2UzKVxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcblxuICAgICAgICAgICAgICAgICAgYXZhaWxhYmxlQWN0aW9ucy5hZGQoXG4gICAgICAgICAgICAgICAgICAgIEFjdGlvbi5pbXBvcnQoe1xuICAgICAgICAgICAgICAgICAgICAgIHBsYWNlbWVudHM6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgIHsgcHJvdmluY2UsIHR5cGU6IFwiYXJteVwiIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB7IHByb3ZpbmNlOiBwcm92aW5jZTIsIHR5cGU6IFwiYXJteVwiIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB7IHByb3ZpbmNlOiBwcm92aW5jZTMsIHR5cGU6IFwiYXJteVwiIH0sXG4gICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmF2YWlsYWJsZUFjdGlvbnMgPSBhdmFpbGFibGVBY3Rpb25zO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIGNhc2UgXCJwcm9kdWN0aW9uMVwiOlxuICAgICAgICAgIGNhc2UgXCJwcm9kdWN0aW9uMlwiOlxuICAgICAgICAgICAgQXJyYXkuZnJvbSh0aGlzLmJvYXJkLmJ5TmF0aW9uLmdldChhY3Rpb24ucGF5bG9hZC5uYXRpb24pKVxuICAgICAgICAgICAgICAuZmlsdGVyKFxuICAgICAgICAgICAgICAgIChwcm92aW5jZSkgPT4gdGhpcy5wcm92aW5jZXMuZ2V0KHByb3ZpbmNlKS5mYWN0b3J5ICE9PSBudWxsXG4gICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgLmZvckVhY2goKHByb3ZpbmNlKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucHJvdmluY2VzLmdldChwcm92aW5jZSkuZmFjdG9yeSA9PT0gXCJzaGlweWFyZFwiKSB7XG4gICAgICAgICAgICAgICAgICB0aGlzLnVuaXRzLmdldChhY3Rpb24ucGF5bG9hZC5uYXRpb24pLmdldChwcm92aW5jZSkuZmxlZXRzKys7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIHRoaXMudW5pdHMuZ2V0KGFjdGlvbi5wYXlsb2FkLm5hdGlvbikuZ2V0KHByb3ZpbmNlKS5hcm1pZXMrKztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKGFjdGlvbi5wYXlsb2FkLnNsb3QgPT09IFwicHJvZHVjdGlvbjJcIikge1xuICAgICAgICAgICAgICBjb25zdCBwb3RlbnRpYWxQcmVJbnZlc3RvclNsb3RzID0gW1xuICAgICAgICAgICAgICAgIFwibWFuZXV2ZXIxXCIsXG4gICAgICAgICAgICAgICAgXCJwcm9kdWN0aW9uMVwiLFxuICAgICAgICAgICAgICAgIFwiZmFjdG9yeVwiLFxuICAgICAgICAgICAgICAgIFwidGF4YXRpb25cIixcbiAgICAgICAgICAgICAgXTtcbiAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIHBvdGVudGlhbFByZUludmVzdG9yU2xvdHMuaW5jbHVkZXMoXG4gICAgICAgICAgICAgICAgICB0aGlzLm5hdGlvbnMuZ2V0KHRoaXMuY3VycmVudE5hdGlvbikucHJldmlvdXNSb25kZWxQb3NpdGlvblxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbmRPZkludmVzdG9yVHVybigpO1xuICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlQWR2YW5jZVBsYXllcigpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5oYW5kbGVBZHZhbmNlUGxheWVyKCk7XG4gICAgICAgICAgICB0aGlzLmF2YWlsYWJsZUFjdGlvbnMgPSBuZXcgU2V0KFxuICAgICAgICAgICAgICB0aGlzLnJvbmRlbEFjdGlvbnModGhpcy5jdXJyZW50TmF0aW9uKVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIGNhc2UgXCJ0YXhhdGlvblwiOlxuICAgICAgICAgICAgY29uc3QgbmF0aW9uTmFtZSA9IGFjdGlvbi5wYXlsb2FkLm5hdGlvbjtcbiAgICAgICAgICAgIGNvbnN0IG5hdGlvbiA9IHRoaXMubmF0aW9ucy5nZXQobmF0aW9uTmFtZSk7XG4gICAgICAgICAgICBjb25zdCB0YXhlcyA9IHRoaXMuZmFjdG9yeUNvdW50KG5hdGlvbk5hbWUpICogMiArIG5hdGlvbi5mbGFnQ291bnQ7XG4gICAgICAgICAgICBuYXRpb24udHJlYXN1cnkgKz0gdGF4ZXMgLSB0aGlzLnVuaXRDb3VudChuYXRpb25OYW1lKTtcblxuICAgICAgICAgICAgdGhpcy5wbGF5ZXJzW3RoaXMubmF0aW9ucy5nZXQobmF0aW9uTmFtZSkuY29udHJvbGxlcl0uY2FzaCArPVxuICAgICAgICAgICAgICB0YXhlcyAtIG5hdGlvbi50YXhDaGFydFBvc2l0aW9uO1xuICAgICAgICAgICAgbmF0aW9uLnRheENoYXJ0UG9zaXRpb24gPSB0YXhlcztcbiAgICAgICAgICAgIGlmICh0YXhlcyA9PT0gNikge1xuICAgICAgICAgICAgICBuYXRpb24ucG93ZXJQb2ludHMgKz0gMTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIG5hdGlvbi5wb3dlclBvaW50cyArPSAzO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5hdmFpbGFibGVBY3Rpb25zID0gbmV3IFNldChcbiAgICAgICAgICAgICAgdGhpcy5yb25kZWxBY3Rpb25zKHRoaXMubmV4dE5hdGlvbih0aGlzLmN1cnJlbnROYXRpb24pKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGNvbnN0IHBvdGVudGlhbFByZUludmVzdG9yU2xvdHMgPSBbXCJtYW5ldXZlcjFcIiwgXCJwcm9kdWN0aW9uMVwiXTtcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgcG90ZW50aWFsUHJlSW52ZXN0b3JTbG90cy5pbmNsdWRlcyhcbiAgICAgICAgICAgICAgICB0aGlzLm5hdGlvbnMuZ2V0KHRoaXMuY3VycmVudE5hdGlvbikucHJldmlvdXNSb25kZWxQb3NpdGlvblxuICAgICAgICAgICAgICApXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgdGhpcy5lbmRPZkludmVzdG9yVHVybigpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIGNhc2UgXCJtYW5ldXZlcjFcIjpcbiAgICAgICAgICBjYXNlIFwibWFuZXV2ZXIyXCI6XG4gICAgICAgICAgICBjb25zdCBkZXN0aW5hdGlvbnMgPSBuZXcgU2V0KFtBY3Rpb24uZW5kTWFuZXV2ZXIoKV0pO1xuXG4gICAgICAgICAgICAvLyBDb2xsZWN0IGFsbCB1bml0cyB0aGF0IGFyZSBhbGxvd2VkIHRvIG1vdmUgb24gdGhpcyB0dXJuXG4gICAgICAgICAgICB0aGlzLnVuaXRzVG9Nb3ZlID0gW107XG4gICAgICAgICAgICBmb3IgKGNvbnN0IFtwcm92aW5jZSwgdW5pdHNdIG9mIHRoaXMudW5pdHMuZ2V0KFxuICAgICAgICAgICAgICBhY3Rpb24ucGF5bG9hZC5uYXRpb25cbiAgICAgICAgICAgICkpIHtcbiAgICAgICAgICAgICAgbGV0IGZsZWV0Q291bnQgPSB1bml0cy5mbGVldHM7XG4gICAgICAgICAgICAgIGxldCBhcm15Q291bnQgPSB1bml0cy5hcm1pZXM7XG4gICAgICAgICAgICAgIHdoaWxlIChmbGVldENvdW50ID4gMCB8fCBhcm15Q291bnQgPiAwKSB7XG4gICAgICAgICAgICAgICAgaWYgKGZsZWV0Q291bnQgPiAwKSB7XG4gICAgICAgICAgICAgICAgICB0aGlzLnVuaXRzVG9Nb3ZlLnB1c2goW3Byb3ZpbmNlLCBcImZsZWV0XCJdKTtcbiAgICAgICAgICAgICAgICAgIGZsZWV0Q291bnQtLTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGFybXlDb3VudCA+IDApIHtcbiAgICAgICAgICAgICAgICAgIHRoaXMudW5pdHNUb01vdmUucHVzaChbcHJvdmluY2UsIFwiYXJteVwiXSk7XG4gICAgICAgICAgICAgICAgICBhcm15Q291bnQtLTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgcHJvdmluY2VzV2l0aEZsZWV0cyA9IG5ldyBNYXAoKTtcbiAgICAgICAgICAgIGNvbnN0IHByb3ZpbmNlc1dpdGhBcm1pZXMgPSBuZXcgTWFwKCk7XG5cbiAgICAgICAgICAgIGZvciAoY29uc3QgW3Byb3ZpbmNlLCB1bml0c10gb2YgdGhpcy51bml0cy5nZXQoXG4gICAgICAgICAgICAgIGFjdGlvbi5wYXlsb2FkLm5hdGlvblxuICAgICAgICAgICAgKSkge1xuICAgICAgICAgICAgICBpZiAodW5pdHMuZmxlZXRzID4gMCkge1xuICAgICAgICAgICAgICAgIHByb3ZpbmNlc1dpdGhGbGVldHMuc2V0KHByb3ZpbmNlLCB1bml0cy5mbGVldHMpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZvciAoY29uc3QgW29yaWdpbiwgY291bnRdIG9mIHByb3ZpbmNlc1dpdGhGbGVldHMpIHtcbiAgICAgICAgICAgICAgZm9yIChjb25zdCBkZXN0aW5hdGlvbiBvZiB0aGlzLmJvYXJkLm5laWdoYm9yc0Zvcih7XG4gICAgICAgICAgICAgICAgb3JpZ2luLFxuICAgICAgICAgICAgICAgIG5hdGlvbjogYWN0aW9uLnBheWxvYWQubmF0aW9uLFxuICAgICAgICAgICAgICAgIGlzRmxlZXQ6IHRydWUsXG4gICAgICAgICAgICAgICAgZnJpZW5kbHlGbGVldHM6IG5ldyBTZXQoKSxcbiAgICAgICAgICAgICAgfSkpIHtcbiAgICAgICAgICAgICAgICBkZXN0aW5hdGlvbnMuYWRkKFxuICAgICAgICAgICAgICAgICAgQWN0aW9uLm1hbmV1dmVyKHtcbiAgICAgICAgICAgICAgICAgICAgb3JpZ2luLFxuICAgICAgICAgICAgICAgICAgICBkZXN0aW5hdGlvbixcbiAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmb3IgKGNvbnN0IFtwcm92aW5jZSwgdW5pdHNdIG9mIHRoaXMudW5pdHMuZ2V0KFxuICAgICAgICAgICAgICBhY3Rpb24ucGF5bG9hZC5uYXRpb25cbiAgICAgICAgICAgICkpIHtcbiAgICAgICAgICAgICAgaWYgKHVuaXRzLmFybWllcyA+IDApIHtcbiAgICAgICAgICAgICAgICBwcm92aW5jZXNXaXRoQXJtaWVzLnNldChwcm92aW5jZSwgdW5pdHMuYXJtaWVzKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmb3IgKGNvbnN0IFtvcmlnaW4sIGNvdW50XSBvZiBwcm92aW5jZXNXaXRoQXJtaWVzKSB7XG4gICAgICAgICAgICAgIGZvciAoY29uc3QgZGVzdGluYXRpb24gb2YgdGhpcy5ib2FyZC5uZWlnaGJvcnNGb3Ioe1xuICAgICAgICAgICAgICAgIG9yaWdpbixcbiAgICAgICAgICAgICAgICBuYXRpb246IGFjdGlvbi5wYXlsb2FkLm5hdGlvbixcbiAgICAgICAgICAgICAgICBpc0ZsZWV0OiBmYWxzZSxcbiAgICAgICAgICAgICAgICBmcmllbmRseUZsZWV0czogbmV3IFNldCgpLFxuICAgICAgICAgICAgICB9KSkge1xuICAgICAgICAgICAgICAgIGRlc3RpbmF0aW9ucy5hZGQoXG4gICAgICAgICAgICAgICAgICBBY3Rpb24ubWFuZXV2ZXIoe1xuICAgICAgICAgICAgICAgICAgICBvcmlnaW4sXG4gICAgICAgICAgICAgICAgICAgIGRlc3RpbmF0aW9uLFxuICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuYXZhaWxhYmxlQWN0aW9ucyA9IGRlc3RpbmF0aW9ucztcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICBjYXNlIFwiZmFjdG9yeVwiOlxuICAgICAgICAgICAgdGhpcy5hdmFpbGFibGVBY3Rpb25zID0gbmV3IFNldChcbiAgICAgICAgICAgICAgdGhpcy5idWlsZEZhY3RvcnlBY3Rpb24oYWN0aW9uLnBheWxvYWQubmF0aW9uKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGVuZE9mSW52ZXN0b3JUdXJuKCkge1xuICAgIC8vIDIuIEludmVzdG9yIGNhcmQgaG9sZGVyIGdldHMgMm0gY2FzaFxuICAgIHRoaXMucGxheWVyc1t0aGlzLmludmVzdG9yQ2FyZEhvbGRlcl0uY2FzaCArPSAyO1xuICAgIC8vIEludmVzdG9yIGNhcmQgaG9sZGVyIG1heSBidXkgYSBib25kIGJlbG9uZ2luZyB0byB0aGUgbmF0aW9uXG4gICAgdGhpcy5hdmFpbGFibGVBY3Rpb25zID0gbmV3IFNldChcbiAgICAgIFsuLi50aGlzLmF2YWlsYWJsZUJvbmRzXVxuICAgICAgICAuZmlsdGVyKChib25kKSA9PiB7XG4gICAgICAgICAgY29uc3QgcGxheWVyID0gdGhpcy5pbnZlc3RvckNhcmRIb2xkZXI7XG4gICAgICAgICAgY29uc3QgZXhjaGFuZ2VhYmxlQm9uZENvc3RzID0gWy4uLnRoaXMucGxheWVyc1twbGF5ZXJdLmJvbmRzXVxuICAgICAgICAgICAgLmZpbHRlcigoZXhjaGFuZ2VhYmxlQm9uZCkgPT4ge1xuICAgICAgICAgICAgICByZXR1cm4gZXhjaGFuZ2VhYmxlQm9uZC5uYXRpb24gPT09IGJvbmQubmF0aW9uO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5tYXAoKHgpID0+IHguY29zdCk7XG4gICAgICAgICAgY29uc3QgdG9wQm9uZENvc3QgPSBNYXRoLm1heChleGNoYW5nZWFibGVCb25kQ29zdHMpIHx8IDA7XG4gICAgICAgICAgcmV0dXJuIGJvbmQuY29zdCA8PSB0aGlzLnBsYXllcnNbcGxheWVyXS5jYXNoICsgdG9wQm9uZENvc3Q7XG4gICAgICAgIH0pXG4gICAgICAgIC5tYXAoKGJvbmQpID0+IHtcbiAgICAgICAgICByZXR1cm4gQWN0aW9uLmJvbmRQdXJjaGFzZSh7XG4gICAgICAgICAgICBuYXRpb246IGJvbmQubmF0aW9uLFxuICAgICAgICAgICAgcGxheWVyOiB0aGlzLmludmVzdG9yQ2FyZEhvbGRlcixcbiAgICAgICAgICAgIGNvc3Q6IGJvbmQuY29zdCxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSlcbiAgICApO1xuICAgIC8vIFRPRE86IDMuIEludmVzdGluZyB3aXRob3V0IGEgZmxhZ1xuICB9XG5cbiAgcGxheWVyQm9uZHNPZk5hdGlvbihwbGF5ZXIsIG5hdGlvbikge1xuICAgIGNvbnN0IG91dCA9IFtdO1xuICAgIGZvciAoY29uc3QgYm9uZCBvZiB0aGlzLnBsYXllcnNbcGxheWVyXS5ib25kcykge1xuICAgICAgaWYgKGJvbmQubmF0aW9uID09PSBuYXRpb24pIHtcbiAgICAgICAgb3V0LnB1c2goYm9uZCk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvdXQ7XG4gIH1cblxuICBoYW5kbGVBZHZhbmNlUGxheWVyKCkge1xuICAgIHRoaXMuY3VycmVudE5hdGlvbiA9IHRoaXMubmV4dE5hdGlvbih0aGlzLmN1cnJlbnROYXRpb24pO1xuICAgIHRoaXMuY3VycmVudFBsYXllck5hbWUgPSB0aGlzLm5hdGlvbnMuZ2V0KHRoaXMuY3VycmVudE5hdGlvbikuY29udHJvbGxlcjtcbiAgfVxuXG4gIHB1cmNoYXNlQm9uZChhY3Rpb24pIHtcbiAgICBjb25zdCB1bmNvc3QgPSB7XG4gICAgICAyOiAxLFxuICAgICAgNDogMixcbiAgICAgIDY6IDMsXG4gICAgICA5OiA0LFxuICAgICAgMTI6IDUsXG4gICAgICAxNjogNixcbiAgICAgIDIwOiA3LFxuICAgICAgMjU6IDgsXG4gICAgICAzMDogOSxcbiAgICB9O1xuICAgIGNvbnN0IGJvbmRzID0gdGhpcy5wbGF5ZXJzW2FjdGlvbi5wYXlsb2FkLnBsYXllcl0uYm9uZHM7XG4gICAgaWYgKGFjdGlvbi5wYXlsb2FkLmNvc3QgPiB0aGlzLnBsYXllcnNbYWN0aW9uLnBheWxvYWQucGxheWVyXS5jYXNoKSB7XG4gICAgICBjb25zdCB0cmFkZUluID0gWy4uLmJvbmRzXVxuICAgICAgICAuZmlsdGVyKCh7IG5hdGlvbiB9KSA9PiBuYXRpb24gPT09IGFjdGlvbi5wYXlsb2FkLm5hdGlvbilcbiAgICAgICAgLm1hcCgoeyBjb3N0IH0pID0+IGNvc3QpWzBdO1xuICAgICAgaWYgKHRyYWRlSW4gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgYCR7YWN0aW9uLnBheWxvYWQucGxheWVyfSBkb2VzIG5vdCBoYXZlIGFueSBib25kcyB0byB0cmFkZSBmb3IgJHthY3Rpb24ucGF5bG9hZC5uYXRpb259YFxuICAgICAgICApO1xuICAgICAgfVxuICAgICAgY29uc3QgYm9uZFRvVHJhZGUgPSBCb25kKGFjdGlvbi5wYXlsb2FkLm5hdGlvbiwgdW5jb3N0W3RyYWRlSW5dKTtcbiAgICAgIGNvbnN0IG5ldENvc3QgPSBhY3Rpb24ucGF5bG9hZC5jb3N0IC0gYm9uZFRvVHJhZGUuY29zdDtcbiAgICAgIHRoaXMubmF0aW9ucy5nZXQoYWN0aW9uLnBheWxvYWQubmF0aW9uKS50cmVhc3VyeSArPSBuZXRDb3N0O1xuICAgICAgdGhpcy5hdmFpbGFibGVCb25kcy5hZGQoYm9uZFRvVHJhZGUpO1xuICAgICAgdGhpcy5wbGF5ZXJzW2FjdGlvbi5wYXlsb2FkLnBsYXllcl0uY2FzaCAtPSBuZXRDb3N0O1xuICAgICAgdGhpcy5wbGF5ZXJzW2FjdGlvbi5wYXlsb2FkLnBsYXllcl0uYm9uZHMuZGVsZXRlKGJvbmRUb1RyYWRlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5uYXRpb25zLmdldChhY3Rpb24ucGF5bG9hZC5uYXRpb24pLnRyZWFzdXJ5ICs9IGFjdGlvbi5wYXlsb2FkLmNvc3Q7XG4gICAgICB0aGlzLnBsYXllcnNbYWN0aW9uLnBheWxvYWQucGxheWVyXS5jYXNoIC09IGFjdGlvbi5wYXlsb2FkLmNvc3Q7XG4gICAgfVxuXG4gICAgY29uc3QgbmV3Qm9uZCA9IEJvbmQoYWN0aW9uLnBheWxvYWQubmF0aW9uLCB1bmNvc3RbYWN0aW9uLnBheWxvYWQuY29zdF0pO1xuICAgIGlmICghdGhpcy5hdmFpbGFibGVCb25kcy5oYXMobmV3Qm9uZCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgJHtib25kfSBub3QgYXZhaWxhYmxlYCk7XG4gICAgfVxuICAgIHRoaXMucGxheWVyc1thY3Rpb24ucGF5bG9hZC5wbGF5ZXJdLmJvbmRzLmFkZChuZXdCb25kKTtcbiAgICB0aGlzLmF2YWlsYWJsZUJvbmRzLmRlbGV0ZShuZXdCb25kKTtcblxuICAgIGlmICh0aGlzLm5hdGlvbnMuZ2V0KGFjdGlvbi5wYXlsb2FkLm5hdGlvbikuY29udHJvbGxlciA9PT0gbnVsbCkge1xuICAgICAgdGhpcy5uYXRpb25zLmdldChhY3Rpb24ucGF5bG9hZC5uYXRpb24pLmNvbnRyb2xsZXIgPVxuICAgICAgICBhY3Rpb24ucGF5bG9hZC5wbGF5ZXI7XG4gICAgfVxuXG4gICAgaWYgKFxuICAgICAgdGhpcy50b3RhbEludmVzdG1lbnRJbk5hdGlvbihcbiAgICAgICAgYWN0aW9uLnBheWxvYWQucGxheWVyLFxuICAgICAgICBhY3Rpb24ucGF5bG9hZC5uYXRpb25cbiAgICAgICkgPlxuICAgICAgdGhpcy50b3RhbEludmVzdG1lbnRJbk5hdGlvbihcbiAgICAgICAgdGhpcy5uYXRpb25zLmdldChhY3Rpb24ucGF5bG9hZC5uYXRpb24pLmNvbnRyb2xsZXIsXG4gICAgICAgIGFjdGlvbi5wYXlsb2FkLm5hdGlvblxuICAgICAgKVxuICAgICkge1xuICAgICAgdGhpcy5uYXRpb25zLmdldChhY3Rpb24ucGF5bG9hZC5uYXRpb24pLmNvbnRyb2xsZXIgPVxuICAgICAgICBhY3Rpb24ucGF5bG9hZC5wbGF5ZXI7XG4gICAgfVxuICAgIHRoaXMuYWR2YW5jZUludmVzdG9yQ2FyZCgpO1xuICB9XG5cbiAgdG90YWxJbnZlc3RtZW50SW5OYXRpb24ocGxheWVyLCBuYXRpb24pIHtcbiAgICByZXR1cm4gWy4uLnRoaXMucGxheWVyc1twbGF5ZXJdLmJvbmRzXVxuICAgICAgLmZpbHRlcigoYm9uZCkgPT4gYm9uZC5uYXRpb24gPT09IG5hdGlvbilcbiAgICAgIC5yZWR1Y2UoKHgsIHkpID0+IHggKyB5LmNvc3QsIDApO1xuICB9XG5cbiAgYWR2YW5jZUludmVzdG9yQ2FyZCgpIHtcbiAgICBpZiAoISF0aGlzLmludmVzdG9yQ2FyZEhvbGRlcikge1xuICAgICAgY29uc3QgaW5kZXggPSB0aGlzLm9yZGVyLmluZGV4T2YodGhpcy5pbnZlc3RvckNhcmRIb2xkZXIpO1xuICAgICAgaWYgKGluZGV4ID09PSAwKSB7XG4gICAgICAgIHRoaXMuaW52ZXN0b3JDYXJkSG9sZGVyID0gdGhpcy5vcmRlclt0aGlzLm9yZGVyLmxlbmd0aCAtIDFdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5pbnZlc3RvckNhcmRIb2xkZXIgPSB0aGlzLm9yZGVyW2luZGV4IC0gMV07XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgdW5pdENvdW50KG5hdGlvbikge1xuICAgIGxldCBvdXQgPSAwO1xuICAgIGZvciAoY29uc3QgW3Byb3ZpbmNlLCB1bml0c10gb2YgdGhpcy51bml0cy5nZXQobmF0aW9uKSkge1xuICAgICAgb3V0ICs9IHVuaXRzLmFybWllcztcbiAgICAgIG91dCArPSB1bml0cy5mbGVldHM7XG4gICAgfVxuICAgIHJldHVybiBvdXQ7XG4gIH1cblxuICBidWlsZEZhY3RvcnkoYWN0aW9uKSB7XG4gICAgdGhpcy5wcm92aW5jZXMuZ2V0KGFjdGlvbi5wYXlsb2FkLnByb3ZpbmNlKS5mYWN0b3J5ID0gdGhpcy5ib2FyZC5ncmFwaC5nZXQoXG4gICAgICBhY3Rpb24ucGF5bG9hZC5wcm92aW5jZVxuICAgICkuZmFjdG9yeVR5cGU7XG4gICAgdGhpcy5uYXRpb25zLmdldCh0aGlzLmN1cnJlbnROYXRpb24pLnRyZWFzdXJ5IC09IDU7XG4gIH1cblxuICByb25kZWxBY3Rpb25zKG5hdGlvbikge1xuICAgIGNvbnN0IHJvbmRlbFBvc2l0aW9ucyA9IFtcbiAgICAgIFwiZmFjdG9yeVwiLFxuICAgICAgXCJwcm9kdWN0aW9uMVwiLFxuICAgICAgXCJtYW5ldXZlcjFcIixcbiAgICAgIFwiaW52ZXN0b3JcIixcbiAgICAgIFwiaW1wb3J0XCIsXG4gICAgICBcInByb2R1Y3Rpb24yXCIsXG4gICAgICBcIm1hbmV1dmVyMlwiLFxuICAgICAgXCJ0YXhhdGlvblwiLFxuICAgIF07XG4gICAgY29uc3QgY3VycmVudFBvc2l0aW9uID0gdGhpcy5uYXRpb25zLmdldChuYXRpb24pLnJvbmRlbFBvc2l0aW9uO1xuICAgIGNvbnN0IG91dCA9IG5ldyBTZXQoKTtcbiAgICBpZiAoY3VycmVudFBvc2l0aW9uKSB7XG4gICAgICBjb25zdCBjdXJyZW50SW5kZXggPSByb25kZWxQb3NpdGlvbnMuaW5kZXhPZihjdXJyZW50UG9zaXRpb24pO1xuICAgICAgY29uc3QgZGlzdGFuY2UgPSBjdXJyZW50SW5kZXggLSA4O1xuICAgICAgW1xuICAgICAgICByb25kZWxQb3NpdGlvbnNbY3VycmVudEluZGV4ICsgMV0gfHwgcm9uZGVsUG9zaXRpb25zW2Rpc3RhbmNlICsgMV0sXG4gICAgICAgIHJvbmRlbFBvc2l0aW9uc1tjdXJyZW50SW5kZXggKyAyXSB8fCByb25kZWxQb3NpdGlvbnNbZGlzdGFuY2UgKyAyXSxcbiAgICAgICAgcm9uZGVsUG9zaXRpb25zW2N1cnJlbnRJbmRleCArIDNdIHx8IHJvbmRlbFBvc2l0aW9uc1tkaXN0YW5jZSArIDNdLFxuICAgICAgXS5mb3JFYWNoKChzbG90KSA9PiB7XG4gICAgICAgIG91dC5hZGQoQWN0aW9uLnJvbmRlbCh7IG5hdGlvbiwgY29zdDogMCwgc2xvdCB9KSk7XG4gICAgICB9KTtcbiAgICAgIG91dC5hZGQoXG4gICAgICAgIEFjdGlvbi5yb25kZWwoe1xuICAgICAgICAgIG5hdGlvbixcbiAgICAgICAgICBjb3N0OiAyLFxuICAgICAgICAgIHNsb3Q6XG4gICAgICAgICAgICByb25kZWxQb3NpdGlvbnNbY3VycmVudEluZGV4ICsgNF0gfHwgcm9uZGVsUG9zaXRpb25zW2Rpc3RhbmNlICsgNF0sXG4gICAgICAgIH0pXG4gICAgICApO1xuICAgICAgb3V0LmFkZChcbiAgICAgICAgQWN0aW9uLnJvbmRlbCh7XG4gICAgICAgICAgbmF0aW9uLFxuICAgICAgICAgIGNvc3Q6IDQsXG4gICAgICAgICAgc2xvdDpcbiAgICAgICAgICAgIHJvbmRlbFBvc2l0aW9uc1tjdXJyZW50SW5kZXggKyA1XSB8fCByb25kZWxQb3NpdGlvbnNbZGlzdGFuY2UgKyA1XSxcbiAgICAgICAgfSlcbiAgICAgICk7XG4gICAgICBvdXQuYWRkKFxuICAgICAgICBBY3Rpb24ucm9uZGVsKHtcbiAgICAgICAgICBuYXRpb24sXG4gICAgICAgICAgY29zdDogNixcbiAgICAgICAgICBzbG90OlxuICAgICAgICAgICAgcm9uZGVsUG9zaXRpb25zW2N1cnJlbnRJbmRleCArIDZdIHx8IHJvbmRlbFBvc2l0aW9uc1tkaXN0YW5jZSArIDZdLFxuICAgICAgICB9KVxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcm9uZGVsUG9zaXRpb25zLmZvckVhY2goKHNsb3QpID0+IHtcbiAgICAgICAgb3V0LmFkZChBY3Rpb24ucm9uZGVsKHsgbmF0aW9uLCBjb3N0OiAwLCBzbG90IH0pKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gb3V0O1xuICB9XG5cbiAgbmV4dE5hdGlvbihsYXN0VHVybk5hdGlvbikge1xuICAgIGNvbnN0IG5leHROYXRpb24gPSBsYXN0VHVybk5hdGlvbi53aGVuKHtcbiAgICAgIEFIOiAoKSA9PiBOYXRpb24uSVQsXG4gICAgICBJVDogKCkgPT4gTmF0aW9uLkZSLFxuICAgICAgRlI6ICgpID0+IE5hdGlvbi5HQixcbiAgICAgIEdCOiAoKSA9PiBOYXRpb24uR0UsXG4gICAgICBHRTogKCkgPT4gTmF0aW9uLlJVLFxuICAgICAgUlU6ICgpID0+IE5hdGlvbi5BSCxcbiAgICB9KTtcbiAgICBpZiAodGhpcy5uYXRpb25zLmdldChuZXh0TmF0aW9uKS5jb250cm9sbGVyKSB7XG4gICAgICByZXR1cm4gbmV4dE5hdGlvbjtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMubmV4dE5hdGlvbihuZXh0TmF0aW9uKTtcbiAgICB9XG4gIH1cblxuICBpbXBvcnRBY3Rpb24obmF0aW9uKSB7XG4gICAgY29uc3Qgb3V0ID0gbmV3IFNldCgpO1xuICAgIGZvciAoY29uc3QgcHJvdmluY2Ugb2YgdGhpcy5ib2FyZC5ieU5hdGlvbi5nZXQobmF0aW9uKSkge1xuICAgICAgaWYgKHRoaXMuYm9hcmQuZ3JhcGguZ2V0KHByb3ZpbmNlKS5mYWN0b3J5VHlwZSA9PT0gXCJzaGlweWFyZFwiKSB7XG4gICAgICAgIG91dC5hZGQoQWN0aW9uLmltcG9ydCh7IHBsYWNlbWVudHM6IFt7IHByb3ZpbmNlLCB1bml0OiBcImZsZWV0XCIgfV0gfSkpO1xuICAgICAgfVxuICAgICAgb3V0LmFkZChBY3Rpb24uaW1wb3J0KHsgcGxhY2VtZW50czogW3sgcHJvdmluY2UsIHVuaXQ6IFwiYXJteVwiIH1dIH0pKTtcbiAgICB9XG4gICAgcmV0dXJuIG91dDtcbiAgfVxuXG4gIGJ1aWxkRmFjdG9yeUFjdGlvbihuYXRpb24pIHtcbiAgICByZXR1cm4gbmV3IFNldChcbiAgICAgIG5hdGlvblxuICAgICAgICAud2hlbih7XG4gICAgICAgICAgQUg6ICgpID0+IFtcInRyaWVzdGVcIiwgXCJwcmFndWVcIiwgXCJsZW1idXJnXCJdLFxuICAgICAgICAgIElUOiAoKSA9PiBbXCJnZW5vYVwiLCBcInZlbmljZVwiLCBcImZsb3JlbmNlXCJdLFxuICAgICAgICAgIEZSOiAoKSA9PiBbXCJicmVzdFwiLCBcImRpam9uXCIsIFwibWFyc2VpbGxlXCJdLFxuICAgICAgICAgIEdCOiAoKSA9PiBbXCJkdWJsaW5cIiwgXCJzaGVmZmllbGRcIiwgXCJlZGluYnVyZ2hcIl0sXG4gICAgICAgICAgR0U6ICgpID0+IFtcImRhbnppZ1wiLCBcIm11bmljaFwiLCBcImNvbG9nbmVcIl0sXG4gICAgICAgICAgUlU6ICgpID0+IFtcImtpZXZcIiwgXCJzdC4gcGV0ZXJzYnVyZ1wiLCBcIndhcnNhd1wiXSxcbiAgICAgICAgfSlcbiAgICAgICAgLm1hcCgocHJvdmluY2UpID0+IEFjdGlvbi5idWlsZEZhY3RvcnkoeyBwcm92aW5jZSB9KSlcbiAgICApO1xuICB9XG5cbiAgZmFjdG9yeUNvdW50KG5hdGlvbikge1xuICAgIGxldCBjb3VudCA9IDA7XG4gICAgZm9yIChjb25zdCBwcm92aW5jZSBvZiB0aGlzLmJvYXJkLmJ5TmF0aW9uLmdldChuYXRpb24pKSB7XG4gICAgICBpZiAodGhpcy5wcm92aW5jZXMuZ2V0KHByb3ZpbmNlKS5mYWN0b3J5KSB7XG4gICAgICAgIGNvdW50Kys7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBjb3VudDtcbiAgfVxufVxuIiwiY29uc3QgTk9fVkFMVUUgPSBTeW1ib2woXCJOT19WQUxVRVwiKTtcblxuY29uc3QgU0VUX1NUQVJUID0gU3ltYm9sKFwiU0VUX1NUQVJUXCIpO1xuY29uc3QgQVJZX1NUQVJUID0gU3ltYm9sKFwiQVJZX1NUQVJUXCIpO1xuY29uc3QgTUFQX1NUQVJUID0gU3ltYm9sKFwiTUFQX1NUQVJUXCIpO1xuY29uc3QgT0JKX1NUQVJUID0gU3ltYm9sKFwiT0JKX1NUQVJUXCIpO1xuY29uc3QgSVRFUl9FTkQgPSBTeW1ib2woXCJJVEVSX0VORFwiKTtcblxuY2xhc3MgVHJpZSB7XG4gIGNvbnN0cnVjdG9yKHZhbHVlKSB7XG4gICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgIHRoaXMuY2hpbGRyZW4gPSBuZXcgTWFwKCk7XG4gIH1cblxuICBnZXRPckluc2VydChwYXRoLCBmbiwgYXJncykge1xuICAgIGlmIChwYXRoLmxlbmd0aCA9PT0gMCkge1xuICAgICAgaWYgKHRoaXMudmFsdWUgPT09IE5PX1ZBTFVFKSB7XG4gICAgICAgIHRoaXMudmFsdWUgPSBmbiguLi5hcmdzKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLnZhbHVlO1xuICAgIH1cbiAgICBjb25zdCBbaGVhZCwgLi4udGFpbF0gPSBwYXRoO1xuICAgIGlmIChoZWFkIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgIHJldHVybiB0aGlzLmdldE9ySW5zZXJ0KFxuICAgICAgICBbQVJZX1NUQVJULCAuLi5oZWFkLCBJVEVSX0VORCwgLi4udGFpbF0sXG4gICAgICAgIGZuLFxuICAgICAgICBhcmdzXG4gICAgICApO1xuICAgIH1cbiAgICBpZiAoaGVhZCBpbnN0YW5jZW9mIFNldCkge1xuICAgICAgY29uc3QgZW50cmllcyA9IFsuLi5oZWFkXTtcbiAgICAgIGVudHJpZXMuc29ydCgpO1xuICAgICAgcmV0dXJuIHRoaXMuZ2V0T3JJbnNlcnQoXG4gICAgICAgIFtTRVRfU1RBUlQsIC4uLmVudHJpZXMsIElURVJfRU5ELCAuLi50YWlsXSxcbiAgICAgICAgZm4sXG4gICAgICAgIGFyZ3NcbiAgICAgICk7XG4gICAgfVxuICAgIGlmIChoZWFkIGluc3RhbmNlb2YgTWFwKSB7XG4gICAgICBjb25zdCBlbnRyaWVzID0gWy4uLmhlYWQuZW50cmllcygpXS5zb3J0KCk7XG4gICAgICByZXR1cm4gdGhpcy5nZXRPckluc2VydChcbiAgICAgICAgW01BUF9TVEFSVCwgLi4uZW50cmllcywgSVRFUl9FTkQsIC4uLnRhaWxdLFxuICAgICAgICBmbixcbiAgICAgICAgYXJnc1xuICAgICAgKTtcbiAgICB9XG4gICAgaWYgKGhlYWQgaW5zdGFuY2VvZiBPYmplY3QpIHtcbiAgICAgIGNvbnN0IGVudHJpZXMgPSBPYmplY3QuZW50cmllcyhoZWFkKS5zb3J0KCk7XG4gICAgICByZXR1cm4gdGhpcy5nZXRPckluc2VydChcbiAgICAgICAgW09CSl9TVEFSVCwgLi4uZW50cmllcywgSVRFUl9FTkQsIC4uLnRhaWxdLFxuICAgICAgICBmbixcbiAgICAgICAgYXJnc1xuICAgICAgKTtcbiAgICB9XG4gICAgaWYgKCF0aGlzLmNoaWxkcmVuLmhhcyhoZWFkKSkge1xuICAgICAgdGhpcy5jaGlsZHJlbi5zZXQoaGVhZCwgbmV3IFRyaWUoTk9fVkFMVUUpKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuY2hpbGRyZW4uZ2V0KGhlYWQpLmdldE9ySW5zZXJ0KHRhaWwsIGZuLCBhcmdzKTtcbiAgfVxufVxuXG5jb25zdCBtZW1vaXplID0gKGZuKSA9PiB7XG4gIGNvbnN0IG1lbW9yeSA9IG5ldyBUcmllKE5PX1ZBTFVFKTtcblxuICByZXR1cm4gKC4uLmFyZ3MpID0+IG1lbW9yeS5nZXRPckluc2VydChhcmdzLCBmbiwgYXJncyk7XG59O1xuXG5leHBvcnQgeyBtZW1vaXplIH07XG4iLCIvLyBJbXBvcnRzXG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fIGZyb20gXCIuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzXCI7XG52YXIgX19fQ1NTX0xPQURFUl9FWFBPUlRfX18gPSBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18odHJ1ZSk7XG4vLyBNb2R1bGVcbl9fX0NTU19MT0FERVJfRVhQT1JUX19fLnB1c2goW21vZHVsZS5pZCwgXCJidXR0b24ge1xcbiAgYmFja2dyb3VuZDogIzIyNGY0YTtcXG4gIGJvcmRlcjogbm9uZTtcXG4gIGNvbG9yOiB3aGl0ZTtcXG4gIGZvbnQtc2l6ZTogMS41cmVtO1xcbiAgbWFyZ2luOiAwIGF1dG87XFxuICBwYWRkaW5nOiAycmVtO1xcbn1cXG5cXG4uYnV0dG9ucyB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1hcm91bmQ7XFxufVxcblxcbi5ib25kcyB7XFxuICBsaXN0LXN0eWxlOiBub25lO1xcbiAgcGFkZGluZy1sZWZ0OiAwO1xcbn1cXG5cXG51bCB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1hcm91bmQ7XFxuICBsaXN0LXN0eWxlOiBub25lO1xcbiAgcGFkZGluZy1sZWZ0OiAwO1xcbn1cXG5cXG4ucGxheWVyIHtcXG4gIGJhY2tncm91bmQ6ICM5ZGQ3ZDA7XFxuICBwYWRkaW5nOiAzcmVtO1xcbn1cXG5cXG4ucm9uZGVsIHtcXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcXG59XFxuXFxuLmN1cnJlbnRfcGxheWVyIHtcXG4gIGZvbnQtc2l6ZTogM3JlbTtcXG4gIG1hcmdpbi10b3A6IDAuNXJlbTtcXG4gIHBhZGRpbmc6IDFyZW0gMDtcXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gIHRvcDogLTAuMnJlbTtcXG59XFxuXFxuLnNtLWZsYWcge1xcbiAgaGVpZ2h0OiAxcmVtO1xcbn1cXG5cIiwgXCJcIix7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCJzdHlsZS5jc3NcIl0sXCJuYW1lc1wiOltdLFwibWFwcGluZ3NcIjpcIkFBQUE7RUFDRSxtQkFBbUI7RUFDbkIsWUFBWTtFQUNaLFlBQVk7RUFDWixpQkFBaUI7RUFDakIsY0FBYztFQUNkLGFBQWE7QUFDZjs7QUFFQTtFQUNFLGFBQWE7RUFDYiw2QkFBNkI7QUFDL0I7O0FBRUE7RUFDRSxnQkFBZ0I7RUFDaEIsZUFBZTtBQUNqQjs7QUFFQTtFQUNFLGFBQWE7RUFDYiw2QkFBNkI7RUFDN0IsZ0JBQWdCO0VBQ2hCLGVBQWU7QUFDakI7O0FBRUE7RUFDRSxtQkFBbUI7RUFDbkIsYUFBYTtBQUNmOztBQUVBO0VBQ0Usa0JBQWtCO0FBQ3BCOztBQUVBO0VBQ0UsZUFBZTtFQUNmLGtCQUFrQjtFQUNsQixlQUFlO0VBQ2Ysa0JBQWtCO0VBQ2xCLFlBQVk7QUFDZDs7QUFFQTtFQUNFLFlBQVk7QUFDZFwiLFwiZmlsZVwiOlwic3R5bGUuY3NzXCIsXCJzb3VyY2VzQ29udGVudFwiOltcImJ1dHRvbiB7XFxuICBiYWNrZ3JvdW5kOiAjMjI0ZjRhO1xcbiAgYm9yZGVyOiBub25lO1xcbiAgY29sb3I6IHdoaXRlO1xcbiAgZm9udC1zaXplOiAxLjVyZW07XFxuICBtYXJnaW46IDAgYXV0bztcXG4gIHBhZGRpbmc6IDJyZW07XFxufVxcblxcbi5idXR0b25zIHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWFyb3VuZDtcXG59XFxuXFxuLmJvbmRzIHtcXG4gIGxpc3Qtc3R5bGU6IG5vbmU7XFxuICBwYWRkaW5nLWxlZnQ6IDA7XFxufVxcblxcbnVsIHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWFyb3VuZDtcXG4gIGxpc3Qtc3R5bGU6IG5vbmU7XFxuICBwYWRkaW5nLWxlZnQ6IDA7XFxufVxcblxcbi5wbGF5ZXIge1xcbiAgYmFja2dyb3VuZDogIzlkZDdkMDtcXG4gIHBhZGRpbmc6IDNyZW07XFxufVxcblxcbi5yb25kZWwge1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcbn1cXG5cXG4uY3VycmVudF9wbGF5ZXIge1xcbiAgZm9udC1zaXplOiAzcmVtO1xcbiAgbWFyZ2luLXRvcDogMC41cmVtO1xcbiAgcGFkZGluZzogMXJlbSAwO1xcbiAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgdG9wOiAtMC4ycmVtO1xcbn1cXG5cXG4uc20tZmxhZyB7XFxuICBoZWlnaHQ6IDFyZW07XFxufVxcblwiXX1dKTtcbi8vIEV4cG9ydHNcbmV4cG9ydCBkZWZhdWx0IF9fX0NTU19MT0FERVJfRVhQT1JUX19fO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qXG4gIE1JVCBMaWNlbnNlIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG4gIEF1dGhvciBUb2JpYXMgS29wcGVycyBAc29rcmFcbiovXG4vLyBjc3MgYmFzZSBjb2RlLCBpbmplY3RlZCBieSB0aGUgY3NzLWxvYWRlclxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGZ1bmMtbmFtZXNcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHVzZVNvdXJjZU1hcCkge1xuICB2YXIgbGlzdCA9IFtdOyAvLyByZXR1cm4gdGhlIGxpc3Qgb2YgbW9kdWxlcyBhcyBjc3Mgc3RyaW5nXG5cbiAgbGlzdC50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiB0aGlzLm1hcChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgdmFyIGNvbnRlbnQgPSBjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKGl0ZW0sIHVzZVNvdXJjZU1hcCk7XG5cbiAgICAgIGlmIChpdGVtWzJdKSB7XG4gICAgICAgIHJldHVybiBcIkBtZWRpYSBcIi5jb25jYXQoaXRlbVsyXSwgXCIge1wiKS5jb25jYXQoY29udGVudCwgXCJ9XCIpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gY29udGVudDtcbiAgICB9KS5qb2luKCcnKTtcbiAgfTsgLy8gaW1wb3J0IGEgbGlzdCBvZiBtb2R1bGVzIGludG8gdGhlIGxpc3RcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGZ1bmMtbmFtZXNcblxuXG4gIGxpc3QuaSA9IGZ1bmN0aW9uIChtb2R1bGVzLCBtZWRpYVF1ZXJ5LCBkZWR1cGUpIHtcbiAgICBpZiAodHlwZW9mIG1vZHVsZXMgPT09ICdzdHJpbmcnKSB7XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcGFyYW0tcmVhc3NpZ25cbiAgICAgIG1vZHVsZXMgPSBbW251bGwsIG1vZHVsZXMsICcnXV07XG4gICAgfVxuXG4gICAgdmFyIGFscmVhZHlJbXBvcnRlZE1vZHVsZXMgPSB7fTtcblxuICAgIGlmIChkZWR1cGUpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcHJlZmVyLWRlc3RydWN0dXJpbmdcbiAgICAgICAgdmFyIGlkID0gdGhpc1tpXVswXTtcblxuICAgICAgICBpZiAoaWQgIT0gbnVsbCkge1xuICAgICAgICAgIGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaWRdID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBtb2R1bGVzLmxlbmd0aDsgX2krKykge1xuICAgICAgdmFyIGl0ZW0gPSBbXS5jb25jYXQobW9kdWxlc1tfaV0pO1xuXG4gICAgICBpZiAoZGVkdXBlICYmIGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaXRlbVswXV0pIHtcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnRpbnVlXG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAobWVkaWFRdWVyeSkge1xuICAgICAgICBpZiAoIWl0ZW1bMl0pIHtcbiAgICAgICAgICBpdGVtWzJdID0gbWVkaWFRdWVyeTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzJdID0gXCJcIi5jb25jYXQobWVkaWFRdWVyeSwgXCIgYW5kIFwiKS5jb25jYXQoaXRlbVsyXSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgbGlzdC5wdXNoKGl0ZW0pO1xuICAgIH1cbiAgfTtcblxuICByZXR1cm4gbGlzdDtcbn07XG5cbmZ1bmN0aW9uIGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcoaXRlbSwgdXNlU291cmNlTWFwKSB7XG4gIHZhciBjb250ZW50ID0gaXRlbVsxXSB8fCAnJzsgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHByZWZlci1kZXN0cnVjdHVyaW5nXG5cbiAgdmFyIGNzc01hcHBpbmcgPSBpdGVtWzNdO1xuXG4gIGlmICghY3NzTWFwcGluZykge1xuICAgIHJldHVybiBjb250ZW50O1xuICB9XG5cbiAgaWYgKHVzZVNvdXJjZU1hcCAmJiB0eXBlb2YgYnRvYSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHZhciBzb3VyY2VNYXBwaW5nID0gdG9Db21tZW50KGNzc01hcHBpbmcpO1xuICAgIHZhciBzb3VyY2VVUkxzID0gY3NzTWFwcGluZy5zb3VyY2VzLm1hcChmdW5jdGlvbiAoc291cmNlKSB7XG4gICAgICByZXR1cm4gXCIvKiMgc291cmNlVVJMPVwiLmNvbmNhdChjc3NNYXBwaW5nLnNvdXJjZVJvb3QgfHwgJycpLmNvbmNhdChzb3VyY2UsIFwiICovXCIpO1xuICAgIH0pO1xuICAgIHJldHVybiBbY29udGVudF0uY29uY2F0KHNvdXJjZVVSTHMpLmNvbmNhdChbc291cmNlTWFwcGluZ10pLmpvaW4oJ1xcbicpO1xuICB9XG5cbiAgcmV0dXJuIFtjb250ZW50XS5qb2luKCdcXG4nKTtcbn0gLy8gQWRhcHRlZCBmcm9tIGNvbnZlcnQtc291cmNlLW1hcCAoTUlUKVxuXG5cbmZ1bmN0aW9uIHRvQ29tbWVudChzb3VyY2VNYXApIHtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVuZGVmXG4gIHZhciBiYXNlNjQgPSBidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShzb3VyY2VNYXApKSkpO1xuICB2YXIgZGF0YSA9IFwic291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsXCIuY29uY2F0KGJhc2U2NCk7XG4gIHJldHVybiBcIi8qIyBcIi5jb25jYXQoZGF0YSwgXCIgKi9cIik7XG59IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBpc09sZElFID0gZnVuY3Rpb24gaXNPbGRJRSgpIHtcbiAgdmFyIG1lbW87XG4gIHJldHVybiBmdW5jdGlvbiBtZW1vcml6ZSgpIHtcbiAgICBpZiAodHlwZW9mIG1lbW8gPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAvLyBUZXN0IGZvciBJRSA8PSA5IGFzIHByb3Bvc2VkIGJ5IEJyb3dzZXJoYWNrc1xuICAgICAgLy8gQHNlZSBodHRwOi8vYnJvd3NlcmhhY2tzLmNvbS8jaGFjay1lNzFkODY5MmY2NTMzNDE3M2ZlZTcxNWMyMjJjYjgwNVxuICAgICAgLy8gVGVzdHMgZm9yIGV4aXN0ZW5jZSBvZiBzdGFuZGFyZCBnbG9iYWxzIGlzIHRvIGFsbG93IHN0eWxlLWxvYWRlclxuICAgICAgLy8gdG8gb3BlcmF0ZSBjb3JyZWN0bHkgaW50byBub24tc3RhbmRhcmQgZW52aXJvbm1lbnRzXG4gICAgICAvLyBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS93ZWJwYWNrLWNvbnRyaWIvc3R5bGUtbG9hZGVyL2lzc3Vlcy8xNzdcbiAgICAgIG1lbW8gPSBCb29sZWFuKHdpbmRvdyAmJiBkb2N1bWVudCAmJiBkb2N1bWVudC5hbGwgJiYgIXdpbmRvdy5hdG9iKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbWVtbztcbiAgfTtcbn0oKTtcblxudmFyIGdldFRhcmdldCA9IGZ1bmN0aW9uIGdldFRhcmdldCgpIHtcbiAgdmFyIG1lbW8gPSB7fTtcbiAgcmV0dXJuIGZ1bmN0aW9uIG1lbW9yaXplKHRhcmdldCkge1xuICAgIGlmICh0eXBlb2YgbWVtb1t0YXJnZXRdID09PSAndW5kZWZpbmVkJykge1xuICAgICAgdmFyIHN0eWxlVGFyZ2V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0YXJnZXQpOyAvLyBTcGVjaWFsIGNhc2UgdG8gcmV0dXJuIGhlYWQgb2YgaWZyYW1lIGluc3RlYWQgb2YgaWZyYW1lIGl0c2VsZlxuXG4gICAgICBpZiAod2luZG93LkhUTUxJRnJhbWVFbGVtZW50ICYmIHN0eWxlVGFyZ2V0IGluc3RhbmNlb2Ygd2luZG93LkhUTUxJRnJhbWVFbGVtZW50KSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgLy8gVGhpcyB3aWxsIHRocm93IGFuIGV4Y2VwdGlvbiBpZiBhY2Nlc3MgdG8gaWZyYW1lIGlzIGJsb2NrZWRcbiAgICAgICAgICAvLyBkdWUgdG8gY3Jvc3Mtb3JpZ2luIHJlc3RyaWN0aW9uc1xuICAgICAgICAgIHN0eWxlVGFyZ2V0ID0gc3R5bGVUYXJnZXQuY29udGVudERvY3VtZW50LmhlYWQ7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAvLyBpc3RhbmJ1bCBpZ25vcmUgbmV4dFxuICAgICAgICAgIHN0eWxlVGFyZ2V0ID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBtZW1vW3RhcmdldF0gPSBzdHlsZVRhcmdldDtcbiAgICB9XG5cbiAgICByZXR1cm4gbWVtb1t0YXJnZXRdO1xuICB9O1xufSgpO1xuXG52YXIgc3R5bGVzSW5Eb20gPSBbXTtcblxuZnVuY3Rpb24gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcikge1xuICB2YXIgcmVzdWx0ID0gLTE7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHlsZXNJbkRvbS5sZW5ndGg7IGkrKykge1xuICAgIGlmIChzdHlsZXNJbkRvbVtpXS5pZGVudGlmaWVyID09PSBpZGVudGlmaWVyKSB7XG4gICAgICByZXN1bHQgPSBpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZnVuY3Rpb24gbW9kdWxlc1RvRG9tKGxpc3QsIG9wdGlvbnMpIHtcbiAgdmFyIGlkQ291bnRNYXAgPSB7fTtcbiAgdmFyIGlkZW50aWZpZXJzID0gW107XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGl0ZW0gPSBsaXN0W2ldO1xuICAgIHZhciBpZCA9IG9wdGlvbnMuYmFzZSA/IGl0ZW1bMF0gKyBvcHRpb25zLmJhc2UgOiBpdGVtWzBdO1xuICAgIHZhciBjb3VudCA9IGlkQ291bnRNYXBbaWRdIHx8IDA7XG4gICAgdmFyIGlkZW50aWZpZXIgPSBcIlwiLmNvbmNhdChpZCwgXCIgXCIpLmNvbmNhdChjb3VudCk7XG4gICAgaWRDb3VudE1hcFtpZF0gPSBjb3VudCArIDE7XG4gICAgdmFyIGluZGV4ID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcik7XG4gICAgdmFyIG9iaiA9IHtcbiAgICAgIGNzczogaXRlbVsxXSxcbiAgICAgIG1lZGlhOiBpdGVtWzJdLFxuICAgICAgc291cmNlTWFwOiBpdGVtWzNdXG4gICAgfTtcblxuICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgIHN0eWxlc0luRG9tW2luZGV4XS5yZWZlcmVuY2VzKys7XG4gICAgICBzdHlsZXNJbkRvbVtpbmRleF0udXBkYXRlcihvYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdHlsZXNJbkRvbS5wdXNoKHtcbiAgICAgICAgaWRlbnRpZmllcjogaWRlbnRpZmllcixcbiAgICAgICAgdXBkYXRlcjogYWRkU3R5bGUob2JqLCBvcHRpb25zKSxcbiAgICAgICAgcmVmZXJlbmNlczogMVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWRlbnRpZmllcnMucHVzaChpZGVudGlmaWVyKTtcbiAgfVxuXG4gIHJldHVybiBpZGVudGlmaWVycztcbn1cblxuZnVuY3Rpb24gaW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMpIHtcbiAgdmFyIHN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbiAgdmFyIGF0dHJpYnV0ZXMgPSBvcHRpb25zLmF0dHJpYnV0ZXMgfHwge307XG5cbiAgaWYgKHR5cGVvZiBhdHRyaWJ1dGVzLm5vbmNlID09PSAndW5kZWZpbmVkJykge1xuICAgIHZhciBub25jZSA9IHR5cGVvZiBfX3dlYnBhY2tfbm9uY2VfXyAhPT0gJ3VuZGVmaW5lZCcgPyBfX3dlYnBhY2tfbm9uY2VfXyA6IG51bGw7XG5cbiAgICBpZiAobm9uY2UpIHtcbiAgICAgIGF0dHJpYnV0ZXMubm9uY2UgPSBub25jZTtcbiAgICB9XG4gIH1cblxuICBPYmplY3Qua2V5cyhhdHRyaWJ1dGVzKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICBzdHlsZS5zZXRBdHRyaWJ1dGUoa2V5LCBhdHRyaWJ1dGVzW2tleV0pO1xuICB9KTtcblxuICBpZiAodHlwZW9mIG9wdGlvbnMuaW5zZXJ0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgb3B0aW9ucy5pbnNlcnQoc3R5bGUpO1xuICB9IGVsc2Uge1xuICAgIHZhciB0YXJnZXQgPSBnZXRUYXJnZXQob3B0aW9ucy5pbnNlcnQgfHwgJ2hlYWQnKTtcblxuICAgIGlmICghdGFyZ2V0KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDb3VsZG4ndCBmaW5kIGEgc3R5bGUgdGFyZ2V0LiBUaGlzIHByb2JhYmx5IG1lYW5zIHRoYXQgdGhlIHZhbHVlIGZvciB0aGUgJ2luc2VydCcgcGFyYW1ldGVyIGlzIGludmFsaWQuXCIpO1xuICAgIH1cblxuICAgIHRhcmdldC5hcHBlbmRDaGlsZChzdHlsZSk7XG4gIH1cblxuICByZXR1cm4gc3R5bGU7XG59XG5cbmZ1bmN0aW9uIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZSkge1xuICAvLyBpc3RhbmJ1bCBpZ25vcmUgaWZcbiAgaWYgKHN0eWxlLnBhcmVudE5vZGUgPT09IG51bGwpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBzdHlsZS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHN0eWxlKTtcbn1cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuXG5cbnZhciByZXBsYWNlVGV4dCA9IGZ1bmN0aW9uIHJlcGxhY2VUZXh0KCkge1xuICB2YXIgdGV4dFN0b3JlID0gW107XG4gIHJldHVybiBmdW5jdGlvbiByZXBsYWNlKGluZGV4LCByZXBsYWNlbWVudCkge1xuICAgIHRleHRTdG9yZVtpbmRleF0gPSByZXBsYWNlbWVudDtcbiAgICByZXR1cm4gdGV4dFN0b3JlLmZpbHRlcihCb29sZWFuKS5qb2luKCdcXG4nKTtcbiAgfTtcbn0oKTtcblxuZnVuY3Rpb24gYXBwbHlUb1NpbmdsZXRvblRhZyhzdHlsZSwgaW5kZXgsIHJlbW92ZSwgb2JqKSB7XG4gIHZhciBjc3MgPSByZW1vdmUgPyAnJyA6IG9iai5tZWRpYSA/IFwiQG1lZGlhIFwiLmNvbmNhdChvYmoubWVkaWEsIFwiIHtcIikuY29uY2F0KG9iai5jc3MsIFwifVwiKSA6IG9iai5jc3M7IC8vIEZvciBvbGQgSUVcblxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgICovXG5cbiAgaWYgKHN0eWxlLnN0eWxlU2hlZXQpIHtcbiAgICBzdHlsZS5zdHlsZVNoZWV0LmNzc1RleHQgPSByZXBsYWNlVGV4dChpbmRleCwgY3NzKTtcbiAgfSBlbHNlIHtcbiAgICB2YXIgY3NzTm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcyk7XG4gICAgdmFyIGNoaWxkTm9kZXMgPSBzdHlsZS5jaGlsZE5vZGVzO1xuXG4gICAgaWYgKGNoaWxkTm9kZXNbaW5kZXhdKSB7XG4gICAgICBzdHlsZS5yZW1vdmVDaGlsZChjaGlsZE5vZGVzW2luZGV4XSk7XG4gICAgfVxuXG4gICAgaWYgKGNoaWxkTm9kZXMubGVuZ3RoKSB7XG4gICAgICBzdHlsZS5pbnNlcnRCZWZvcmUoY3NzTm9kZSwgY2hpbGROb2Rlc1tpbmRleF0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdHlsZS5hcHBlbmRDaGlsZChjc3NOb2RlKTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gYXBwbHlUb1RhZyhzdHlsZSwgb3B0aW9ucywgb2JqKSB7XG4gIHZhciBjc3MgPSBvYmouY3NzO1xuICB2YXIgbWVkaWEgPSBvYmoubWVkaWE7XG4gIHZhciBzb3VyY2VNYXAgPSBvYmouc291cmNlTWFwO1xuXG4gIGlmIChtZWRpYSkge1xuICAgIHN0eWxlLnNldEF0dHJpYnV0ZSgnbWVkaWEnLCBtZWRpYSk7XG4gIH0gZWxzZSB7XG4gICAgc3R5bGUucmVtb3ZlQXR0cmlidXRlKCdtZWRpYScpO1xuICB9XG5cbiAgaWYgKHNvdXJjZU1hcCAmJiBidG9hKSB7XG4gICAgY3NzICs9IFwiXFxuLyojIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxcIi5jb25jYXQoYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoc291cmNlTWFwKSkpKSwgXCIgKi9cIik7XG4gIH0gLy8gRm9yIG9sZCBJRVxuXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAgKi9cblxuXG4gIGlmIChzdHlsZS5zdHlsZVNoZWV0KSB7XG4gICAgc3R5bGUuc3R5bGVTaGVldC5jc3NUZXh0ID0gY3NzO1xuICB9IGVsc2Uge1xuICAgIHdoaWxlIChzdHlsZS5maXJzdENoaWxkKSB7XG4gICAgICBzdHlsZS5yZW1vdmVDaGlsZChzdHlsZS5maXJzdENoaWxkKTtcbiAgICB9XG5cbiAgICBzdHlsZS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpKTtcbiAgfVxufVxuXG52YXIgc2luZ2xldG9uID0gbnVsbDtcbnZhciBzaW5nbGV0b25Db3VudGVyID0gMDtcblxuZnVuY3Rpb24gYWRkU3R5bGUob2JqLCBvcHRpb25zKSB7XG4gIHZhciBzdHlsZTtcbiAgdmFyIHVwZGF0ZTtcbiAgdmFyIHJlbW92ZTtcblxuICBpZiAob3B0aW9ucy5zaW5nbGV0b24pIHtcbiAgICB2YXIgc3R5bGVJbmRleCA9IHNpbmdsZXRvbkNvdW50ZXIrKztcbiAgICBzdHlsZSA9IHNpbmdsZXRvbiB8fCAoc2luZ2xldG9uID0gaW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMpKTtcbiAgICB1cGRhdGUgPSBhcHBseVRvU2luZ2xldG9uVGFnLmJpbmQobnVsbCwgc3R5bGUsIHN0eWxlSW5kZXgsIGZhbHNlKTtcbiAgICByZW1vdmUgPSBhcHBseVRvU2luZ2xldG9uVGFnLmJpbmQobnVsbCwgc3R5bGUsIHN0eWxlSW5kZXgsIHRydWUpO1xuICB9IGVsc2Uge1xuICAgIHN0eWxlID0gaW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMpO1xuICAgIHVwZGF0ZSA9IGFwcGx5VG9UYWcuYmluZChudWxsLCBzdHlsZSwgb3B0aW9ucyk7XG5cbiAgICByZW1vdmUgPSBmdW5jdGlvbiByZW1vdmUoKSB7XG4gICAgICByZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGUpO1xuICAgIH07XG4gIH1cblxuICB1cGRhdGUob2JqKTtcbiAgcmV0dXJuIGZ1bmN0aW9uIHVwZGF0ZVN0eWxlKG5ld09iaikge1xuICAgIGlmIChuZXdPYmopIHtcbiAgICAgIGlmIChuZXdPYmouY3NzID09PSBvYmouY3NzICYmIG5ld09iai5tZWRpYSA9PT0gb2JqLm1lZGlhICYmIG5ld09iai5zb3VyY2VNYXAgPT09IG9iai5zb3VyY2VNYXApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB1cGRhdGUob2JqID0gbmV3T2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVtb3ZlKCk7XG4gICAgfVxuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChsaXN0LCBvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9OyAvLyBGb3JjZSBzaW5nbGUtdGFnIHNvbHV0aW9uIG9uIElFNi05LCB3aGljaCBoYXMgYSBoYXJkIGxpbWl0IG9uIHRoZSAjIG9mIDxzdHlsZT5cbiAgLy8gdGFncyBpdCB3aWxsIGFsbG93IG9uIGEgcGFnZVxuXG4gIGlmICghb3B0aW9ucy5zaW5nbGV0b24gJiYgdHlwZW9mIG9wdGlvbnMuc2luZ2xldG9uICE9PSAnYm9vbGVhbicpIHtcbiAgICBvcHRpb25zLnNpbmdsZXRvbiA9IGlzT2xkSUUoKTtcbiAgfVxuXG4gIGxpc3QgPSBsaXN0IHx8IFtdO1xuICB2YXIgbGFzdElkZW50aWZpZXJzID0gbW9kdWxlc1RvRG9tKGxpc3QsIG9wdGlvbnMpO1xuICByZXR1cm4gZnVuY3Rpb24gdXBkYXRlKG5ld0xpc3QpIHtcbiAgICBuZXdMaXN0ID0gbmV3TGlzdCB8fCBbXTtcblxuICAgIGlmIChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwobmV3TGlzdCkgIT09ICdbb2JqZWN0IEFycmF5XScpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxhc3RJZGVudGlmaWVycy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGlkZW50aWZpZXIgPSBsYXN0SWRlbnRpZmllcnNbaV07XG4gICAgICB2YXIgaW5kZXggPSBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKTtcbiAgICAgIHN0eWxlc0luRG9tW2luZGV4XS5yZWZlcmVuY2VzLS07XG4gICAgfVxuXG4gICAgdmFyIG5ld0xhc3RJZGVudGlmaWVycyA9IG1vZHVsZXNUb0RvbShuZXdMaXN0LCBvcHRpb25zKTtcblxuICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBsYXN0SWRlbnRpZmllcnMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICB2YXIgX2lkZW50aWZpZXIgPSBsYXN0SWRlbnRpZmllcnNbX2ldO1xuXG4gICAgICB2YXIgX2luZGV4ID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoX2lkZW50aWZpZXIpO1xuXG4gICAgICBpZiAoc3R5bGVzSW5Eb21bX2luZGV4XS5yZWZlcmVuY2VzID09PSAwKSB7XG4gICAgICAgIHN0eWxlc0luRG9tW19pbmRleF0udXBkYXRlcigpO1xuXG4gICAgICAgIHN0eWxlc0luRG9tLnNwbGljZShfaW5kZXgsIDEpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGxhc3RJZGVudGlmaWVycyA9IG5ld0xhc3RJZGVudGlmaWVycztcbiAgfTtcbn07IiwiaW1wb3J0IHsgTmF0aW9uIH0gZnJvbSBcIi4vY29uc3RhbnRzLmpzXCI7XG5pbXBvcnQgQWN0aW9uIGZyb20gXCIuL2FjdGlvbi5qc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBbXG4gIC8vIHNldHVwXG4gIEFjdGlvbi5pbml0aWFsaXplKHtcbiAgICBwbGF5ZXJzOiBbXG4gICAgICB7IGlkOiBcIkRhbmllbFwiLCBuYXRpb246IE5hdGlvbi5SVSB9LFxuICAgICAgeyBpZDogXCJDbGF1ZGlhXCIsIG5hdGlvbjogTmF0aW9uLkZSIH0sXG4gICAgICB7IGlkOiBcIkJlcnRcIiwgbmF0aW9uOiBOYXRpb24uR0IgfSxcbiAgICAgIHsgaWQ6IFwiQW50b25cIiwgbmF0aW9uOiBOYXRpb24uSVQgfSxcbiAgICBdLFxuICB9KSxcbiAgQWN0aW9uLm5vb3AsXG4gIEFjdGlvbi5ub29wLFxuICBBY3Rpb24ubm9vcCxcbiAgQWN0aW9uLm5vb3AsXG4gIEFjdGlvbi5ub29wLFxuICBBY3Rpb24ubm9vcCxcbiAgQWN0aW9uLm5vb3AsXG4gIEFjdGlvbi5ub29wLFxuICBBY3Rpb24ubm9vcCxcbiAgQWN0aW9uLm5vb3AsXG4gIEFjdGlvbi5ub29wLFxuICBBY3Rpb24ubm9vcCxcbiAgQWN0aW9uLm5vb3AsXG4gIC8vIGZpcnN0IHJvdW5kXG4gIEFjdGlvbi5yb25kZWwoeyBuYXRpb246IE5hdGlvbi5BSCwgY29zdDogMCwgc2xvdDogXCJpbXBvcnRcIiB9KSxcbiAgQWN0aW9uLmltcG9ydCh7XG4gICAgcGxhY2VtZW50czogW1xuICAgICAgeyBwcm92aW5jZTogXCJ0cmllc3RlXCIsIHR5cGU6IFwiZmxlZXRcIiB9LFxuICAgICAgeyBwcm92aW5jZTogXCJsZW1iZXJnXCIsIHR5cGU6IFwiYXJteVwiIH0sXG4gICAgXSxcbiAgfSksXG4gIEFjdGlvbi5ub29wLFxuICBBY3Rpb24ucm9uZGVsKHsgbmF0aW9uOiBOYXRpb24uSVQsIGNvc3Q6IDAsIHNsb3Q6IFwiaW52ZXN0b3JcIiB9KSxcbiAgQWN0aW9uLmJvbmRQdXJjaGFzZSh7IG5hdGlvbjogTmF0aW9uLkdFLCBwbGF5ZXI6IFwiRGFuaWVsXCIsIGNvc3Q6IDQgfSksXG4gIEFjdGlvbi5yb25kZWwoeyBuYXRpb246IE5hdGlvbi5GUiwgY29zdDogMCwgc2xvdDogXCJmYWN0b3J5XCIgfSksXG4gIEFjdGlvbi5idWlsZEZhY3RvcnkoeyBwcm92aW5jZTogXCJtYXJzZWlsbGVcIiB9KSxcbiAgQWN0aW9uLnJvbmRlbCh7IG5hdGlvbjogTmF0aW9uLkdCLCBjb3N0OiAwLCBzbG90OiBcInByb2R1Y3Rpb24xXCIgfSksXG4gIEFjdGlvbi5yb25kZWwoeyBuYXRpb246IE5hdGlvbi5HRSwgY29zdDogMCwgc2xvdDogXCJwcm9kdWN0aW9uMlwiIH0pLFxuICBBY3Rpb24ucm9uZGVsKHsgbmF0aW9uOiBOYXRpb24uUlUsIGNvc3Q6IDAsIHNsb3Q6IFwiaW52ZXN0b3JcIiB9KSxcbiAgQWN0aW9uLmJvbmRQdXJjaGFzZSh7IG5hdGlvbjogTmF0aW9uLkdFLCBwbGF5ZXI6IFwiQW50b25cIiwgY29zdDogNiB9KSxcbiAgLy8gc2Vjb25kIHJvdW5kXG4gIEFjdGlvbi5yb25kZWwoeyBuYXRpb246IE5hdGlvbi5BSCwgY29zdDogMCwgc2xvdDogXCJwcm9kdWN0aW9uMlwiIH0pLFxuICBBY3Rpb24ucm9uZGVsKHsgbmF0aW9uOiBOYXRpb24uSVQsIGNvc3Q6IDAsIHNsb3Q6IFwicHJvZHVjdGlvbjJcIiB9KSxcbiAgQWN0aW9uLnJvbmRlbCh7IG5hdGlvbjogTmF0aW9uLkZSLCBjb3N0OiAwLCBzbG90OiBcInByb2R1Y3Rpb24xXCIgfSksXG4gIEFjdGlvbi5yb25kZWwoeyBuYXRpb246IE5hdGlvbi5HQiwgY29zdDogMCwgc2xvdDogXCJtYW5ldXZlcjFcIiB9KSxcbiAgQWN0aW9uLm1hbmV1dmVyKHsgb3JpZ2luOiBcImxpdmVycG9vbFwiLCBkZXN0aW5hdGlvbjogXCJub3J0aGF0bGFudGljXCIgfSksXG4gIEFjdGlvbi5tYW5ldXZlcih7IG9yaWdpbjogXCJsb25kb25cIiwgZGVzdGluYXRpb246IFwiZW5nbGlzaGNoYW5uZWxcIiB9KSxcbiAgQWN0aW9uLnJvbmRlbCh7IG5hdGlvbjogTmF0aW9uLkdFLCBjb3N0OiAwLCBzbG90OiBcIm1hbmV1dmVyMlwiIH0pLFxuICBBY3Rpb24ubWFuZXV2ZXIoeyBvcmlnaW46IFwiaGFtYnVyZ1wiLCBkZXN0aW5hdGlvbjogXCJub3J0aHNlYVwiIH0pLFxuICBBY3Rpb24ubWFuZXV2ZXIoeyBvcmlnaW46IFwiYmVybGluXCIsIGRlc3RpbmF0aW9uOiBcIm5vcndheVwiIH0pLFxuICBBY3Rpb24ucm9uZGVsKHsgbmF0aW9uOiBOYXRpb24uUlUsIGNvc3Q6IDAsIHNsb3Q6IFwiaW1wb3J0XCIgfSksXG4gIEFjdGlvbi5pbXBvcnQoe1xuICAgIHBsYWNlbWVudHM6IFtcbiAgICAgIHsgcHJvdmluY2U6IFwic3RwZXRlcnNidXJnXCIsIHR5cGU6IFwiZmxlZXRcIiB9LFxuICAgICAgeyBwcm92aW5jZTogXCJtb3Njb3dcIiwgdHlwZTogXCJhcm15XCIgfSxcbiAgICAgIHsgcHJvdmluY2U6IFwibW9zY293XCIsIHR5cGU6IFwiYXJteVwiIH0sXG4gICAgXSxcbiAgfSksXG4gIEFjdGlvbi5ub29wLFxuICBBY3Rpb24ubm9vcCxcbiAgLy8gdGhpcmQgcm91bmRcbiAgQWN0aW9uLnJvbmRlbCh7IG5hdGlvbjogTmF0aW9uLkFILCBjb3N0OiAwLCBzbG90OiBcIm1hbmV1dmVyMlwiIH0pLFxuICBBY3Rpb24ubWFuZXV2ZXIoeyBvcmlnaW46IFwidHJpZXN0ZVwiLCBkZXN0aW5hdGlvbjogXCJpb25pYW5zZWFcIiB9KSxcbiAgQWN0aW9uLm1hbmV1dmVyKHsgb3JpZ2luOiBcImxlbWJlcmdcIiwgZGVzdGluYXRpb246IFwicm9tYW5pYVwiIH0pLFxuICBBY3Rpb24ubWFuZXV2ZXIoeyBvcmlnaW46IFwiYnVkYXBlc3RcIiwgZGVzdGluYXRpb246IFwid2VzdGJhbGthblwiIH0pLFxuICBBY3Rpb24ubWFuZXV2ZXIoeyBvcmlnaW46IFwidmllbm5hXCIsIGRlc3RpbmF0aW9uOiBcInR1bmlzXCIgfSksXG4gIEFjdGlvbi5yb25kZWwoeyBuYXRpb246IE5hdGlvbi5JVCwgY29zdDogMCwgc2xvdDogXCJtYW5ldXZlcjJcIiB9KSxcbiAgQWN0aW9uLm1hbmV1dmVyKHtcbiAgICBvcmlnaW46IFwibmFwbGVzXCIsXG4gICAgZGVzdGluYXRpb246IFwid2VzdGVybm1lZGl0ZXJyYW5lYW5zZWFcIixcbiAgfSksXG4gIEFjdGlvbi5tYW5ldXZlcih7IG9yaWdpbjogXCJyb21lXCIsIGRlc3RpbmF0aW9uOiBcInNwYWluXCIgfSksXG4gIEFjdGlvbi5yb25kZWwoeyBuYXRpb246IE5hdGlvbi5GUiwgY29zdDogMCwgc2xvdDogXCJtYW5ldXZlcjFcIiB9KSxcbiAgQWN0aW9uLm1hbmV1dmVyKHtcbiAgICBvcmlnaW46IFwibWFyc2VpbGxlXCIsXG4gICAgZGVzdGluYXRpb246IFwid2VzdGVybm1lZGl0ZXJyYW5lYW5zZWFcIixcbiAgfSksXG4gIEFjdGlvbi5maWdodCh7XG4gICAgcHJvdmluY2U6IFwid2VzdGVybm1lZGl0ZXJyYW5lYW5zZWFcIixcbiAgICBpbmN1bWJlbnQ6IE5hdGlvbi5JVCxcbiAgICBjaGFsbGVuZ2VyOiBOYXRpb24uRlIsXG4gIH0pLFxuICBBY3Rpb24ubWFuZXV2ZXIoe1xuICAgIG9yaWdpbjogXCJib3JkZWF1eFwiLFxuICAgIGRlc3RpbmF0aW9uOiBcImJheW9mYmlzY2F5XCIsXG4gIH0pLFxuICBBY3Rpb24ubWFuZXV2ZXIoe1xuICAgIG9yaWdpbjogXCJwYXJpc1wiLFxuICAgIGRlc3RpbmF0aW9uOiBcIm1vcm9jY29cIixcbiAgfSksXG4gIEFjdGlvbi5yb25kZWwoeyBuYXRpb246IE5hdGlvbi5HQiwgY29zdDogMCwgc2xvdDogXCJpbnZlc3RvclwiIH0pLFxuICBBY3Rpb24uYm9uZFB1cmNoYXNlKHsgbmF0aW9uOiBOYXRpb24uUlUsIHBsYXllcjogXCJCZXJ0XCIsIGNvc3Q6IDYgfSksXG4gIEFjdGlvbi5yb25kZWwoeyBuYXRpb246IE5hdGlvbi5HRSwgY29zdDogMCwgc2xvdDogXCJ0YXhhdGlvblwiIH0pLFxuICBBY3Rpb24ucm9uZGVsKHsgbmF0aW9uOiBOYXRpb24uUlUsIGNvc3Q6IDAsIHNsb3Q6IFwicHJvZHVjdGlvbjJcIiB9KSxcbiAgLy8gZm91cnRoIHJvdW5kXG4gIEFjdGlvbi5yb25kZWwoeyBuYXRpb246IE5hdGlvbi5BSCwgY29zdDogMCwgc2xvdDogXCJ0YXhhdGlvblwiIH0pLFxuICBBY3Rpb24ucm9uZGVsKHsgbmF0aW9uOiBOYXRpb24uSVQsIGNvc3Q6IDAsIHNsb3Q6IFwicHJvZHVjdGlvbjFcIiB9KSxcbiAgQWN0aW9uLnJvbmRlbCh7IG5hdGlvbjogTmF0aW9uLkZSLCBjb3N0OiAwLCBzbG90OiBcInByb2R1Y3Rpb24yXCIgfSksXG4gIEFjdGlvbi5ib25kUHVyY2hhc2UoeyBuYXRpb246IE5hdGlvbi5BSCwgcGxheWVyOiBcIkNsYXVkaWFcIiwgY29zdDogNiB9KSxcbiAgQWN0aW9uLnJvbmRlbCh7IG5hdGlvbjogTmF0aW9uLkdCLCBjb3N0OiAwLCBzbG90OiBcInByb2R1Y3Rpb24yXCIgfSksXG4gIEFjdGlvbi5yb25kZWwoeyBuYXRpb246IE5hdGlvbi5HRSwgY29zdDogMCwgc2xvdDogXCJmYWN0b3J5XCIgfSksXG4gIEFjdGlvbi5idWlsZEZhY3RvcnkoeyBwcm92aW5jZTogXCJjb2xvZ25lXCIgfSksXG4gIEFjdGlvbi5yb25kZWwoeyBuYXRpb246IE5hdGlvbi5SVSwgY29zdDogMCwgc2xvdDogXCJtYW5ldXZlcjJcIiB9KSxcbiAgQWN0aW9uLm1hbmV1dmVyKHtcbiAgICBvcmlnaW46IFwic3RwZXRlcnNidXJnXCIsXG4gICAgZGVzdGluYXRpb246IFwiYmFsdGljc2VhXCIsXG4gIH0pLFxuICBBY3Rpb24ubWFuZXV2ZXIoe1xuICAgIG9yaWdpbjogXCJvZGVzc2FcIixcbiAgICBkZXN0aW5hdGlvbjogXCJibGFja3NlYVwiLFxuICB9KSxcbiAgQWN0aW9uLm1hbmV1dmVyKHtcbiAgICBvcmlnaW46IFwibW9zY293XCIsXG4gICAgZGVzdGluYXRpb246IFwic3dlZGVuXCIsXG4gIH0pLFxuICBBY3Rpb24ubWFuZXV2ZXIoe1xuICAgIG9yaWdpbjogXCJtb3Njb3dcIixcbiAgICBkZXN0aW5hdGlvbjogXCJ0dXJrZXlcIixcbiAgfSksXG4gIEFjdGlvbi5tYW5ldXZlcih7XG4gICAgb3JpZ2luOiBcIm1vc2Nvd1wiLFxuICAgIGRlc3RpbmF0aW9uOiBcImxlbWJlcmdcIixcbiAgfSksXG5dO1xuIiwiaW1wb3J0IEltcGVyaWFsIGZyb20gXCIuLi9pbXBlcmlhbC5qc1wiO1xuaW1wb3J0IGxvZyBmcm9tIFwiLi4vc2NobmVsbGVpbnN0ZWlnTG9nLmpzXCI7XG5pbXBvcnQgUm9uZGVsIGZyb20gXCIuL3JvbmRlbC5zdmdcIjtcblxuVnVlLmNvbXBvbmVudChcInBsYXllclwiLCB7XG4gIHByb3BzOiBbXCJuYW1lXCIsIFwiY2FzaFwiLCBcImJvbmRzXCIsIFwiY3VycmVudF9wbGF5ZXJcIl0sXG4gIHRlbXBsYXRlOiBgXG4gIDxsaSBjbGFzcz1cInBsYXllclwiPlxuICAgIDxkaXYgdi1pZj1cIm5hbWUgPT09IGN1cnJlbnRfcGxheWVyXCIgY2xhc3M9XCJjdXJyZW50X3BsYXllclwiPlxuICAgICAg8J+kqVxuICAgIDwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJjb250ZW50c1wiPlxuICAgICAgPGgzPnt7IG5hbWUgfX08L2gzPlxuICAgICAgPGRpdj5DYXNoOiB7eyBjYXNoIH19IG1pbGxpb248L2Rpdj5cbiAgICAgIDxkaXY+XG4gICAgICAgIEJvbmRzOlxuICAgICAgICA8dWwgY2xhc3M9XCJib25kc1wiPlxuICAgICAgICAgIDxib25kXG4gICAgICAgICAgICB2LWZvcj1cImJvbmQgaW4gYm9uZHNcIlxuICAgICAgICAgICAgdi1iaW5kOm5hdGlvbj1cImJvbmQubmF0aW9uLnZhbHVlXCJcbiAgICAgICAgICAgIHYtYmluZDpjb3N0PVwiYm9uZC5jb3N0XCJcbiAgICAgICAgICAgIHYtYmluZDprZXk9XCJib25kLm5hdGlvbi52YWx1ZVwiXG4gICAgICAgICAgPjwvYm9uZD5cbiAgICAgICAgPC91bD5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICA8L2xpPlxuICBgLFxufSk7XG5cblZ1ZS5jb21wb25lbnQoXCJib25kXCIsIHtcbiAgcHJvcHM6IFtcIm5hdGlvblwiLCBcImNvc3RcIl0sXG4gIHRlbXBsYXRlOiBgPGxpIGNsYXNzPVwiYm9uZFwiPnt7IG5hdGlvbiB9fXt7IGNvc3QgfX08L2xpPmAsXG59KTtcblxuVnVlLmNvbXBvbmVudChcImN1cnJlbnQtdHVyblwiLCB7XG4gIHByb3BzOiBbXCJ0eXBlXCIsIFwicGF5bG9hZFwiXSxcbiAgdGVtcGxhdGU6IGA8ZGl2Pnt7IHR5cGUgfX17eyBwYXlsb2FkIH19PC9kaXY+YCxcbn0pO1xuXG5WdWUuY29tcG9uZW50KFwiYWN0aW9uXCIsIHtcbiAgcHJvcHM6IFtcImFjdGlvblwiLCBcImRpc3BhdGNoXCIsIFwidGV4dFwiXSxcbiAgdGVtcGxhdGU6IGA8YnV0dG9uIHYtb246Y2xpY2s9XCJkaXNwYXRjaChhY3Rpb24pXCI+e3sgdGV4dCB9fTwvYnV0dG9uPmAsXG59KTtcblxuVnVlLmNvbXBvbmVudChcInJvbmRlbFwiLCBSb25kZWwpO1xuXG5leHBvcnQgZGVmYXVsdCBWdWUuY29tcG9uZW50KFwiYXBwXCIsIHtcbiAgZGF0YSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgZ2FtZToge30sXG4gICAgICBnYW1lU3RhcnRlZDogZmFsc2UsXG4gICAgICByb25kZWw6IFwiXCIsXG4gICAgfTtcbiAgfSxcbiAgbWV0aG9kczoge1xuICAgIHN0YXJ0R2FtZTogZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy5nYW1lID0gSW1wZXJpYWwuZnJvbUxvZyhsb2cuc2xpY2UoMCwgMikpO1xuICAgICAgdGhpcy5nYW1lU3RhcnRlZCA9IHRydWU7XG4gICAgfSxcbiAgICBmbGFnOiBmdW5jdGlvbiAobmF0aW9uKSB7XG4gICAgICBzd2l0Y2ggKG5hdGlvbikge1xuICAgICAgICBjYXNlIFwiQUhcIjpcbiAgICAgICAgICByZXR1cm4gXCJmbGFncy9haC5zdmdcIjtcbiAgICAgICAgY2FzZSBcIklUXCI6XG4gICAgICAgICAgcmV0dXJuIFwiZmxhZ3MvaXQuc3ZnXCI7XG4gICAgICAgIGNhc2UgXCJGUlwiOlxuICAgICAgICAgIHJldHVybiBcImZsYWdzL2ZyLnN2Z1wiO1xuICAgICAgICBjYXNlIFwiR0JcIjpcbiAgICAgICAgICByZXR1cm4gXCJmbGFncy9nYi5zdmdcIjtcbiAgICAgICAgY2FzZSBcIkdFXCI6XG4gICAgICAgICAgcmV0dXJuIFwiZmxhZ3MvZ2Uuc3ZnXCI7XG4gICAgICAgIGNhc2UgXCJSVVwiOlxuICAgICAgICAgIHJldHVybiBcImZsYWdzL3J1LnN2Z1wiO1xuICAgICAgfVxuICAgIH0sXG4gICAgdGlja1dpdGhBY3Rpb246IGZ1bmN0aW9uIChhY3Rpb24pIHtcbiAgICAgIHRoaXMuZ2FtZS50aWNrKGFjdGlvbik7XG4gICAgICB0aGlzLnVwZGF0ZVJvbmRlbCgpO1xuICAgIH0sXG4gICAgYWN0aW9uVG9UZXh0OiBmdW5jdGlvbiAoYWN0aW9uKSB7XG4gICAgICBpZiAoYWN0aW9uLnR5cGUgPT09IFwicm9uZGVsXCIpIHtcbiAgICAgICAgcmV0dXJuIGFjdGlvbi5wYXlsb2FkLnNsb3Q7XG4gICAgICB9IGVsc2UgaWYgKGFjdGlvbi50eXBlID09PSBcImltcG9ydFwiKSB7XG4gICAgICAgIHJldHVybiBgSW1wb3J0ICR7YWN0aW9uLnBheWxvYWQudW5pdH0gaW4gJHthY3Rpb24ucGF5bG9hZC5wcm92aW5jZX1gO1xuICAgICAgfSBlbHNlIGlmIChhY3Rpb24udHlwZSA9PT0gXCJidWlsZEZhY3RvcnlcIikge1xuICAgICAgICByZXR1cm4gYEJ1aWxkIGZhY3RvcnkgaW4gJHthY3Rpb24ucGF5bG9hZC5wcm92aW5jZX1gO1xuICAgICAgfVxuICAgIH0sXG4gICAgdXBkYXRlUm9uZGVsOiBmdW5jdGlvbiAoKSB7XG4gICAgICBmb3IgKGNvbnN0IFtuYXRpb24sIHsgcm9uZGVsUG9zaXRpb24gfV0gb2YgdGhpcy5nYW1lLm5hdGlvbnMpIHtcbiAgICAgICAgaWYgKHJvbmRlbFBvc2l0aW9uID09PSBudWxsKSBjb250aW51ZTtcbiAgICAgICAgY29uc3QgZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChyb25kZWxQb3NpdGlvbik7XG4gICAgICAgIGNvbnN0IGJCb3ggPSBlbC5nZXRCQm94KCk7XG4gICAgICAgIGNvbnN0IGZsYWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXG4gICAgICAgICAgXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLFxuICAgICAgICAgIFwiaW1hZ2VcIlxuICAgICAgICApO1xuICAgICAgICBmbGFnLnNldEF0dHJpYnV0ZShcImhlaWdodFwiLCBcIjIwXCIpO1xuXG4gICAgICAgIC8vIFRoaXMgaXMgYSByZWFsbHkgcm91Z2ggd2F5IHRvIGdldCB0aGUgY2VudGVyIG9mIHRoZSBTVkcgcGF0aFxuICAgICAgICBjb25zdCBzdGVwID0gZWwuZ2V0VG90YWxMZW5ndGgoKSAvIDEwMDtcbiAgICAgICAgbGV0IHRvdGFsWCA9IDA7XG4gICAgICAgIGxldCB0b3RhbFkgPSAwO1xuICAgICAgICBmb3IgKGxldCBkaXN0ID0gMDsgZGlzdCA8IGVsLmdldFRvdGFsTGVuZ3RoKCk7IGRpc3QgKz0gc3RlcCkge1xuICAgICAgICAgIGNvbnN0IHB0ID0gZWwuZ2V0UG9pbnRBdExlbmd0aChkaXN0KTtcbiAgICAgICAgICB0b3RhbFggKz0gcHQueDtcbiAgICAgICAgICB0b3RhbFkgKz0gcHQueTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZsYWcuc2V0QXR0cmlidXRlKFwieFwiLCB0b3RhbFggLyAxMDApO1xuICAgICAgICBmbGFnLnNldEF0dHJpYnV0ZShcInlcIiwgdG90YWxZIC8gMTAwKTtcblxuICAgICAgICBmbGFnLnNldEF0dHJpYnV0ZShcImhyZWZcIiwgdGhpcy5mbGFnKG5hdGlvbi52YWx1ZSkpO1xuICAgICAgICBlbC5wYXJlbnROb2RlLmFwcGVuZChmbGFnKTtcbiAgICAgIH1cbiAgICB9LFxuICB9LFxuICB0ZW1wbGF0ZTogYFxuICA8ZGl2IHYtaWY9XCJnYW1lU3RhcnRlZFwiPlxuICAgIDx1bCBjbGFzcz1cInBsYXllcnNcIj5cbiAgICAgIDxwbGF5ZXJcbiAgICAgICAgdi1mb3I9XCJwbGF5ZXIgaW4gZ2FtZS5wbGF5ZXJzXCJcbiAgICAgICAgdi1iaW5kOm5hbWU9XCJwbGF5ZXIubmFtZVwiXG4gICAgICAgIHYtYmluZDpjYXNoPVwicGxheWVyLmNhc2hcIlxuICAgICAgICB2LWJpbmQ6Ym9uZHM9XCJwbGF5ZXIuYm9uZHNcIlxuICAgICAgICB2LWJpbmQ6Y3VycmVudF9wbGF5ZXI9XCJnYW1lLmN1cnJlbnRQbGF5ZXJOYW1lXCJcbiAgICAgICAgdi1iaW5kOmtleT1cInBsYXllci5uYW1lXCJcbiAgICAgID48L3BsYXllcj5cbiAgICA8L3VsPlxuICAgIDxkaXYgY2xhc3M9XCJyb25kZWxcIj5cbiAgICAgIDxyb25kZWwgLz5cbiAgICA8L2Rpdj5cbiAgICA8Y3VycmVudC10dXJuXG4gICAgICB2LWJpbmQ6dHlwZT1cImdhbWUubG9nW2dhbWUubG9nLmxlbmd0aCAtIDFdLnR5cGVcIlxuICAgICAgdi1iaW5kOnBheWxvYWQ9XCJnYW1lLmxvZ1tnYW1lLmxvZy5sZW5ndGggLSAxXS5wYXlsb2FkXCJcbiAgICA+PC9jdXJyZW50LXR1cm4+XG4gICAgPGRpdj5cbiAgICAgIEl0IGlzIHt7IGdhbWUuY3VycmVudE5hdGlvbi52YWx1ZSB9fSdzIHR1cm5cbiAgICA8L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwiYnV0dG9uc1wiPlxuICAgICAgPGFjdGlvblxuICAgICAgICB2LWZvcj1cImFjdGlvbiBpbiBnYW1lLmF2YWlsYWJsZUFjdGlvbnNcIlxuICAgICAgICB2LWJpbmQ6a2V5PVwiSlNPTi5zdHJpbmdpZnkoYWN0aW9uKVwiXG4gICAgICAgIHYtYmluZDphY3Rpb249XCJhY3Rpb25cIlxuICAgICAgICB2LWJpbmQ6dGV4dD1cImFjdGlvblRvVGV4dChhY3Rpb24pXCJcbiAgICAgICAgdi1iaW5kOmRpc3BhdGNoPVwidGlja1dpdGhBY3Rpb25cIlxuICAgICAgPjwvYWN0aW9uPlxuICAgIDwvZGl2PlxuICA8L2Rpdj5cbiAgPGRpdiB2LWVsc2UgY2xhc3M9XCJidXR0b25zXCI+XG4gICAgPGJ1dHRvbiB2LW9uOmNsaWNrPVwic3RhcnRHYW1lXCI+XG4gICAgICBTdGFydCBHYW1lXG4gICAgPC9idXR0b24+XG4gIDwvZGl2PlxuYCxcbn0pO1xuIiwiaW1wb3J0IEFwcCBmcm9tIFwiLi9hcHBcIjtcbmltcG9ydCBcIi4vc3R5bGUuY3NzXCI7XG5cbm5ldyBWdWUoe1xuICBlbDogXCIjYXBwXCIsXG4gIHJlbmRlcjogKGgpID0+IGgoQXBwKSxcbn0pO1xuIiwiXG4gICAgICBtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICAgICAgZnVuY3Rpb25hbDogdHJ1ZSxcbiAgICAgICAgcmVuZGVyKF9oLCBfdm0pIHtcbiAgICAgICAgICBjb25zdCB7IF9jLCBfdiwgZGF0YSwgY2hpbGRyZW4gPSBbXSB9ID0gX3ZtO1xuXG4gICAgICAgICAgY29uc3Qge1xuICAgICAgICAgICAgY2xhc3M6IGNsYXNzTmFtZXMsXG4gICAgICAgICAgICBzdGF0aWNDbGFzcyxcbiAgICAgICAgICAgIHN0eWxlLFxuICAgICAgICAgICAgc3RhdGljU3R5bGUsXG4gICAgICAgICAgICBhdHRycyA9IHt9LFxuICAgICAgICAgICAgLi4ucmVzdFxuICAgICAgICAgIH0gPSBkYXRhO1xuXG4gICAgICAgICAgcmV0dXJuIF9jKFxuICAgICAgICAgICAgJ3N2ZycsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGNsYXNzOiBbY2xhc3NOYW1lcyxzdGF0aWNDbGFzc10sXG4gICAgICAgICAgICAgIHN0eWxlOiBbc3R5bGUsc3RhdGljU3R5bGVdLFxuICAgICAgICAgICAgICBhdHRyczogT2JqZWN0LmFzc2lnbih7XCJ3aWR0aFwiOlwiNDcwXCIsXCJoZWlnaHRcIjpcIjQ1NlwiLFwieG1sbnNcIjpcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCJ9LCBhdHRycyksXG4gICAgICAgICAgICAgIC4uLnJlc3QsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY2hpbGRyZW4uY29uY2F0KFtfYygnZycse2F0dHJzOntcImZpbGxcIjpcIm5vbmVcIixcImZpbGwtcnVsZVwiOlwiZXZlbm9kZFwifX0sW19jKCd0ZXh0Jyx7YXR0cnM6e1widHJhbnNmb3JtXCI6XCJyb3RhdGUoMjUgMzk2OC43NzkgMTg4LjY2OClcIixcImZvbnQtZmFtaWx5XCI6XCJCYXNrZXJ2aWxsZVwiLFwiZm9udC1zaXplXCI6XCIyNFwiLFwibGV0dGVyLXNwYWNpbmdcIjpcIi42MTdcIixcImZpbGxcIjpcIiMwMDBcIn19LFtfYygndHNwYW4nLHthdHRyczp7XCJ4XCI6XCI1NjIuOThcIixcInlcIjpcIjE1ODUuMTI0XCJ9fSxbX3YoJ1RheGF0aW9uJyldKV0pLF9jKCd0ZXh0Jyx7YXR0cnM6e1widHJhbnNmb3JtXCI6XCJyb3RhdGUoNzAgMTY5Mi4yOTUgNzIxLjg5NilcIixcImZvbnQtZmFtaWx5XCI6XCJCYXNrZXJ2aWxsZVwiLFwiZm9udC1zaXplXCI6XCIyNFwiLFwibGV0dGVyLXNwYWNpbmdcIjpcIi42MTdcIixcImZpbGxcIjpcIiMwMDBcIn19LFtfYygndHNwYW4nLHthdHRyczp7XCJ4XCI6XCI2ODIuOThcIixcInlcIjpcIjE2OTkuMTI0XCJ9fSxbX3YoJ0ZhY3RvcnknKV0pXSksX2MoJ3RleHQnLHthdHRyczp7XCJ0cmFuc2Zvcm1cIjpcInJvdGF0ZSgtNzAgLTUyNy4zMzUgMTI4NC4zNTIpXCIsXCJmb250LWZhbWlseVwiOlwiQmFza2VydmlsbGVcIixcImZvbnQtc2l6ZVwiOlwiMjRcIixcImxldHRlci1zcGFjaW5nXCI6XCIuNjE3XCIsXCJmaWxsXCI6XCIjMDAwXCJ9fSxbX2MoJ3RzcGFuJyx7YXR0cnM6e1wieFwiOlwiNjU4Ljk4XCIsXCJ5XCI6XCIxODczLjEyNFwifX0sW192KCdQcm9kdWN0aW9uJyldKV0pLF9jKCd0ZXh0Jyx7YXR0cnM6e1widHJhbnNmb3JtXCI6XCJyb3RhdGUoLTcwIC05NDQuMzM1IDExMTQuMzUyKVwiLFwiZm9udC1mYW1pbHlcIjpcIkJhc2tlcnZpbGxlXCIsXCJmb250LXNpemVcIjpcIjI0XCIsXCJsZXR0ZXItc3BhY2luZ1wiOlwiLjYxN1wiLFwiZmlsbFwiOlwiIzAwMFwifX0sW19jKCd0c3Bhbicse2F0dHJzOntcInhcIjpcIjI0MS45OFwiLFwieVwiOlwiMTcwMy4xMjRcIn19LFtfdignUHJvZHVjdGlvbicpXSldKSxfYygndGV4dCcse2F0dHJzOntcInRyYW5zZm9ybVwiOlwicm90YXRlKC0zMCAtMjQyMC4zNiAxNzA1LjY4MylcIixcImZvbnQtZmFtaWx5XCI6XCJCYXNrZXJ2aWxsZVwiLFwiZm9udC1zaXplXCI6XCIyNFwiLFwibGV0dGVyLXNwYWNpbmdcIjpcIi42MTdcIixcImZpbGxcIjpcIiMwMDBcIn19LFtfYygndHNwYW4nLHthdHRyczp7XCJ4XCI6XCI1NTUuOThcIixcInlcIjpcIjE5ODEuMTI0XCJ9fSxbX3YoJ01hbmV1dmVyJyldKV0pLF9jKCd0ZXh0Jyx7YXR0cnM6e1widHJhbnNmb3JtXCI6XCJyb3RhdGUoLTMwIC0yNjEyLjM2IDEzMTAuNjgzKVwiLFwiZm9udC1mYW1pbHlcIjpcIkJhc2tlcnZpbGxlXCIsXCJmb250LXNpemVcIjpcIjI0XCIsXCJsZXR0ZXItc3BhY2luZ1wiOlwiLjYxN1wiLFwiZmlsbFwiOlwiIzAwMFwifX0sW19jKCd0c3Bhbicse2F0dHJzOntcInhcIjpcIjM2My45OFwiLFwieVwiOlwiMTU4Ni4xMjRcIn19LFtfdignTWFuZXV2ZXInKV0pXSksX2MoJ3RleHQnLHthdHRyczp7XCJ0cmFuc2Zvcm1cIjpcInJvdGF0ZSgzMCAzMTcxLjgyIDY5MC41NjUpXCIsXCJmb250LWZhbWlseVwiOlwiQmFza2VydmlsbGVcIixcImZvbnQtc2l6ZVwiOlwiMjRcIixcImxldHRlci1zcGFjaW5nXCI6XCIuNjE3XCIsXCJmaWxsXCI6XCIjMDAwXCJ9fSxbX2MoJ3RzcGFuJyx7YXR0cnM6e1wieFwiOlwiMzczLjk4XCIsXCJ5XCI6XCIxOTgxLjEyNFwifX0sW192KCdJbnZlc3RvcicpXSldKSxfYygndGV4dCcse2F0dHJzOntcInRyYW5zZm9ybVwiOlwicm90YXRlKDcwIDEyNzcuNzk1IDg5MC44OTYpXCIsXCJmb250LWZhbWlseVwiOlwiQmFza2VydmlsbGVcIixcImZvbnQtc2l6ZVwiOlwiMjRcIixcImxldHRlci1zcGFjaW5nXCI6XCIuNjE3XCIsXCJmaWxsXCI6XCIjMDAwXCJ9fSxbX2MoJ3RzcGFuJyx7YXR0cnM6e1wieFwiOlwiMjcwLjk4XCIsXCJ5XCI6XCIxODY4LjEyNFwifX0sW192KCdJbXBvcnQnKV0pXSksX2MoJ2cnLHthdHRyczp7XCJ0cmFuc2Zvcm1cIjpcInRyYW5zbGF0ZSg0MSAyNylcIixcInN0cm9rZVwiOlwiIzAwMFwifX0sW19jKCdwYXRoJyx7YXR0cnM6e1wiZFwiOlwiTTIwMCAyMDBMNTguNTg2IDM0MS40MTRBMjAwIDIwMCAwIDAxMCAyMDBoMjAwelwiLFwiZmlsbFwiOlwiI0YzOUQ4MVwiLFwiZmlsbC1ydWxlXCI6XCJub256ZXJvXCJ9fSksX2MoJ3BhdGgnLHthdHRyczp7XCJkXCI6XCJNMjAwIDIwMEgwQTIwMCAyMDAgMCAwMTU4LjU4NiA1OC41ODZMMjAwIDIwMHpcIixcImZpbGxcIjpcIiM4Qzg3OThcIixcImZpbGwtcnVsZVwiOlwibm9uemVyb1wifX0pLF9jKCdwYXRoJyx7YXR0cnM6e1wiZFwiOlwiTTIwMCAyMDBMNTguNTg2IDU4LjU4NkEyMDAgMjAwIDAgMDEyMDAgMHYyMDB6XCIsXCJmaWxsXCI6XCIjN0VBODUwXCIsXCJmaWxsLXJ1bGVcIjpcIm5vbnplcm9cIn19KSxfYygncGF0aCcse2F0dHJzOntcImRcIjpcIk0yMDAgMjAwVjBhMjAwIDIwMCAwIDAxMTQxLjQxNCA1OC41ODZMMjAwIDIwMHpcIixcImZpbGxcIjpcIiNGRkQyODFcIixcImZpbGwtcnVsZVwiOlwibm9uemVyb1wifX0pLF9jKCdwYXRoJyx7YXR0cnM6e1wiZFwiOlwiTTIwMCAyMDBMMzQxLjQxNCA1OC41ODZBMjAwIDIwMCAwIDAxNDAwIDIwMEgyMDB6XCIsXCJmaWxsXCI6XCIjOERCQ0ZCXCIsXCJmaWxsLXJ1bGVcIjpcIm5vbnplcm9cIn19KSxfYygncGF0aCcse2F0dHJzOntcImRcIjpcIk0yMDAgMjAwaDIwMGEyMDAgMjAwIDAgMDEtNTguNTg2IDE0MS40MTRMMjAwIDIwMHpcIixcImZpbGxcIjpcIiM4Qzg3OThcIixcImZpbGwtcnVsZVwiOlwibm9uemVyb1wifX0pLF9jKCdwYXRoJyx7YXR0cnM6e1wiZFwiOlwiTTIwMCAyMDBsMTQxLjQxNCAxNDEuNDE0QTIwMCAyMDAgMCAwMTIwMCA0MDBWMjAwelwiLFwiZmlsbFwiOlwiIzdFQTg1MFwiLFwiZmlsbC1ydWxlXCI6XCJub256ZXJvXCJ9fSksX2MoJ3BhdGgnLHthdHRyczp7XCJkXCI6XCJNMjAwIDIwMHYyMDBhMjAwIDIwMCAwIDAxLTE0MS40MTQtNTguNTg2TDIwMCAyMDB6XCIsXCJmaWxsXCI6XCIjOEVERkZGXCIsXCJmaWxsLXJ1bGVcIjpcIm5vbnplcm9cIn19KSxfYygnY2lyY2xlJyx7YXR0cnM6e1wiZmlsbFwiOlwiI0ZGRlwiLFwiY3hcIjpcIjE5OS41XCIsXCJjeVwiOlwiMjAwLjVcIixcInJcIjpcIjM3XCJ9fSldKV0pXSlcbiAgICAgICAgICApXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAiLCJ2YXIgYXBpID0gcmVxdWlyZShcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanNcIik7XG4gICAgICAgICAgICB2YXIgY29udGVudCA9IHJlcXVpcmUoXCIhIS4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vc3R5bGUuY3NzXCIpO1xuXG4gICAgICAgICAgICBjb250ZW50ID0gY29udGVudC5fX2VzTW9kdWxlID8gY29udGVudC5kZWZhdWx0IDogY29udGVudDtcblxuICAgICAgICAgICAgaWYgKHR5cGVvZiBjb250ZW50ID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICBjb250ZW50ID0gW1ttb2R1bGUuaWQsIGNvbnRlbnQsICcnXV07XG4gICAgICAgICAgICB9XG5cbnZhciBvcHRpb25zID0ge307XG5cbm9wdGlvbnMuaW5zZXJ0ID0gXCJoZWFkXCI7XG5vcHRpb25zLnNpbmdsZXRvbiA9IGZhbHNlO1xuXG52YXIgdXBkYXRlID0gYXBpKGNvbnRlbnQsIG9wdGlvbnMpO1xuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBjb250ZW50LmxvY2FscyB8fCB7fTsiLCJpbXBvcnQgeyBBbGxCb25kcywgQm9uZCwgTmF0aW9uIH0gZnJvbSBcIi4vY29uc3RhbnRzLmpzXCI7XG5cbmNvbnN0IGVycm9yID0gKHdhbnQpID0+ICh4KSA9PiB7XG4gIHRocm93IG5ldyBFcnJvcihgZ290PSR7eC52YWx1ZX0sIHdhbnQ9JHt3YW50fWApO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgKHsgcGxheWVycywgcHJvdmluY2VOYW1lcyB9KSA9PiB7XG4gIGNvbnN0IG5hdGlvbkFzc2lnbm1lbnRzID0ge1xuICAgIDI6ICh7IGlkLCBuYXRpb24gfSkgPT5cbiAgICAgIG5hdGlvbi53aGVuKHtcbiAgICAgICAgQUg6ICgpID0+IFtcbiAgICAgICAgICB7IGlkLCBuYXRpb246IE5hdGlvbi5BSCB9LFxuICAgICAgICAgIHsgaWQsIG5hdGlvbjogTmF0aW9uLkZSIH0sXG4gICAgICAgICAgeyBpZCwgbmF0aW9uOiBOYXRpb24uR0UgfSxcbiAgICAgICAgXSxcbiAgICAgICAgSVQ6ICgpID0+IFtcbiAgICAgICAgICB7IGlkLCBuYXRpb246IE5hdGlvbi5JVCB9LFxuICAgICAgICAgIHsgaWQsIG5hdGlvbjogTmF0aW9uLlJVIH0sXG4gICAgICAgICAgeyBpZCwgbmF0aW9uOiBOYXRpb24uR0IgfSxcbiAgICAgICAgXSxcbiAgICAgICAgRlI6IGVycm9yKFwiQUh8SVRcIiksXG4gICAgICAgIEdCOiBlcnJvcihcIkFIfElUXCIpLFxuICAgICAgICBSVTogZXJyb3IoXCJBSHxJVFwiKSxcbiAgICAgICAgR0U6IGVycm9yKFwiQUh8SVRcIiksXG4gICAgICB9KSxcbiAgICAzOiAoeyBpZCwgbmF0aW9uIH0pID0+XG4gICAgICBuYXRpb24ud2hlbih7XG4gICAgICAgIEFIOiAoKSA9PiBbXG4gICAgICAgICAgeyBpZCwgbmF0aW9uOiBOYXRpb24uQUggfSxcbiAgICAgICAgICB7IGlkLCBuYXRpb246IE5hdGlvbi5HQiB9LFxuICAgICAgICBdLFxuICAgICAgICBJVDogKCkgPT4gW1xuICAgICAgICAgIHsgaWQsIG5hdGlvbjogTmF0aW9uLklUIH0sXG4gICAgICAgICAgeyBpZCwgbmF0aW9uOiBOYXRpb24uUlUgfSxcbiAgICAgICAgXSxcbiAgICAgICAgRlI6ICgpID0+IFtcbiAgICAgICAgICB7IGlkLCBuYXRpb246IE5hdGlvbi5GUiB9LFxuICAgICAgICAgIHsgaWQsIG5hdGlvbjogTmF0aW9uLkdFIH0sXG4gICAgICAgIF0sXG4gICAgICAgIEdCOiBlcnJvcihcIkFIfElUfEZSXCIpLFxuICAgICAgICBSVTogZXJyb3IoXCJBSHxJVHxGUlwiKSxcbiAgICAgICAgR0U6IGVycm9yKFwiQUh8SVR8RlJcIiksXG4gICAgICB9KSxcbiAgICA0OiAoeCkgPT4gW3hdLFxuICAgIDU6ICh4KSA9PiBbeF0sXG4gICAgNjogKHgpID0+IFt4XSxcbiAgfTtcblxuICBjb25zdCBvdXQgPSB7XG4gICAgYXZhaWxhYmxlQm9uZHM6IEFsbEJvbmRzKCksXG4gICAgbmF0aW9uczogbmV3IE1hcCgpLFxuICAgIG9yZGVyOiBwbGF5ZXJzLm1hcCgocCkgPT4gcC5pZCksXG4gICAgcGxheWVyczoge30sXG4gIH07XG5cbiAgLyogRnJvbSB0aGUgaW5pdGlhbCBuYXRpb24gYXNzaWdubWVudHMsIGRpc3RyaWJ1dGUgYm9uZHMgdG8gdGhlIHBsYXllcnMuICovXG4gIHBsYXllcnNcbiAgICAubWFwKG5hdGlvbkFzc2lnbm1lbnRzW3BsYXllcnMubGVuZ3RoXSlcbiAgICAuZmxhdCgpXG4gICAgLmZvckVhY2goKHsgaWQsIG5hdGlvbiB9KSA9PiB7XG4gICAgICBpZiAob3V0LnBsYXllcnNbaWRdID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgb3V0LnBsYXllcnNbaWRdID0ge1xuICAgICAgICAgIG5hbWU6IGlkLFxuICAgICAgICAgIGNhc2g6IDIsXG4gICAgICAgICAgYm9uZHM6IG5ldyBTZXQoKSxcbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgY29uc3Qgc21hbGxlckJvbmROYXRpb24gPSBuYXRpb24ud2hlbih7XG4gICAgICAgIEdFOiAoKSA9PiBOYXRpb24uSVQsXG4gICAgICAgIFJVOiAoKSA9PiBOYXRpb24uRlIsXG4gICAgICAgIEFIOiAoKSA9PiBOYXRpb24uR0UsXG4gICAgICAgIElUOiAoKSA9PiBOYXRpb24uR0IsXG4gICAgICAgIEZSOiAoKSA9PiBOYXRpb24uQUgsXG4gICAgICAgIEdCOiAoKSA9PiBOYXRpb24uUlUsXG4gICAgICB9KTtcblxuICAgICAgb3V0LmF2YWlsYWJsZUJvbmRzLmRlbGV0ZShCb25kKG5hdGlvbiwgNCkpO1xuICAgICAgb3V0LmF2YWlsYWJsZUJvbmRzLmRlbGV0ZShCb25kKHNtYWxsZXJCb25kTmF0aW9uLCAxKSk7XG4gICAgICBvdXQucGxheWVyc1tpZF0uYm9uZHMuYWRkKEJvbmQobmF0aW9uLCA0KSk7XG4gICAgICBvdXQucGxheWVyc1tpZF0uYm9uZHMuYWRkKEJvbmQoc21hbGxlckJvbmROYXRpb24sIDEpKTtcbiAgICB9KTtcblxuICAvKiBHYXRoZXIgYm9uZHMgYXMgYSBsaXN0IG9mXG4gICAqXG4gICAqICAgeyBuYXRpb24gOiBOYXRpb24gLCBjb3N0IDogbnVtYmVyICwgbnVtYmVyIDogbnVtYmVyIH1cbiAgICpcbiAgICogc28gd2UgY2FuIGZpbHRlciBieSBuYXRpb24sIHVzZSB0aGUgY29zdCBpbiBvdXJcbiAgICogY2FsY3VsYXRpb24gb2YgZWFjaCBuYXRpb24ncyB0cmVhc3VyeSwgYW5kIHNldCB0aGVcbiAgICogY29udHJvbGxpbmcgcGxheWVyLlxuICAgKi9cblxuICBjb25zdCBwdXJjaGFzZWRCb25kcyA9IG5ldyBTZXQoKTtcbiAgT2JqZWN0LmtleXMob3V0LnBsYXllcnMpLmZvckVhY2goKGlkKSA9PiB7XG4gICAgZm9yIChjb25zdCBib25kIG9mIG91dC5wbGF5ZXJzW2lkXS5ib25kcykge1xuICAgICAgcHVyY2hhc2VkQm9uZHMuYWRkKGJvbmQpO1xuICAgIH1cbiAgfSk7XG5cbiAgLyogQ2FsY3VsYXRlIHRyZWFzdXJ5IGFuZCBjb250cm9sbGVyIGZvciBlYWNoIG5hdGlvbiAqL1xuICBmb3IgKGNvbnN0IG4gb2YgTmF0aW9uKSB7XG4gICAgLyogRmluZCBib25kcyBmb3IgdGhlIGdpdmVuIG5hdGlvbiwgc29ydGVkIGJ5IGRlc2NlbmRpbmcgY29zdCAqL1xuICAgIGNvbnN0IGZvck5hdGlvbiA9IFsuLi5wdXJjaGFzZWRCb25kc11cbiAgICAgIC5maWx0ZXIoKGIpID0+IGIubmF0aW9uID09PSBuKVxuICAgICAgLnNvcnQoKHsgY29zdDogYUNvc3QgfSwgeyBjb3N0OiBiQ29zdCB9KSA9PlxuICAgICAgICBhQ29zdCA8IGJDb3N0ID8gMSA6IGFDb3N0ID4gYkNvc3QgPyAtMSA6IDBcbiAgICAgICk7XG5cbiAgICAvKiBUaGUgcnVsZXMgZGVzY3JpYmUgaW4gcHJvc2UgdGhpcyBkZWNpc2lvbiB0YWJsZVxuICAgICAqXG4gICAgICogICBib25kcyBwdXJjaGFzZWQgfCBjb250cm9sbGVyXG4gICAgICogICAtLS0tLS0tLS0tLS0tLS0tfC0tLS0tLS0tLS0tXG4gICAgICogICBub25lICAgICAgICAgICAgfCBub25lXG4gICAgICogICAyICAgICAgICAgICAgICAgfCBvd25lciBvZiAyXG4gICAgICogICA5ICAgICAgICAgICAgICAgfCBvd25lciBvZiA5XG4gICAgICogICA5LCAyICAgICAgICAgICAgfCBvd25lciBvZiA5XG4gICAgICpcbiAgICAgKiBTbywgd2UnbGwgc2V0IHRoZSBjb250cm9sbGVyIHRvIGJlIHRoZSBvd25lciBvZlxuICAgICAqIHRoZSBoaWdoZXN0IGNvc3QgYm9uZCwgb3IgbnVsbCBpZiB0aGVyZSBhcmUgbm9cbiAgICAgKiBib25kcy5cbiAgICAgKi9cblxuICAgIGNvbnN0IGhpZ2hlc3RCb25kID0gZm9yTmF0aW9uWzBdO1xuICAgIGNvbnN0IGhpZ2hlc3RCb25kT3duZXIgPVxuICAgICAgT2JqZWN0LmtleXMob3V0LnBsYXllcnMpLmZpbmQoKGlkKSA9PlxuICAgICAgICBvdXQucGxheWVyc1tpZF0uYm9uZHMuaGFzKGhpZ2hlc3RCb25kKVxuICAgICAgKSB8fCBudWxsO1xuXG4gICAgY29uc3QgdG90YWxDb3N0ID0gZm9yTmF0aW9uLnJlZHVjZSgoc3VtLCB7IGNvc3QgfSkgPT4gc3VtICsgY29zdCwgMCk7XG5cbiAgICBvdXQubmF0aW9ucy5zZXQobiwge1xuICAgICAgY29udHJvbGxlcjogaGlnaGVzdEJvbmRPd25lcixcbiAgICAgIHRyZWFzdXJ5OiB0b3RhbENvc3QsXG4gICAgICByb25kZWxQb3NpdGlvbjogbnVsbCxcbiAgICAgIGZsYWdDb3VudDogMCxcbiAgICAgIHBvd2VyUG9pbnRzOiAwLFxuICAgICAgdGF4Q2hhcnRQb3NpdGlvbjogNSxcbiAgICB9KTtcblxuICAgIGNvbnN0IEFIUGxheWVyID0gb3V0Lm5hdGlvbnMuZ2V0KE5hdGlvbi5BSCkuY29udHJvbGxlcjtcbiAgICBjb25zdCBBSFBsYXllckluZGV4ID0gb3V0Lm9yZGVyLmluZGV4T2YoQUhQbGF5ZXIpO1xuICAgIGlmIChBSFBsYXllckluZGV4ID09PSAwKSB7XG4gICAgICBvdXQuaW52ZXN0b3JDYXJkSG9sZGVyID0gb3V0Lm9yZGVyW291dC5vcmRlci5sZW5ndGggLSAxXTtcbiAgICB9IGVsc2Uge1xuICAgICAgb3V0LmludmVzdG9yQ2FyZEhvbGRlciA9IG91dC5vcmRlcltBSFBsYXllckluZGV4IC0gMV07XG4gICAgfVxuICB9XG5cbiAgY29uc3QgZW1wdHlQcm92aW5jZXMgPSAoKSA9PiB7XG4gICAgY29uc3QgcHJvdmluY2VzID0gbmV3IE1hcCgpO1xuICAgIGZvciAoY29uc3QgcHJvdmluY2Ugb2YgcHJvdmluY2VOYW1lcykge1xuICAgICAgcHJvdmluY2VzLnNldChwcm92aW5jZSwgeyBhcm1pZXM6IDAsIGZsZWV0czogMCB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHByb3ZpbmNlcztcbiAgfTtcblxuICBjb25zdCB1bml0cyA9IG5ldyBNYXAoKTtcbiAgW05hdGlvbi5BSCwgTmF0aW9uLklULCBOYXRpb24uRlIsIE5hdGlvbi5HQiwgTmF0aW9uLkdFLCBOYXRpb24uUlVdLm1hcChcbiAgICAobmF0aW9uKSA9PiB7XG4gICAgICB1bml0cy5zZXQobmF0aW9uLCBlbXB0eVByb3ZpbmNlcygpKTtcbiAgICB9XG4gICk7XG4gIG91dC51bml0cyA9IHVuaXRzO1xuXG4gIGNvbnN0IHByb3ZpbmNlcyA9IG5ldyBNYXAoKTtcbiAgY29uc3QgYXJtYW1lbnRzID0gW1widmllbm5hXCIsIFwiYnVkYXBlc3RcIiwgXCJwYXJpc1wiLCBcImJlcmxpblwiLCBcInJvbWVcIiwgXCJtb3Njb3dcIl07XG4gIGNvbnN0IHNoaXB5YXJkID0gW1xuICAgIFwiYm9yZGVhdXhcIixcbiAgICBcImxvbmRvblwiLFxuICAgIFwibGl2ZXJwb29sXCIsXG4gICAgXCJoYW1idXJnXCIsXG4gICAgXCJuYXBsZXNcIixcbiAgICBcIm9kZXNzYVwiLFxuICBdO1xuICBmb3IgKGNvbnN0IHByb3ZpbmNlIG9mIHByb3ZpbmNlTmFtZXMpIHtcbiAgICBsZXQgZmFjdG9yeSA9IG51bGw7XG4gICAgaWYgKGFybWFtZW50cy5pbmNsdWRlcyhwcm92aW5jZSkpIHtcbiAgICAgIGZhY3RvcnkgPSBcImFybWFtZW50c1wiO1xuICAgIH0gZWxzZSBpZiAoc2hpcHlhcmQuaW5jbHVkZXMocHJvdmluY2UpKSB7XG4gICAgICBmYWN0b3J5ID0gXCJzaGlweWFyZFwiO1xuICAgIH1cbiAgICBwcm92aW5jZXMuc2V0KHByb3ZpbmNlLCB7IGZhY3RvcnkgfSk7XG4gIH1cbiAgb3V0LnByb3ZpbmNlcyA9IHByb3ZpbmNlcztcbiAgb3V0LmN1cnJlbnROYXRpb24gPSBOYXRpb24uQUg7XG5cbiAgcmV0dXJuIG91dDtcbn07XG4iXSwic291cmNlUm9vdCI6IiJ9
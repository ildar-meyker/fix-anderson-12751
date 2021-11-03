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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/js/partyConfig.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/js/partyConfig.js":
/*!*******************************!*\
  !*** ./src/js/partyConfig.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

var PartyConfig = {};
PartyConfig.StickyTotal = {
  init: function init() {
    new Sticksy(".js-sticky-widget", {
      topSpacing: 20
    });
  }
};
PartyConfig.StickyTabs = {
  _$groups: $(),
  _scrollHandlingFrozen: false,
  _tabsOffset: 0,
  _handleWindowScroll: function _handleWindowScroll(e) {
    if (this._scrollHandlingFrozen) return;
    var scrollTop = $(window).scrollTop();
    var state = scrollTop > this._tabsOffset;
    $("#party-config__nav-desktop-clone").toggleClass("active", state);
    $("#party-config__nav-desktop").toggleClass("fixed", state);

    this._setActiveGroup();
  },
  _handleWindowResize: function _handleWindowResize(e) {
    this._updateTabsOffset();
  },
  _handleTabClick: function _handleTabClick(e) {
    var _this = this;

    e.preventDefault();
    this._scrollHandlingFrozen = true;
    $("html, body").animate({
      scrollTop: $($(e.currentTarget).attr("href")).offset().top - 120
    }, 500, function () {
      _this._scrollHandlingFrozen = false;
    });
    var index = $(e.currentTarget).index();

    this._setActiveTab(index);
  },
  _updateTabsOffset: function _updateTabsOffset() {
    this._tabsOffset = $("#party-config__nav-desktop-clone").offset().top;
  },
  _setActiveTab: function _setActiveTab(index) {
    $("#party-config__nav-desktop").children().removeClass("active history").eq(index).addClass("active").prevAll().addClass("history");
  },
  _setActiveGroup: function _setActiveGroup() {
    var _this2 = this;

    var percentages = [];

    this._$groups.each(function (index, element) {
      percentages.push(_this2._percentWithinViewport($(element)));
    });

    var indexOfMaxValue = percentages.reduce(function (iMax, x, i, arr) {
      return x > arr[iMax] ? i : iMax;
    }, 0);

    this._setActiveTab(indexOfMaxValue);
  },
  _percentWithinViewport: function _percentWithinViewport($element) {
    var elementTop = $element.offset().top;
    var scrollTop = $(window).scrollTop();
    var spaceTop = elementTop - scrollTop;
    var elementHeight = $element.height();
    var screenHeight = $(window).height();
    var scrollBottom = scrollTop + screenHeight;
    var bottomElement = elementTop + $element.height();
    var spaceBottom = bottomElement - scrollBottom;
    var heightInScreen = elementHeight - spaceBottom;
    var percentage;

    if (spaceTop < 0) {
      heightInScreen -= spaceTop * -1;
    }

    if (spaceBottom < 0) {
      heightInScreen -= spaceBottom * -1;
    }

    percentage = heightInScreen / screenHeight * 100;
    percentage = percentage < 0 ? 0 : percentage;
    return percentage;
  },
  init: function init() {
    $(window).on("scroll", $.throttle(100, this._handleWindowScroll.bind(this)));
    $(window).on("resize", $.throttle(250, this._handleWindowResize.bind(this)));
    $(document).on("click", ".party-config__nav-desktop__item", this._handleTabClick.bind(this));

    this._updateTabsOffset();

    this._$groups = $("#party-config__groups .party-config__group");
  }
};
$(function () {
  PartyConfig.StickyTotal.init();
  PartyConfig.StickyTabs.init();
});
window.PartyConfig = PartyConfig;

/***/ })

/******/ });
//# sourceMappingURL=partyConfig.js.map
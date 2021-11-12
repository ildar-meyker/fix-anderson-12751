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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/js/partyEditor.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/js/partyEditor.js":
/*!*******************************!*\
  !*** ./src/js/partyEditor.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

var PartyEditor = {
  NavMobile: {
    _$slider: $(),
    switchToSlide: function switchToSlide(index) {
      this._$slider.slick("slickGoTo", index);
    },
    init: function init(index) {
      this._$slider = $("#party-editor__nav-mobile__slider");

      this._$slider.slick({
        initialSlide: index,
        centerMode: true,
        variableWidth: true,
        infinite: false,
        arrows: false,
        draggable: false,
        touchMove: false,
        swipe: false
      });
    }
  },
  NavDesktop: {
    _$pages: $(),
    _handleWindowScroll: function _handleWindowScroll(e) {
      this._calcCurrentPage();
    },
    _handleWindowResize: function _handleWindowResize(e) {
      this._calcCurrentPage();
    },
    _calcCurrentPage: function _calcCurrentPage() {
      var _this = this;

      if (window.matchMedia("(max-width: 1026.98px)").matches) return;
      var pagesVisiblity = [];

      this._$pages.each(function (index, element) {
        pagesVisiblity.push(_this._percentWithinViewport($(element)));
      });

      var indexOfMaxVisible = pagesVisiblity.reduce(function (iMax, x, i, arr) {
        return x > arr[iMax] ? i : iMax;
      }, 0);
      PartyEditor.Vue.switchToPage(indexOfMaxVisible + 1);
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
      this._$pages = $(".party-editor__page");
      $(window).on("scroll", $.debounce(100, this._handleWindowScroll.bind(this)));
      $(window).on("resize", $.debounce(100, this._handleWindowResize.bind(this)));
    }
  },
  initStickyTotal: function initStickyTotal() {
    new Sticksy(".js-party-editor-sticky-total", {
      topSpacing: 20,
      listen: true
    });
  },
  scrollTop: function scrollTop(offset) {
    $("html, body").animate({
      scrollTop: offset
    });
  }
};
$(function () {
  PartyEditor.Vue = new Vue({
    el: "#party-editor",
    data: function data() {
      return {
        state: {
          currentPage: 1,
          isEditorStarted: false,
          isEditingEnabled: false,
          kidsCount: 1,
          kidsAge: "",
          deliveryPrice: 0,
          deliveryStreetName: "",
          deliveryBuildingNumber: "",
          deliveryFlatNumber: "",
          clientName: "",
          clientKidName: "",
          clientEmail: "",
          clientPhone: ""
        },
        dishes: [],
        animations: []
      };
    },
    computed: {
      dishesPrice: function dishesPrice() {
        var total = 0;
        this.dishes.forEach(function (category) {
          category.items.forEach(function (product) {
            total += product.count * product.price;
          });
        });
        return total;
      },
      animationsPrice: function animationsPrice() {
        var _this2 = this;

        var total = 0;
        this.animations.forEach(function (program) {
          if (program.selected) {
            total += program.price;

            if (_this2.state.kidsCount && _this2.state.kidsCount > program.maxKidsCount) {
              total += (_this2.state.kidsCount - program.maxKidsCount) * program.newKidsPrice;
            }
          }
        });
        return total;
      },
      deliveryPrice: function deliveryPrice() {
        return parseFloat(this.state.deliveryPrice);
      },
      totalPrice: function totalPrice() {
        return this.dishesPrice + this.animationsPrice + this.deliveryPrice;
      }
    },
    watch: {
      state: {
        handler: function handler(state) {
          if (Modernizr.localstorage) {
            localStorage.setItem("party-editor", JSON.stringify(state));
          }
        },
        deep: true
      }
    },
    methods: {
      startEditor: function startEditor() {
        this.state.isEditorStarted = true;
        this.switchToPage(2, true);
      },
      enableEditing: function enableEditing() {
        this.state.isEditingEnabled = true;
        this.switchToPage(3, true);
      },
      increaseCount: function increaseCount(product) {
        product.count++;
      },
      decreaseCount: function decreaseCount(product) {
        var newCount = product.count - 1;
        product.count = newCount < 0 ? 0 : newCount;
      },
      switchToPage: function switchToPage(pageId, withScroll) {
        this.state.currentPage = pageId;
        PartyEditor.NavMobile.switchToSlide(pageId - 2);

        if (window.matchMedia("(min-width: 1027px)").matches) {
          if (withScroll) {
            PartyEditor.scrollTop($("#party-editor__page-" + pageId).offset().top);
          }
        } else {
          $("html, body").scrollTop(0);
        }
      },
      switchToNext: function switchToNext() {
        var newPageId = this.state.currentPage + 1;
        if (newPageId > 5) return;
        this.switchToPage(newPageId, true);
      },
      switchToPrev: function switchToPrev() {
        var newPageId = this.state.currentPage - 1;
        if (newPageId < 1) return;
        this.switchToPage(newPageId, true);
      },
      reset: function reset() {
        PartyEditor.scrollTop(0);
        setTimeout(function () {
          localStorage.removeItem("party-editor");
          window.location.reload();
        }, 400);
      }
    },
    beforeMount: function beforeMount() {
      if (Modernizr.localstorage) {
        var storageData = localStorage.getItem("party-editor");

        if (storageData) {
          Object.assign(this.state, JSON.parse(storageData));
        }
      }

      var data = JSON.parse($("#party-editor-data").text());
      this.animations = data.animations;
      this.dishes = data.dishes;
    },
    mounted: function mounted() {
      PartyEditor.NavMobile.init(this.state.currentPage - 2);
      PartyEditor.NavDesktop.init();
      PartyEditor.initStickyTotal();
    }
  });
});
window.PartyEditor = PartyEditor;

/***/ })

/******/ });
//# sourceMappingURL=partyEditor.js.map
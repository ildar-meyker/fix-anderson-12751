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

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

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

      if (window.matchMedia("(max-width: 1199.98px)").matches) return;
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
      $(window).on("scroll", $.throttle(250, this._handleWindowScroll.bind(this)));
      $(window).on("resize", $.throttle(250, this._handleWindowResize.bind(this)));
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
        errors: {},
        isPopupOpen: false,
        popupProgram: {},
        state: {
          currentPage: 1,
          isEditorStarted: false,
          isEditingEnabled: false,
          isDataConfirmed: false,
          kidsCount: 1,
          kidsAgeFrom: "",
          kidsAgeTo: "",
          deliveryStreetName: "",
          deliveryBuildingNumber: "",
          deliveryFlatNumber: "",
          clientName: "",
          clientKidName: "",
          clientEmail: "",
          clientPhone: "",
          selectedDeliveryWay: 0,
          selectedAnimations: [],
          selectedDishes: {},
          comment: ""
        },
        deliveryWays: [{
          title: "До МКАД",
          price: 2000
        }, {
          title: "От 5 км. от МКАД",
          price: 3000
        }, {
          title: "До 35 км. от МКАД",
          price: 5000
        }],
        animations: [],
        dishes: []
      };
    },
    computed: {
      dishesPrice: function dishesPrice() {
        var total = 0;
        this.selectedDishes.forEach(function (product) {
          total += product.count * product.price;
        });
        return total;
      },
      animationsPrice: function animationsPrice() {
        var total = 0;
        this.selectedAnimations.forEach(function (program) {
          total += program.price + program.newKidsPrice;
        });
        return total;
      },
      deliveryPrice: function deliveryPrice() {
        return this.deliveryWays[this.state.selectedDeliveryWay].price;
      },
      totalPrice: function totalPrice() {
        return this.dishesPrice + this.animationsPrice + this.deliveryPrice;
      },
      selectedDishes: function selectedDishes() {
        var selected = [];
        this.dishes.forEach(function (category) {
          selected.push.apply(selected, _toConsumableArray(category.items.filter(function (product) {
            return product.count > 0;
          })));
        });
        return selected;
      },
      selectedAnimations: function selectedAnimations() {
        var _this2 = this;

        var selected = JSON.parse(JSON.stringify(this.animations.filter(function (program) {
          return program.selected;
        })));
        return selected.map(function (program) {
          program.newKidsPrice = _this2.state.kidsCount && _this2.state.kidsCount > program.maxKidsCount ? (_this2.state.kidsCount - program.maxKidsCount) * program.newKidsPrice : 0;
          return program;
        });
      }
    },
    watch: {
      state: {
        handler: function handler(state) {
          if (Object.keys(this.errors).length) {
            this.validate();
          }

          if (Modernizr.localstorage) {
            localStorage.setItem("party-editor", JSON.stringify(state));
          }
        },
        deep: true
      },
      selectedAnimations: {
        handler: function handler(newValue) {
          this.state.selectedAnimations = newValue.map(function (program) {
            return program.id;
          });
        },
        deep: true
      },
      selectedDishes: {
        handler: function handler(newValue) {
          var dishes = {};
          newValue.forEach(function (product) {
            dishes[product.id] = {
              count: product.count
            };
          });
          this.state.selectedDishes = dishes;
        },
        deep: true
      }
    },
    methods: {
      startEditor: function startEditor() {
        this.state.isEditorStarted = true;
        this.switchToPage(2);
      },
      enableEditing: function enableEditing() {
        this.state.isEditingEnabled = true;
        this.switchToPage(3);
      },
      validate: function validate() {
        this.errors = {};
        var self = this;
        $("#party-editor input[required]").each(function () {
          if ($(this).val().trim() === "") {
            self.errors[$(this).attr("name")] = "Поле не заполнено";
          }
        });
      },
      confirmData: function confirmData() {
        this.validate();
        if (Object.keys(this.errors).length) return;
        this.state.isEditingEnabled = true;
        this.state.isDataConfirmed = true;
        this.switchToPage(3);
      },
      increaseCount: function increaseCount(product) {
        product.count++;
      },
      decreaseCount: function decreaseCount(product) {
        var newCount = product.count - 1;
        product.count = newCount < 0 ? 0 : newCount;
      },
      openProgramInPopup: function openProgramInPopup(program) {
        this.popupProgram = program;
        this.isPopupOpen = true;
      },
      closePopup: function closePopup() {
        this.isPopupOpen = false;
      },
      toggleAnimation: function toggleAnimation(program, event) {
        if (!this.isDataConfirmed) {
          console.log(event);
        }

        program.selected = !program.selected;
      },
      scrollToNext: function scrollToNext() {
        var newPageId = this.state.currentPage + 1;
        if (newPageId > 5) return;
        this.scrollToPage(newPageId);
      },
      scrollToPrev: function scrollToPrev() {
        var newPageId = this.state.currentPage - 1;
        if (newPageId < 1) return;
        this.scrollToPage(newPageId);
      },
      scrollToPage: function scrollToPage(pageId) {
        PartyEditor.scrollTop($("#party-editor__page-" + pageId).offset().top);
      },
      switchToPage: function switchToPage(pageId) {
        this.state.currentPage = pageId;
        PartyEditor.NavMobile.switchToSlide(pageId - 2);

        if (window.matchMedia("(max-width: 1199.98px)").matches) {
          $("html, body").scrollTop($("#party-editor__nav-mobile").offset().top);
        }
      },
      formatPrice: function formatPrice(value) {
        return new Intl.NumberFormat("ru-RU", {
          style: "currency",
          currency: "RUB",
          maximumFractionDigits: 0
        }).format(value);
      },
      reset: function reset() {
        PartyEditor.scrollTop(0);
        setTimeout(function () {
          localStorage.removeItem("party-editor");
          window.location.reload();
        }, 1000);
      }
    },
    beforeMount: function beforeMount() {
      var _this3 = this;

      if (Modernizr.localstorage) {
        var storageData = localStorage.getItem("party-editor");

        if (storageData) {
          Object.assign(this.state, JSON.parse(storageData));
        }
      }

      var serverData = JSON.parse($("#party-editor-data").text());
      this.animations = serverData.animations;
      this.animations.forEach(function (program) {
        if (_this3.state.selectedAnimations.includes(program.id)) {
          program.selected = true;
        }
      });
      this.dishes = serverData.dishes;
      this.dishes.forEach(function (category) {
        category.items.forEach(function (product) {
          if (product.id in _this3.state.selectedDishes) {
            product.count = _this3.state.selectedDishes[product.id].count;
          }
        });
      });
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
import Notify from "./modules/Notify";

const PartyEditor = {
	scrollTop(offset) {
		$("html, body").animate({
			scrollTop: offset,
		});
	},

	init() {
		new Sticksy(".js-party-editor-sticky-total", {
			topSpacing: 20,
			listen: true,
		});
	},
};

PartyEditor.Tooltips = {
	_$tooltips: $(),

	_timers: {},

	_isTooltipWasOpen: false,

	_handleWindowScroll(e) {
		this.closeAllTooltips();
	},

	closeAllTooltips() {
		if (!this._isTooltipWasOpen) return;

		this._$tooltips.removeClass("active");
		this._isTooltipWasOpen = false;
	},

	showTooltip(selector, target) {
		clearTimeout(this._timers[selector]);

		const $tooltip = $(selector);
		const tooltipWidth = $tooltip.outerWidth();
		const windowWidth = $(window).width();

		const $target = $(target);
		const targetOffset = $target.offset();
		const targetWidth = $target.outerWidth();

		let left = targetOffset.left + targetWidth / 2;
		let top = targetOffset.top;

		const calcLeft = left - 30;
		const calcRight = left + tooltipWidth - 30;

		let fixLeft = 0;

		if (calcLeft < 15) {
			fixLeft = 15 - calcLeft;
		}

		if (calcRight > windowWidth - 15) {
			fixLeft = windowWidth - 15 - calcRight;
		}

		$tooltip
			.css({
				top: top,
				left: left + fixLeft,
			})
			.addClass("active")
			.find(".party-editor__tooltip__angle")
			.css({
				marginLeft: -fixLeft,
			});

		this._isTooltipWasOpen = true;

		this._timers[selector] = setTimeout(() => {
			PartyEditor.Tooltips.hideTooltip(selector);
		}, 5000);
	},

	hideTooltip(selector) {
		$(selector).removeClass("active");
	},

	init() {
		this._$tooltips = $(".party-editor__tooltip");

		$(window).on(
			"scroll",
			$.throttle(250, this._handleWindowScroll.bind(this))
		);
	},
};

PartyEditor.NavMobile = {
	_$slider: $(),

	switchToSlide(index) {
		this._$slider.slick("slickGoTo", index);
	},

	init(index) {
		this._$slider = $("#party-editor__nav-mobile__slider");

		this._$slider.slick({
			initialSlide: index,
			centerMode: true,
			variableWidth: true,
			infinite: false,
			arrows: false,
			draggable: false,
			touchMove: false,
			swipe: false,
		});
	},
};

PartyEditor.NavDesktop = {
	_$pages: $(),

	_handleWindowScroll(e) {
		this._calcCurrentPage();
	},

	_handleWindowResize(e) {
		this._calcCurrentPage();
	},

	_calcCurrentPage() {
		if (window.matchMedia("(max-width: 1199.98px)").matches) return;

		const pagesVisiblity = [];

		this._$pages.each((index, element) => {
			pagesVisiblity.push(this._percentWithinViewport($(element)));
		});

		const indexOfMaxVisible = pagesVisiblity.reduce(
			(iMax, x, i, arr) => (x > arr[iMax] ? i : iMax),
			0
		);

		PartyEditor.Vue.switchToPage(indexOfMaxVisible + 1);
	},

	_percentWithinViewport($element) {
		const elementTop = $element.offset().top;
		const scrollTop = $(window).scrollTop();
		const spaceTop = elementTop - scrollTop;
		const elementHeight = $element.height();
		const screenHeight = $(window).height();
		const scrollBottom = scrollTop + screenHeight;
		const bottomElement = elementTop + $element.height();
		const spaceBottom = bottomElement - scrollBottom;
		let heightInScreen = elementHeight - spaceBottom;
		let percentage;

		if (spaceTop < 0) {
			heightInScreen -= spaceTop * -1;
		}

		if (spaceBottom < 0) {
			heightInScreen -= spaceBottom * -1;
		}

		percentage = (heightInScreen / screenHeight) * 100;
		percentage = percentage < 0 ? 0 : percentage;

		return percentage;
	},

	init() {
		this._$pages = $(".party-editor__page");

		$(window).on(
			"scroll",
			$.throttle(250, this._handleWindowScroll.bind(this))
		);

		$(window).on(
			"resize",
			$.throttle(250, this._handleWindowResize.bind(this))
		);
	},
};

PartyEditor.Calendar = {
	_cafeId: null,

	_handleDropdownButton(e) {
		e.preventDefault();

		this.toggleDropdown();
	},

	_handleOutsideClick(e) {
		if ($(e.target).closest(".party-editor__clndr__loader").length) {
			return;
		}

		if (!$(e.target).closest(".party-editor__clndr__dropdown").length) {
			this.closeDropdown();
		}

		if (
			!$(e.target).closest(".party-editor__clndr__months__center").length
		) {
			this.closeMonthDropdown();
		}
	},

	_handleInputKeyup(e) {
		const $input = $(e.currentTarget).find("input");
		const inputValue = $input.val().trim().toLowerCase();

		$("#party-editor__clndr__dropdown__list a").each(function () {
			const itemText = $(this).text().trim().toLowerCase();
			if (itemText.indexOf(inputValue) === -1) {
				$(this).hide();
			} else {
				$(this).show();
			}
		});
	},

	_handleDropdownItem(e) {
		e.preventDefault();

		const cafeId = (this._cafeId = $(e.currentTarget).data("cafe"));
		const url = $("#party-editor__clndr").data("url");
		const query = "?cafeId=" + cafeId;

		this.closeDropdown();
		this.loadNewClndr(url + query);
	},

	_handleClndrLoad(e) {
		e.preventDefault();

		const time = $(e.currentTarget).data("time");
		const url = $("#party-editor__clndr").data("url");
		const query = "?cafeId=" + this._cafeId + "&time=" + time;

		this.loadNewClndr(url + query);
	},

	_handleMonthButton(e) {
		e.preventDefault();

		this.openMonthDropdown();
	},

	_handleBeforeChange(event, slick, currentSlide, nextSlide) {
		this.setActiveGrid(nextSlide);
	},

	_handleBookingApply(e) {
		e.preventDefault();

		const cafeName = $("#party-editor__clndr__dropdown > button")
			.text()
			.trim();
		const time = $(e.currentTarget).data("time");

		PartyEditor.Vue.state.bookingInfo = cafeName + ", " + time;
	},

	_handleBookingReset(e) {
		e.preventDefault();

		PartyEditor.Vue.state.bookingInfo = "";

		setTimeout(() => {
			PartyEditor.Calendar.refreshHallsSlider();
		}, 0);
	},

	showLoader() {
		$("#party-editor__clndr__loader").addClass("active");
	},

	hideLoader() {
		$("#party-editor__clndr__loader").removeClass("active");
	},

	loadNewClndr(url) {
		this.showLoader();

		$.get(url)
			.done((data) => {
				$("#party-editor__clndr__data").html(data);
				this.initHallsSlider();
			})
			.fail((xhr) => {
				console.log(xhr);
				Notify.error(`GET: ${url}, ${xhr.status}, ${xhr.statusText}`);
			})
			.always(() => {
				this.hideLoader();
			});
	},

	openDropdown() {
		$("#party-editor__clndr__dropdown").addClass("active");
	},

	closeDropdown() {
		$("#party-editor__clndr__dropdown").removeClass("active");
	},

	toggleDropdown() {
		const $dropdown = $("#party-editor__clndr__dropdown");
		$dropdown.toggleClass("active", !$dropdown.hasClass("active"));
	},

	openMonthDropdown() {
		$("#party-editor__clndr__months__dropdown").addClass("active");
	},

	closeMonthDropdown() {
		$("#party-editor__clndr__months__dropdown").removeClass("active");
	},

	initHallsSlider() {
		const $root = $("#party-editor__clndr__halls");
		$root.find(".party-editor__clndr__halls__list").slick({
			infinite: false,
			prevArrow: $root.find(".party-editor__clndr__halls__prev"),
			nextArrow: $root.find(".party-editor__clndr__halls__next"),
		});
	},

	refreshHallsSlider() {
		$(
			"#party-editor__clndr__halls .party-editor__clndr__halls__list"
		).slick("setPosition");
	},

	setActiveGrid(index) {
		$("#party-editor__clndr__grids")
			.children()
			.removeClass("active")
			.eq(index)
			.addClass("active");
	},

	init() {
		this.initHallsSlider();

		$(document).on(
			"click",
			".party-editor__clndr__dropdown__button",
			this._handleDropdownButton.bind(this)
		);

		$(document).on(
			"keyup",
			".party-editor__clndr__dropdown__filter",
			$.debounce(250, this._handleInputKeyup.bind(this))
		);

		$(document).on(
			"click",
			".party-editor__clndr__dropdown__list a",
			this._handleDropdownItem.bind(this)
		);

		$(document).on(
			"click",
			".party-editor__clndr__months__button",
			this._handleMonthButton.bind(this)
		);

		$(document).on(
			"beforeChange",
			".party-editor__clndr__halls",
			this._handleBeforeChange.bind(this)
		);

		$(document).on(
			"click",
			".js-party-editor-clndr-load",
			this._handleClndrLoad.bind(this)
		);

		$(document).on(
			"click",
			".party-editor__clndr__book",
			this._handleBookingApply.bind(this)
		);

		$(document).on(
			"click",
			".party-editor__booking__reset a",
			this._handleBookingReset.bind(this)
		);

		$(document).on("click", this._handleOutsideClick.bind(this));
	},
};

$(function () {
	PartyEditor.Vue = new Vue({
		el: "#party-editor",

		data() {
			return {
				errors: {},

				isPopupOpen: false,
				popupProgram: {},

				state: {
					currentPage: 1,
					isEditorStarted: false,
					isEditingEnabled: false,
					isDataConfirmed: false,

					bookingInfo: "",

					kidsCount: "1",
					kidsAgeFrom: "",
					kidsAgeTo: "",

					deliveryStreetName: "",
					deliveryBuildingNumber: "",
					deliveryFlatNumber: "",

					clientName: "",
					clientKidName: "",
					clientEmail: "",
					clientPhone: "",

					selectedGettingWay: "delivery",
					selectedDeliveryWay: "0",
					selectedAnimations: [],
					selectedDishes: {},

					comment: "",
				},
				deliveryWays: [
					{
						title: "До МКАД",
						price: 2000,
					},
					{
						title: "От 5 км. от МКАД",
						price: 3000,
					},
					{
						title: "До 35 км. от МКАД",
						price: 5000,
					},
				],
				animations: [],
				dishes: [],
			};
		},

		computed: {
			dishesPrice() {
				let total = 0;

				this.selectedDishes.forEach((product) => {
					total += product.count * product.price;
				});

				return total;
			},

			animationsPrice() {
				let total = 0;

				this.selectedAnimations.forEach((program) => {
					total += program.price + program.newKidsPrice;
				});

				return total;
			},

			deliveryPrice() {
				if (this.state.selectedGettingWay === "booking") {
					return 0;
				}

				return this.deliveryWays[this.state.selectedDeliveryWay].price;
			},

			totalPrice() {
				return (
					this.dishesPrice + this.animationsPrice + this.deliveryPrice
				);
			},

			selectedDishes() {
				let selected = [];

				this.dishes.forEach((category) => {
					selected.push(
						...category.items.filter((product) => {
							return product.count > 0;
						})
					);
				});

				return selected;
			},

			selectedAnimations() {
				const selected = JSON.parse(
					JSON.stringify(
						this.animations.filter((program) => {
							return program.selected;
						})
					)
				);

				return selected.map((program) => {
					program.newKidsPrice =
						this.state.kidsCount &&
						this.state.kidsCount > program.maxKidsCount
							? (this.state.kidsCount - program.maxKidsCount) *
							  program.newKidsPrice
							: 0;

					return program;
				});
			},
		},

		watch: {
			state: {
				handler: function (state) {
					if (Object.keys(this.errors).length) {
						this.validate();
					}

					if (Modernizr.localstorage) {
						localStorage.setItem(
							"party-editor",
							JSON.stringify(state)
						);
					}
				},
				deep: true,
			},

			"state.selectedGettingWay"(newValue) {
				if (newValue === "booking") {
					setTimeout(() => {
						PartyEditor.Calendar.refreshHallsSlider();
					}, 0);
				}
			},

			selectedAnimations: {
				handler: function (newValue) {
					this.state.selectedAnimations = newValue.map((program) => {
						return program.id;
					});
				},
				deep: true,
			},

			selectedDishes: {
				handler: function (newValue) {
					const dishes = {};

					newValue.forEach((product) => {
						dishes[product.id] = { count: product.count };
					});

					this.state.selectedDishes = dishes;
				},
				deep: true,
			},
		},

		methods: {
			startEditor() {
				this.state.isEditorStarted = true;

				this.switchToPage(2);
			},

			enableEditing() {
				this.state.isEditingEnabled = true;

				this.switchToPage(3);
			},

			validate() {
				this.errors = {};

				const self = this;

				$("#party-editor input[required]:visible").each(function () {
					const key = $(this).attr("name");

					if (self.state[key].trim() === "") {
						self.errors[key] = "Поле не заполнено";
					}
				});
			},

			confirmData(event) {
				this.validate();

				if (Object.keys(this.errors).length) {
					setTimeout(() => {
						PartyEditor.Tooltips.showTooltip(
							"#party-editor__errors-tooltip",
							event.target
						);
					}, 100);
					return;
				}

				this.state.isEditingEnabled = true;
				this.state.isDataConfirmed = true;

				this.switchToPage(3);
			},

			increaseCount(product, event) {
				if (!this.state.isDataConfirmed) {
					PartyEditor.Tooltips.showTooltip(
						"#party-editor__confirm-tooltip",
						event.target
					);
					return;
				}

				product.count++;
			},

			decreaseCount(product, event) {
				if (!this.state.isDataConfirmed) {
					PartyEditor.Tooltips.showTooltip(
						"#party-editor__confirm-tooltip",
						event.target
					);
					return;
				}

				const newCount = product.count - 1;
				product.count = newCount < 0 ? 0 : newCount;
			},

			openProgramInPopup(program) {
				this.popupProgram = program;
				this.isPopupOpen = true;
				PartyEditor.Tooltips.hideTooltip(
					"#party-editor__confirm-tooltip"
				);
			},

			closePopup() {
				this.isPopupOpen = false;
				PartyEditor.Tooltips.hideTooltip(
					"#party-editor__confirm-tooltip"
				);
			},

			toggleAnimation(program, event) {
				if (!this.state.isDataConfirmed) {
					PartyEditor.Tooltips.showTooltip(
						"#party-editor__confirm-tooltip",
						event.target
					);
					return;
				}

				program.selected = !program.selected;
			},

			scrollToNext() {
				const newPageId = this.state.currentPage + 1;
				if (newPageId > 5) return;
				this.scrollToPage(newPageId);
			},

			scrollToPrev() {
				const newPageId = this.state.currentPage - 1;
				if (newPageId < 1) return;
				this.scrollToPage(newPageId);
			},

			scrollToPage(pageId) {
				PartyEditor.scrollTop(
					$("#party-editor__page-" + pageId).offset().top
				);
			},

			switchToPage(pageId) {
				this.state.currentPage = pageId;

				PartyEditor.NavMobile.switchToSlide(pageId - 2);

				if (window.matchMedia("(max-width: 1199.98px)").matches) {
					$("html, body").scrollTop(
						$("#party-editor__nav-mobile").offset().top
					);
				}
			},

			formatPrice(value) {
				return new Intl.NumberFormat("ru-RU", {
					style: "currency",
					currency: "RUB",
					maximumFractionDigits: 0,
				}).format(value);
			},

			reset() {
				PartyEditor.scrollTop(0);

				setTimeout(() => {
					localStorage.removeItem("party-editor");
					window.location.reload();
				}, 1000);
			},
		},

		beforeMount() {
			if (Modernizr.localstorage) {
				const storageData = localStorage.getItem("party-editor");
				if (storageData) {
					Object.assign(this.state, JSON.parse(storageData));
				}
			}

			const serverData = JSON.parse($("#party-editor-data").text());

			this.animations = serverData.animations;
			this.animations.forEach((program) => {
				if (this.state.selectedAnimations.includes(program.id)) {
					program.selected = true;
				}
			});

			this.dishes = serverData.dishes;
			this.dishes.forEach((category) => {
				category.items.forEach((product) => {
					if (product.id in this.state.selectedDishes) {
						product.count =
							this.state.selectedDishes[product.id].count;
					}
				});
			});
		},

		mounted() {
			PartyEditor.NavMobile.init(this.state.currentPage - 2);
			PartyEditor.NavDesktop.init();
			PartyEditor.Tooltips.init();
			PartyEditor.Calendar.init();
			PartyEditor.init();
		},
	});
});

window.PartyEditor = PartyEditor;

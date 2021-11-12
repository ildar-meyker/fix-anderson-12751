const PartyEditor = {
	NavMobile: {
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
	},

	NavDesktop: {
		_$pages: $(),

		_handleWindowScroll(e) {
			this._calcCurrentPage();
		},

		_handleWindowResize(e) {
			this._calcCurrentPage();
		},

		_calcCurrentPage() {
			if (window.matchMedia("(max-width: 1026.98px)").matches) return;

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
				$.debounce(100, this._handleWindowScroll.bind(this))
			);

			$(window).on(
				"resize",
				$.debounce(100, this._handleWindowResize.bind(this))
			);
		},
	},

	initStickyTotal() {
		new Sticksy(".js-party-editor-sticky-total", {
			topSpacing: 20,
			listen: true,
		});
	},

	scrollTop(offset) {
		$("html, body").animate({
			scrollTop: offset,
		});
	},
};

$(function () {
	PartyEditor.Vue = new Vue({
		el: "#party-editor",

		data() {
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
					clientPhone: "",
				},
				dishes: [],
				animations: [],
			};
		},

		computed: {
			dishesPrice() {
				let total = 0;

				this.dishes.forEach((category) => {
					category.items.forEach((product) => {
						total += product.count * product.price;
					});
				});

				return total;
			},

			animationsPrice() {
				let total = 0;

				this.animations.forEach((program) => {
					if (program.selected) {
						total += program.price;

						if (
							this.state.kidsCount &&
							this.state.kidsCount > program.maxKidsCount
						) {
							total +=
								(this.state.kidsCount - program.maxKidsCount) *
								program.newKidsPrice;
						}
					}
				});

				return total;
			},

			deliveryPrice() {
				return parseFloat(this.state.deliveryPrice);
			},

			totalPrice() {
				return (
					this.dishesPrice + this.animationsPrice + this.deliveryPrice
				);
			},
		},

		watch: {
			state: {
				handler: function (state) {
					if (Modernizr.localstorage) {
						localStorage.setItem(
							"party-editor",
							JSON.stringify(state)
						);
					}
				},
				deep: true,
			},
		},

		methods: {
			startEditor() {
				this.state.isEditorStarted = true;

				this.switchToPage(2, true);
			},

			enableEditing() {
				this.state.isEditingEnabled = true;

				this.switchToPage(3, true);
			},

			increaseCount(product) {
				product.count++;
			},

			decreaseCount(product) {
				const newCount = product.count - 1;
				product.count = newCount < 0 ? 0 : newCount;
			},

			switchToPage(pageId, withScroll) {
				this.state.currentPage = pageId;

				PartyEditor.NavMobile.switchToSlide(pageId - 2);

				if (window.matchMedia("(min-width: 1027px)").matches) {
					if (withScroll) {
						PartyEditor.scrollTop(
							$("#party-editor__page-" + pageId).offset().top
						);
					}
				} else {
					$("html, body").scrollTop(0);
				}
			},

			switchToNext() {
				const newPageId = this.state.currentPage + 1;
				if (newPageId > 5) return;
				this.switchToPage(newPageId, true);
			},

			switchToPrev() {
				const newPageId = this.state.currentPage - 1;
				if (newPageId < 1) return;
				this.switchToPage(newPageId, true);
			},

			reset() {
				PartyEditor.scrollTop(0);

				setTimeout(function () {
					localStorage.removeItem("party-editor");
					window.location.reload();
				}, 400);
			},
		},

		beforeMount() {
			if (Modernizr.localstorage) {
				const storageData = localStorage.getItem("party-editor");
				if (storageData) {
					Object.assign(this.state, JSON.parse(storageData));
				}
			}

			const data = JSON.parse($("#party-editor-data").text());
			this.animations = data.animations;
			this.dishes = data.dishes;
		},

		mounted() {
			PartyEditor.NavMobile.init(this.state.currentPage - 2);
			PartyEditor.NavDesktop.init();
			PartyEditor.initStickyTotal();
		},
	});
});

window.PartyEditor = PartyEditor;

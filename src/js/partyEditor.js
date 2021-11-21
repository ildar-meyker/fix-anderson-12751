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
				errors: {},

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

				$("#party-editor input[required]").each(function () {
					if ($(this).val().trim() === "") {
						self.errors[$(this).attr("name")] = "Поле не заполнено";
					}
				});
			},

			confirmData() {
				this.validate();

				if (Object.keys(this.errors).length) return;

				this.state.isEditingEnabled = true;
				this.state.isDataConfirmed = true;

				this.switchToPage(3);
			},

			increaseCount(product) {
				product.count++;
			},

			decreaseCount(product) {
				const newCount = product.count - 1;
				product.count = newCount < 0 ? 0 : newCount;
			},

			toggleAnimation(program, event) {
				if (!this.isDataConfirmed) {
					console.log(event);
				}

				program.selected = !program.selected;
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

			switchToNext() {
				const newPageId = this.state.currentPage + 1;
				if (newPageId > 5) return;
				this.scrollToPage(newPageId);
			},

			switchToPrev() {
				const newPageId = this.state.currentPage - 1;
				if (newPageId < 1) return;
				this.scrollToPage(newPageId);
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
			PartyEditor.initStickyTotal();
		},
	});
});

window.PartyEditor = PartyEditor;

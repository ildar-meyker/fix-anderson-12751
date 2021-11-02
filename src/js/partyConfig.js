const PartyConfig = {};

PartyConfig.HeroesSlider = {
	_$sliders: $(),

	_destroySliders() {
		try {
			this._$sliders.slick("unslick");
		} catch (e) {}
	},

	_initSliders() {
		this._$sliders.each(function () {
			const $root = $(this).closest(".party-config__heroes");
			$(this).slick({
				prevArrow: $root.find(".party-config__heroes__prev"),
				nextArrow: $root.find(".party-config__heroes__next"),
				slidesToShow: 1,
				dots: true,
			});
		});
	},

	_onResize(mql) {
		mql.matches ? this._initSliders() : this._destroySliders();
	},

	init() {
		this._$sliders = $(".party-config__heroes__row");

		const mql = window.matchMedia("(max-width: 767.98px)");

		mql.addListener(this._onResize.bind(this));

		this._onResize(mql);
	},
};

PartyConfig.StickyTotal = {
	init() {
		new Sticksy(".js-sticky-widget", { topSpacing: 20 });
	},
};

PartyConfig.StickyHeader = {
	init() {},
};

$(function () {
	PartyConfig.StickyTotal.init();
	PartyConfig.HeroesSlider.init();
	PartyConfig.StickyHeader.init();
});

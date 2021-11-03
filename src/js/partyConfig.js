const PartyConfig = {};

PartyConfig.StickyTotal = {
	init() {
		new Sticksy(".js-sticky-widget", { topSpacing: 20 });
	},
};

PartyConfig.StickyTabs = {
	_$groups: $(),

	_scrollHandlingFrozen: false,

	_tabsOffset: 0,

	_handleWindowScroll(e) {
		if (this._scrollHandlingFrozen) return;

		const scrollTop = $(window).scrollTop();
		const state = scrollTop > this._tabsOffset;

		$("#party-config__nav-desktop-clone").toggleClass("active", state);
		$("#party-config__nav-desktop").toggleClass("fixed", state);

		this._setActiveGroup();
	},

	_handleWindowResize(e) {
		this._updateTabsOffset();
	},

	_handleTabClick(e) {
		e.preventDefault();

		this._scrollHandlingFrozen = true;
		$("html, body").animate(
			{
				scrollTop:
					$($(e.currentTarget).attr("href")).offset().top - 120,
			},
			500,
			() => {
				this._scrollHandlingFrozen = false;
			}
		);

		const index = $(e.currentTarget).index();
		this._setActiveTab(index);
	},

	_updateTabsOffset() {
		this._tabsOffset = $("#party-config__nav-desktop-clone").offset().top;
	},

	_setActiveTab(index) {
		$("#party-config__nav-desktop")
			.children()
			.removeClass("active history")
			.eq(index)
			.addClass("active")
			.prevAll()
			.addClass("history");
	},

	_setActiveGroup() {
		const percentages = [];

		this._$groups.each((index, element) => {
			percentages.push(this._percentWithinViewport($(element)));
		});

		const indexOfMaxValue = percentages.reduce(
			(iMax, x, i, arr) => (x > arr[iMax] ? i : iMax),
			0
		);

		this._setActiveTab(indexOfMaxValue);
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
		$(window).on(
			"scroll",
			$.throttle(100, this._handleWindowScroll.bind(this))
		);

		$(window).on(
			"resize",
			$.throttle(250, this._handleWindowResize.bind(this))
		);

		$(document).on(
			"click",
			".party-config__nav-desktop__item",
			this._handleTabClick.bind(this)
		);

		this._updateTabsOffset();

		this._$groups = $("#party-config__groups .party-config__group");
	},
};

$(function () {
	PartyConfig.StickyTotal.init();
	PartyConfig.StickyTabs.init();
});

window.PartyConfig = PartyConfig;

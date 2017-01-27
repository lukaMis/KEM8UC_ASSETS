// JavaScript Document

$(function () {
	
	function getParameterByName(name) {
		var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
		return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
	}
	
	i18n.init({
		lng: getParameterByName("locale") || $("html").attr("lang") || "sl",
		resGetPath: "assets/localization/locale-__lng__.json",
		fallbackLng: false,
		load: "unspecific"
	}).done(function() {
		$(document).i18n();
		$(document).trigger("i18nComplete");
	});
	
});
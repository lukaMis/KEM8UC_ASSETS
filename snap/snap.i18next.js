// JavaScript Document

Snap.plugin(function (Snap, Element, Paper, global, Fragment) {
    Paper.prototype.i18n = function () {
		this.selectAll("text").forEach(function (el) {
			var txt = el.attr("text"),
				reg = /\[i18n\]/;
			if (reg.test(txt)) {
				el.attr({
					text: i18n.t(txt.replace(reg, ""))
				});
			}
		})
	};
	// TODO: implement for element
});
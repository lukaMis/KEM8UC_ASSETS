Snap.plugin(function (Snap, Element, Paper, global, Fragment) {	
    Element.prototype.slider = function () {
	    var self = this,
	    	instance,
	    	S = function () {
				var width = self.select(Snap.cs("slider-line")).getBBox().width,
					dot = self.select(Snap.cs("slider-dot")),
					position = 0,
					sliderStartPosition = 0;
					
				dot.drag(function (dx, dy) {
					position = Math.min(Math.max(sliderStartPosition + dx, 0), width);
					dot.transform(new Snap.matrix().translate(position, 0));
					$(self.node).trigger("sliderMove", position / width);
				}, function () {
					sliderStartPosition = position;
				}, function () {
					
				});
			
				return {
					position: function (p) {
						if (p) {
							position = p * width;
							dot.transform(new Snap.matrix().translate(position, 0));
							$(self.node).trigger("sliderMove", position / width);
						}
						return position / width;
					},
					node: self.node,
					self: self
				}
			}

		return instance = instance || new S();
    };
    
    Element.prototype.clear = function() {
	    this.selectAll("*").forEach(function (el) {
		   el.remove(); 
	    });
    };
    
    Paper.prototype.drawDot = function(x, y, r) {
	    var radius = r || 5,
	    	circle = this.circle(x, y, radius);
	    circle.attr({
		    fill: "red"
	    })
	    this.append(circle);
    }
    
    Element.prototype.flipSwitch = function () {
	    var self = this,
	    	state = false,
	    	instance;
	    	
	    self.click(function () {
			state = !state;
			onClick();
			$(self.node).trigger("flipSwitchClick", {
				state: state,
				self: self
			});
		});
	    
	    function onClick()  {
			self.toggleClass("active", state);
	    }
	    
	    self.flipSwitch = function () {
		    return instance;
	    }
	    	
	    return instance = {
		    state: function (s) {
			    if (s !== undefined) {
				    state = s;
				    onClick();
				}
			    return state;
			},
		    node: self.node,
		    self: self
		};
    };
    
    Element.prototype.simpleButton = function (id) {
	    var self = this,
	    	state = false,
	    	instance;
	    	
	    self.click(function () {
			state = !state;
			onClick();
			$(self.node).trigger("buttonClick", {
				state: state,
				self: self,
				id: id
			});
		});
	    
	    function onClick()  {
			self.toggleClass("pressed", state);
	    }
	    
	    self.simpleButton = function () {
		    return instance;
	    }
	    	
	    return instance = {
		    state: function (s) {
			    if (s !== undefined) {
				    state = s;
				    onClick();
				}
			    return state;
			},
		    node: self.node,
		    self: self
		};
    };

    
    Element.prototype.dropDown = function () {
	    var self = this,
	    	instance,
	    	opened = false,
	    	dd = self.select(Snap.cs("drop-down")),
	    	hit = self.select(Snap.cs("hit")),
	    	items = dd.selectAll(Snap.cs("item")),
	    	pattern = /item-[\d]+/,
	    	numberPattern = /[\d]+/,
	    	displayText = hit.select("text");
	    	
	    	function changeState(s) {
		    	dd.toggleClass("hide", !opened);
	    	}
	    	
	    	function selectItem(item) {
		    	
	    	}
	    	
	    	self.dropDown = function () {
		    	return instance;
	    	}
	    	
	    	hit.click(function (e) {
		    	opened = true;
		    	changeState(opened);
		    	e.stopPropagation();
	    	});
	    	$(document).click(function (e) {
		    	opened = false;
		    	changeState(opened);
	    	})
	    	items.forEach(function (el) {
		    	el.click(function (e) {
			    	var id = pattern.exec(e.currentTarget.id),
			    		txtNode = el.select("text");
			    	displayText.attr({
				    	text: txtNode.attr("text")
			    	});
			    	$(self.node).trigger("dropDownSelect", {
				    	selection: parseInt(numberPattern.exec(id))
			    	});
		    	})
	    	})
	    	 
	    	changeState(opened);
	    	
	    	return instance = {
		    	node: self.node,
		    	self: self,
		    	select: function (item) {
			    	selectItem(item);
			    	var id = "item-" + ("0" + (item + 1)).substr(0,2);
			    		txtNode = dd.select(Snap.cs(id)).select("text");
			    	displayText.attr({
				    	text: txtNode.attr("text")
			    	});
		    	}
	    	};
    }
    
    Element.prototype.rotate = function (cx, cy) {
	    var self = this,
	    	instance,
	    	angle = 0,
	    	startAngle,
	    	startMatrix = self.transform().localMatrix,
	    	mouseStartAngle,
	    	thisBBox = self.getBBox(),
	    	limitLow, limitHigh,
	    	lx, ly;
	    
	    cx = cx || thisBBox.cx;
	    cy = cy || thisBBox.cy;
	    lx = cx - startMatrix.split().dx;
	    ly = cy - startMatrix.split().dy;

	    function dragStart(x, y) {
		    mouseStartAngle = Math.atan2(y - cy, x - cx);
		    startAngle = angle;
		    $(self.node).trigger("rotateStart", angle);
	    }
	    function dragMove(dx, dy, x, y) {
		    var tempAngle = Math.atan2(y - cy, x - cx) - mouseStartAngle;
			//angle = Snap.floatReminder(startAngle + tempAngle, 2 * Math.PI);
		    angle = startAngle + tempAngle, 2 * Math.PI;
		    angle = angleInterval(angle);
		    if (limitLow) angle = Math.max(limitLow, angle);
		    if (limitHigh) angle = Math.min(limitHigh, angle);
		    redraw(angle);
		    $(self.node).trigger("rotateMove", angle);
	    }
	    function dragEnd() {
		     $(self.node).trigger("rotateEnd", angle);
	    }
	    function redraw(a) {
		    a = Snap.floatReminder(a, 2 * Math.PI);
		    self.transform(startMatrix.clone().rotate(Snap.deg(a), lx, ly));
	    }
	    function angleInterval(a) {
		    a = a > Math.PI ? a - 2 * Math.PI : a;
		    a = a < -Math.PI ? a + 2 * Math.PI : a;
		    return a;
	    }
	    
	    self.drag(dragMove, dragStart, dragEnd);
	    
	    self.rotate = function () {
		    return instance;
	    }
	    
	    return instance = {
		    angle: function (a) {
			    if (a) {
				    angle = a;
				    redraw(angle);
			    }
			    return angle;
		    },
		    limit: function (a1, a2) {
				limitHigh = Math.max(a1, a2);
				limitLow = Math.min(a1, a2);
		    },
		    center: function (c1, c2) {
			    cx = c1;
			    cy = c2;
			    lx = cx - startMatrix.split().dx;
				ly = cy - startMatrix.split().dy;
		    }
	    }
    }
    Snap.floatReminder = function (x, y) {
			var d = Math.floor(x / y);
			return x - d * y;
		}
    Snap.cs = function (s1, s2) {
	    var str = "*[id*=" + s1 + "]";
	    if (s2) str += " " + "*[id*=" + s2 + "]"
	    return str;
    }
    
    Paper.prototype.offCanvas = function () {
	    var self = this,
	    	instance,
	    	opened = false,
	    	panel, panelWidth,
	    	open, close,
	    	duration = 500;
	    
	    panel = self.select(Snap.cs("offcanvas", "panel"));
	    panelWidth = panel.getBBox().width;
	    open = self.select(Snap.cs("open"));
	    close = self.select(Snap.cs("close"));
	    
	    function toggleOpened(s) {
			opened = s || !opened;
			self.toggleClass("open", opened);
			//open.toggleClass("active", !opened);
			close.toggleClass("active", opened);
			
			var split = self.attr("viewBox").vb.split(" ");
			Snap.animate(split, [opened ? -panelWidth : 0, split[1], split[2], split[3]], function(values) {
				self.attr("viewBox", values.join(" ")); 
			}, duration, mina.easeinout, function () {
				if (!opened) triggerEvent(opened);
			});
			
			if (opened) triggerEvent(opened);
	    }
	    
	    function triggerEvent(o) {
		    $(self.node).trigger("offcanvasStateChange", {
				opened: opened
			});
	    }
	    
	    function onClick() {
		    toggleOpened();
	    }
	    
	    open.click(onClick);
		close.click(onClick);
	    open.addClass("active");
	    self.addClass("offcanvas");
	    
	    self.offCanvas = function () {
		    return instance;
	    }
	    
	    return instance = {
		    disable: function () {
			    open.unclick(onClick);
				close.unclick(onClick);
		    },
		    enable: function () {
			    open.click(onClick);
				close.click(onClick);
		    },
		    setState: function (s) {
			    toggleOpened(s);
		    },
		    open: function () {
			    toggleOpened(true);
		    },
		    close: function () {
			    toggleOpenes(false);
		    },
		    setDuration: function (d) {
			    duration = d;
		    }
	    }
    }
});

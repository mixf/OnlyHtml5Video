/*
	This is Dom element utilities (development).
	In production, the utils object will be contained by the OnlyHtml5Video Object.
*/
window.utils = function(){
	var utils = {
		createProgress: function(callback){
			var total = document.createElement("DIV");
			total.className = "total";
			var current = document.createElement("DIV");
			current.className = "current";
			total.appendChild(current);
			total.current = current;

			this.on(total, "click", function(e){
				var totalOffset = this.offsetWidth;
				var offset = e.offsetX;
				//update the progress
				current.style.width = (offset / totalOffset  * 100) + "%";
				//console.log("click");

				callback(offset / totalOffset);
			});
			//move mouse to slide when the mouse is pressing
			var leftButtonPressing = false;
			this.on(total, "mousedown", function(e){
				if(e.button === 0){//left button
					leftButtonPressing = true;
				}
				//console.log("down");
			});
			this.on(total, "mouseup", function(e){
				if(e.button === 0){//left button
					leftButtonPressing = false;
				}
				//console.log("up");
			});
			this.on(total, "mousemove", function(e){
				//console.log("move");
				if(leftButtonPressing && e.button === 0){//left button is pressing
					var totalOffset = this.offsetWidth;
					var offset = e.offsetX;
					//update the progress
					current.style.width = (offset / totalOffset  * 100) + "%";
				}
			});

			return total;
		},
		//DOM utility
		hasClass: function(ele, cls) {
		    return ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
		},
		addClass: function(ele, cls) {
		    if (!this.hasClass(ele, cls)) ele.className += " " + cls;
		},
		removeClass: function(ele, cls) {
	        var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
	        ele.className = ele.className.replace(reg, '');
		},
		replaceClass: function (ele, oldClass, newClass) {
	        this.removeClass(ele, oldClass);
	        this.addClass(ele, newClass);
		},
		toggleClass: function(ele, cls1, cls2) {
		    if (this.hasClass(ele, cls1)) {
		        this.replaceClass(ele, cls1, cls2);
		    } else if (this.hasClass(ele, cls2)) {
		        this.replaceClass(ele, cls2, cls1);
		    } else {
		        this.addClass(ele, cls1);
		    }
		},
		on: function(el, evt, fn){
			el.addEventListener(evt, fn, false);
		},
		warp : function(el, warpper){
			var parent = el.parentNode;
			// set the wrapper as child (instead of the element)
			parent.replaceChild(warpper, el);
			// insert target into warpper
			warpper.appendChild(el);
		},
		setAttributes : function(el, attrs){
			for (var key in attrs) {
				if(attrs.hasOwnProperty(key)){
					el.setAttribute(key, attrs[key]);
				}
			};
		}
	}

	return utils;
}()
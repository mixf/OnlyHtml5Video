/*
	This is Dom element utilities (development).
	In production, the utils object will be contained by the OnlyHtml5Video Object.
*/
window.utils = function(){
	var utils = {
		//co
		createProgress: function(callback){
			var duration = document.createElement("DIV");
			duration.className = "duration";
			var current = document.createElement("DIV");
			current.className = "current";
			duration.appendChild(current);
			duration.current = current;

			this.on(duration, "click", function(e){
				var totalOffset = this.offsetWidth;
				var offset = e.offsetX;
				//update the progress
				current.style.width = (offset / totalOffset  * 100) + "%";
				console.log("click");

				callback(offset / totalOffset);
			});
			//move mouse to slide when the mouse is pressing
			var leftButtonPressing = false;
			this.on(duration, "mousedown", function(e){
				if(e.button === 0){//left button
					leftButtonPressing = true;
				}
				console.log("down");
			});
			this.on(duration, "mouseup", function(e){
				if(e.button === 0){//left button
					leftButtonPressing = false;
				}
				console.log("up");
			});
			this.on(duration, "mousemove", function(e){
				console.log("move");
				if(leftButtonPressing && e.button === 0){//left button is pressing
					var totalOffset = this.offsetWidth;
					var offset = e.offsetX;
					//update the progress
					current.style.width = (offset / totalOffset  * 100) + "%";
				}
			});

			return duration;
		},
		//DOM utility
		addClass: function(el, clazz){
			var reg = new RegExp("(\\s|^)" + clazz + "(\\s|$)");
			if(!el.className.match(reg)){// there isn't this class
				el.className += " " + clazz;
			}
		},
		removeClass: function(el, clazz){
			var reg = new RegExp("(\\s|^)" + clazz + "(\\s|$)", "g");
			el.className = el.className.replace(reg , ' ');
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
/*
	This is Dom element utilities (development).
	In production, the utils object will be contained by the OnlyHtml5Video Object.
*/
window.utils = function(){
	var utils = {
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
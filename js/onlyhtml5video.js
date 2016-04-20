window.onlyHtml5Video = function(){

	var _defaultOptions = {
		initControls: true
	}

	// the Object contains video and controls
	function VideoContainer(video, options){
		options = options || {};

		// fill options with the default value
		for(var key in _defaultOptions){
			if(!options.hasOwnProperty(key)){
				options[key] = _defaultOptions[key];
			}
		}

		this.video = video;
		video.className += " " + _modulePrefix + "-video";
		this.createContainer();
		var container = this.container;
		//warp video with container which may include the controls
		utils.warp(video, container);

		// determine to initialize the controls
		if(options.initControls === true){
			this.createControls(options.controls);
			
			var controls = this.controls;
			container.appendChild(controls);
		}
		
	}

	//constant [start]
	var _modulePrefix = "onlyhtml5video";
	var _containerClassName = _modulePrefix + "-container";
	var _controlsClassName = _modulePrefix + "-controls";
	var _playButtonClassName = _modulePrefix + "-play-button";
	var _progressBarClassName = _modulePrefix + "-progress-bar";
	var _muteButtonClassName = _modulePrefix + "-mute-button", _unmuteStatusClassName = _modulePrefix + "-unmute-status", _muteStatusClassName = _modulePrefix + "-mute-status";
	var _volumeBarClassName = _modulePrefix + "-volume-bar";
	var _fullscreenClassName = _modulePrefix + "-fullscreen-button";

	var fullscreenModeClazz = "fullscreen-mode";
	//constant [end]

	VideoContainer.prototype = {

		createContainer : function(){
			var container = document.createElement("DIV");
			container.className = _containerClassName;
			this.container = container;
			return container;
		},

		// Video controls [start]
		createControls : function(controlsOptions){
			controlsOptions = controlsOptions || {};
			var disableControls = [].concat(controlsOptions.disable);

			var controls = document.createElement("DIV");
			controls.className = _controlsClassName;
			this.controls  = controls;

			// configure the controls to hide
			if(controlsOptions.hidden === true){
				controls.style.visibility = "hidden";
			}

			this.initPlayButton();

			this.initProgressBar();

			if(disableControls.indexOf("mute") < 0) 
				this.initMuteButton();
			if(disableControls.indexOf("volume") < 0)
				this.initVolumeBar();
			if(disableControls.indexOf("fullscreen") < 0)
				this.initFullscreenButton();
			return controls;
		},

		/*
			Update play button according the video play status
			@param isButtonPlay: true means play button; false means pause button.
		*/
		changePlayButton : function(isButtonPlay){
			var playClass = "play", 
				pauseClass = "pause";
			if(isButtonPlay){
				utils.replaceClass(this.controls.playButton, pauseClass, playClass);
			}else{
				utils.replaceClass(this.controls.playButton, playClass, pauseClass);
			}
			
		},
		switchPlayButtonState : function(){
			var video = this.video;
			if (video.paused === true) {
				//Play video and update button to pause
				this.changePlayButton(false);
				video.play();
			}else{
				//Pause video and update button to play
				this.changePlayButton(true);
				video.pause();
			}
		},

		initPlayButton : function(){
			var that = this;
			var video = this.video;
			var playBt = document.createElement("DIV");
			playBt.className = _playButtonClassName;

			this.controls.playButton = playBt;
			this.changePlayButton(video.paused);

			utils.on(playBt, "click", function(){
				that.switchPlayButtonState();
			});

			// register the event that user clicks the video panel to play or pause the video
			utils.on(video, "click", function(){
				that.switchPlayButtonState();
			});

			//Update play button when the video ends
			utils.on(video, "ended" , function(){
				that.changePlayButton(true);
			})
			this.controls.appendChild(playBt);
		},
		initProgressBar : function() {
			var video = this.video;
			var progressBar = document.createElement("DIV");
			progressBar.className = _progressBarClassName;
			var progress = utils.createProgress(function(currentRadio){
				video.currentTime = video.duration * currentRadio;
			});
			progressBar.appendChild(progress);

			//Update the progress when the video is playing
			utils.on(video, "timeupdate", function() {
				var val = video.currentTime / video.duration * 100;
				progress.current.style.width = val + "%";
			})

			this.controls.appendChild(progressBar);
		},

		//@param isButtonVolum: true means unmute button; false means mute button
		changeMuteButton:function(isButtonVolume){
			var content = this.controls.muteButton.buttonContent;
			if(isButtonVolume) utils.replaceClass(content, _muteStatusClassName, _unmuteStatusClassName);
			else utils.replaceClass(content, _unmuteStatusClassName, _muteStatusClassName);
		},

		greyVolume : function(willApply){
			var volumeBar = this.controls.volumeBar;
			if(typeof volumeBar != "undefined")
				utils.toggleClass(volumeBar, "grey", "");

		},
		initMuteButton : function() {
			var that = this;
			var video  = this.video;
			var muteBt = document.createElement("DIV");
			muteBt.className = _muteButtonClassName;
			var buttonContent = document.createElement("DIV");
			muteBt.appendChild(buttonContent);
			this.controls.muteButton = muteBt;
			this.controls.muteButton.buttonContent = buttonContent; 
			//init mute button
			this.changeMuteButton(!video.muted);
			//click event
			utils.on(muteBt, "click", function(){
				if (video.muted === true) {
					//Unmute video and update button to mute
					that.changeMuteButton(true);
					// recover the volume bar color when the video is unmuted
					that.greyVolume(false);
					video.muted = false;				
				}else{
					//Mute video and update button to umute
					that.changeMuteButton(false);
					// change the volume bar color when the video is muted
					that.greyVolume(true);
					video.muted = true;
				}
			});
			this.controls.appendChild(muteBt);
		},

		initVolumeBar : function() {
			var video = this.video;
			var _volumeDefaultVal = video.volume;

			var volumeBar = document.createElement("DIV");
			volumeBar.className = _volumeBarClassName;

			var volume = utils.createProgress(function(currentRadio){
				video.volume = currentRadio;
			});
			this.controls.volumeBar = volumeBar;
			this.controls.volumeBar.volume = volume;
			//Init volume bar by the video initial volume
			volume.current.style.width = video.volume * 100 + "%"; // set width in percentage

			volumeBar.appendChild(volume);
			this.controls.appendChild(volumeBar);
		},

		initFullscreenButton : function(){
			var video  = this.video;
			var container = this.container;

			var _requestClazz = "full";
			var _exitClazz = "exit";

			var fsButton = document.createElement("DIV");
			fsButton.className = _fullscreenClassName + " " + _requestClazz;
			utils.on(fsButton, "click", function(){

				// change the container fullscreen mode(enter or exit)
				function toggleContainerFullscreen(){
					
					if(document.fullscreenElement ||    // alternative standard method
      					document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement /*utils.hasClass(container, fullscreenModeClazz)*/){
						// exit fullscreen
						if (document.exitFullscreen) {
							document.exitFullscreen();
						} else if (document.msExitFullscreen) {
							document.msExitFullscreen();
						} else if (document.mozCancelFullScreen) {
							document.mozCancelFullScreen();
						} else if (document.webkitExitFullscreen) {
							document.webkitExitFullscreen();
						} else {
							console.log("The bowser doesn't support fullscreen mode"); //// Don't support fullscreen
						}
					}else{
						// enter fullscreen
						if (document.documentElement.requestFullscreen) {
							container.requestFullscreen();
						} else if (document.documentElement.msRequestFullscreen) {
							container.msRequestFullscreen();
						} else if (document.documentElement.mozRequestFullScreen) {
							container.mozRequestFullScreen();
						} else if (document.documentElement.webkitRequestFullscreen) {
							container.webkitRequestFullscreen();
						} else {
							console.log("The bowser doesn't support fullscreen mode"); //// Don't support fullscreen
						}
					}
				}

				//The container element goes fullscreen, not video 
				toggleContainerFullscreen();
			}); // end click event listener
		
			// change the fullscreen button once fullscreen changed(listen to the event)
			utils.on(container, "webkitfullscreenchange mozfullscreenchange fullscreenchange", function(){
				
				fullscreenElement =document.fullscreenElement ||    // alternative standard method
      					document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement;

      			if(fullscreenElement !== undefined){
      				// fullscreen is on
      				utils.addClass(container, fullscreenModeClazz); //add fullscreen label class of container
      			}else{
      				// fullscreen is off
      				utils.removeClass(container, fullscreenModeClazz); //remove fullscreen label
      			}
      			utils.toggleClass(fsButton, _requestClazz, _exitClazz); //change fullscreen button style
			});


			this.controls.appendChild(fsButton);
		}
	}

	// DOM utility
	var utils = {
		/*
			@param callback: the callback function will be called when user clicks the progress bar.
				callback function take one parameter which is the ratio of progress(the click position / total bar length)
		
				----------  (10 dashes)
				  ^->0.3 ^->1.0
		*/
		createProgress: function(callback){
			var total = document.createElement("DIV");
			total.className = "total";
			var current = document.createElement("DIV");
			current.className = "current";
			total.appendChild(current);
			total.current = current;

			this.on(total, "click", function(e){
				var totalOffset = this.offsetWidth; // 'this' is 'total'
				var offset = e.offsetX === undefined ? e.layerX: e.offsetX; // support Firefox(layerX)
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
					var offset = e.offsetX === undefined ? e.layerX: e.offsetX; // support Firefox(layerX)
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
			var events = evt.split(" "); // multi events 
			for (var i = events.length - 1; i >= 0; i--) {
				el.addEventListener(events[i], fn, false);
			};
			
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

	var onlyHtml5Video = {
		create: function(videoTarget, options){
			var el;
			if (typeof videoTarget === "string") {
                el = document.querySelectorAll(videoTarget);
            }else {
            	// DOM element
            	el = videoTarget;
            }

            if(el.length){
            	
            	if(el.length === 1)
            		return new VideoContainer(el[0], options);
            	else
            		//el is a batch of elements
            		for (var i = el.length - 1; i >= 0; i--) {
            			var videoContainers = [];
            			videoContainers.push(new VideoContainer(el, options));
            			return videoContainers;
            		};
            }else{
            	//el is one element
            	return new VideoContainer(el, options);	
            }
		}
	};

	return onlyHtml5Video;
}();
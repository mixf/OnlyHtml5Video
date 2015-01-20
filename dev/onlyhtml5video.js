window.onlyHtml5Video = function(){
	// the Object contains video and controls
	function VideoContainer(video, options){
		options = options || {};

		this.video = video;
		video.className += " " + _modulePrefix + "-video";
		this.createContainer();
		this.createControls(options.controls);
		var container = this.container;
		var controls = this.controls;

		//warp video with container which includes the controls
		utils.warp(video, container);
		container.appendChild(controls);
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
	//constant [end]

	VideoContainer.prototype = {
		createContainer : function(){
			var container = document.createElement("DIV");
			container.className = _containerClassName;
			this.container = container;
			return container;
		},

		// Video controls [start]
		createControls : function(options){
			options = options || {};
			var hiddenControls = [].concat(options.hide);

			var controls = document.createElement("DIV");
			controls.className = _controlsClassName;
			this.controls  = controls;

			this.initPlayButton();
			this.initProgressBar();
			if(hiddenControls.indexOf("mute") < 0) 
				this.initMuteButton();
			if(hiddenControls.indexOf("volume") < 0)
				this.initVolumeBar();
			if(hiddenControls.indexOf("fullscreen") < 0)
				this.initFullscreenButton();
			return controls;
		},
		//Update play button according the video play status
		changePlayButton : function(isButtonPlay){
			var playClass = "play", 
				pauseClass = "pause";
			if(isButtonPlay){
				utils.replaceClass(this.controls.playButton, pauseClass, playClass);
			}else{
				utils.replaceClass(this.controls.playButton, playClass, pauseClass);
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
				if (video.paused === true) {
					//Play video and update button to pause
					that.changePlayButton(false);
					video.play();
				}else{
					//Pause video and update button to play
					that.changePlayButton(true);
					video.pause();
				}
			});

			//Update play button when the video finishes playing
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
			/*utils.setAttributes(progressBar, {
				type: "range",
				min: 0,
				max: 100,
				value: 0
			});*/

			// Update video time when user changes progress
			/*utils.on(progress, "change", function(){
				//Calulate the video time 
				var time = video.duration * (progressBar.value / 100);
				video.currentTime = time;
			});
			*/

			//Update the progress when the video is playing
			utils.on(video, "timeupdate", function() {
				var val = video.currentTime / video.duration * 100;
				progress.current.style.width = val + "%";
			})

			this.controls.appendChild(progressBar);
		},
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
					that.greyVolume(false);
					video.muted = false;				
				}else{
					//Mute video and update button to umute
					that.changeMuteButton(false);
					that.greyVolume(true);
					video.muted = true;
				}
			});
			/*var btText = video.muted === true? "Unmute": "Mute  ";
			muteBt.innerHTML = btText;

			utils.on(muteBt, "click", function(){
				if (video.muted === true) {
					//Unmute video and update button to mute
					muteBt.innerHTML = "Mute  ";
					video.muted = false;
				}else{
					//Mute video and update button to umute
					muteBt.innerHTML = "Unmute";
					video.muted = true;
				}
			});*/
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
			/*utils.setAttributes(volumnBar, {
				type: "range",
				min: 0,
				max: 1,
				step: 0.01,
				value: _volumeDefaultVal
			});
			utils.on(volumnBar, "change", function(){
				video.volume = volumnBar.value;
			})*/

			this.controls.appendChild(volumeBar);
		},

		initFullscreenButton : function(){
			var video  = this.video;
			var container = this.container;

			var fsButton = document.createElement("DIV");
			fsButton.className = _fullscreenClassName + " full";
			utils.on(fsButton, "click", function(){
				/*if (video.requestFullscreen) {
					video.requestFullscreen();
				} else if (video.mozRequestFullScreen) {
					video.mozRequestFullScreen(); // Firefox
				} else if (video.webkitRequestFullscreen) {
					video.webkitRequestFullscreen(); // Chrome and Safari
				}*/

				// change the container fullscreen mode
				function toggleContainerFullscreen(){
					var fullscreenModeClazz = "fullscreen-mode";
					
					if(utils.hasClass(container, fullscreenModeClazz)){
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
						
						utils.removeClass(container, fullscreenModeClazz ); //remove class
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
						}
						utils.addClass(container, fullscreenModeClazz); //add fullscreen label class
					}
				}

				//The container element goes fullscreen, not video 
				toggleContainerFullscreen();
			});

			this.controls.appendChild(fsButton);
		}
		// Video controls [start]
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
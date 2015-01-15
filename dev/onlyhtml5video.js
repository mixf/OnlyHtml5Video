window.onlyHtml5Video = function(){
	var _videoOptionKey = "video",
		_controlsOptionKey = "controls";

	// the Object contains video and controls
	function VideoContainer(video, options){
		
		this.video = video;
		video.className += " " + _modulePrefix + "-video";
		this.createContainer();
		this.createControls();
		var container = this.container;
		var controls = this.controls;

		//warp video with container which includes the controls
		utils.warp(video, container);
		container.appendChild(controls)

		//set OPTIONS in the video and controls
		//TODO
		if(typeof options !== "undefined"){
			var videoOptions = options[_videoOptionKey];
			var controlsOptions = options[_controlsOptionKey];			
		}
	}

	//constant [start]
	var _modulePrefix = "onlyhtml5video";
	var _containerClassName = _modulePrefix + "-container";
	var _controlsClassName = _modulePrefix + "-controls";
	var _playButtonClassName = _modulePrefix + "-play-button";
	var _progressBarClassName = _modulePrefix + "-progress-bar";
	var _muteButtonClassName = _modulePrefix + "-mute-button";
	var _volumnClassName = _modulePrefix + "-volumn";
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
		createControls : function(){
			var controls = document.createElement("DIV");
			controls.className = _controlsClassName;
			this.controls  = controls;

			this.initPlayButton();
			this.initProgressBar();
			this.initMuteButton();
			this.initVolumnBar();
			this.initFullscreenButton();
			return controls;
		},
		//Update play button according the video play status
		changePlayButton : function(showPlay){
			var playClass = "play", 
				pauseClass = "pause";
			if(showPlay){
				var oldDisplay = this.controls.playButton.style.display;
				this.controls.playButton.style.display = "none";
				utils.addClass(this.controls.playButton, playClass);
				
				utils.removeClass(this.controls.playButton, pauseClass);
				this.controls.playButton.style.display = oldDisplay;
			}else{
				var oldDisplay = this.controls.playButton.style.display;
				this.controls.playButton.style.display = "none";
				utils.addClass(this.controls.playButton, pauseClass);
				utils.removeClass(this.controls.playButton, playClass);
				this.controls.playButton.style.display = oldDisplay;
			}
			
		},
		updatePlayButton : function(showPlay){
			if(typeof showPlay !== "undefined"){
				this.changePlayButton(showPlay);
			}else{
				this.changePlayButton(this.video.paused)
			}
		},
		initPlayButton : function(){
			var that = this;
			var video = this.video;
			var playBt = document.createElement("DIV");
			playBt.className = _playButtonClassName;

			this.controls.playButton = playBt;
			this.updatePlayButton();

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
				that.updatePlayButton()
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
			console.log(progress.childNodes);
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
		initMuteButton : function() {
			var video  = this.video;
			var muteBt = document.createElement("span");
			muteBt.className = _muteButtonClassName;

			var btText = video.muted === true? "Unmute": "Mute  ";
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
			});
			this.controls.appendChild(muteBt);
		},

		initVolumnBar : function() {
			var video = this.video;
			var _volumeDefaultVal = video.volume;

			var volumnBar = document.createElement("input");
			volumnBar.className = _volumnClassName;
			utils.setAttributes(volumnBar, {
				type: "range",
				min: 0,
				max: 1,
				step: 0.01,
				value: _volumeDefaultVal
			});
			utils.on(volumnBar, "change", function(){
				video.volume = volumnBar.value;
			})
			this.controls.appendChild(volumnBar);
		},

		initFullscreenButton : function(){
			var video  = this.video;

			var fsButton = document.createElement("DIV");
			fsButton.innerHTML = "Full";
			fsButton.className = _fullscreenClassName + " full";
			utils.on(fsButton, "click", function(){
				if (video.requestFullscreen) {
					video.requestFullscreen();
				} else if (video.mozRequestFullScreen) {
					video.mozRequestFullScreen(); // Firefox
				} else if (video.webkitRequestFullscreen) {
					video.webkitRequestFullscreen(); // Chrome and Safari
				}
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
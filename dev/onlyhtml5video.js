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

		console.log(video.requestFullscreen);
		console.log(video.mozRequestFullScreen);
		console.log(video.webkitRequestFullscreen);

	}

	//constant [start]
	var _modulePrefix = "onlyhtml5video";
	var _containerClassName = _modulePrefix + "-container";
	var _controlsClassName = _modulePrefix + "-controls";
	var _playButtonClassName = _modulePrefix + "-playbutton";
	var _progressBarClassName = _modulePrefix + "-progressbar";
	var _muteButtonClassName = _modulePrefix + "-mutebutton";
	var _volumnClassName = _modulePrefix + "-volumn";
	var _fullscreenClassName = _modulePrefix + "-fullscreenbutton";
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
		updatePlayButton : function(){
			var btText = this.video.paused === true? "Play ": "Pause";
			this.controls.playButton.innerHTML = btText;
		},
		initPlayButton : function(){
			var videoContainerObj = this;
			var video = this.video;
			var playBt = document.createElement("span");
			playBt.className = _playButtonClassName;

			this.controls.playButton = playBt;

			this.updatePlayButton();

			utils.on(playBt, "click", function(){
				if (video.paused === true) {
					//Play video and update button to pause
					playBt.innerHTML = "Pause";
					video.play();
				}else{
					//Pause video and update button to play
					playBt.innerHTML = "Play ";
					video.pause();
				}
			});

			//Update play button when the video finishes playing
			utils.on(video, "ended" , function(){
				videoContainerObj.updatePlayButton()
			})
			this.controls.appendChild(playBt);
		},
		initProgressBar : function() {
			var video = this.video;
			var progressBar = document.createElement("input");
			progressBar.className = _progressBarClassName;
			utils.setAttributes(progressBar, {
				type: "range",
				min: 0,
				max: 100,
				value: 0
			});

			// Update video time when user changes progress
			utils.on(progressBar, "change", function(){
				//Calulate the video time 
				var time = video.duration * (progressBar.value / 100);
				video.currentTime = time;
			});

			//Update the progress when the video is playing
			utils.on(video, "timeupdate", function() {
				var val = video.currentTime / video.duration * 100;
				progressBar.value = val;
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

			var fsButton = document.createElement("span");
			fsButton.innerHTML = "Full";
			fsButton.className = _fullscreenClassName;
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
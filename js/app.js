"use strict";

/************************************************/
/* Caption Data Global                			*/
/************************************************/
var captionData = [
	{
		start: 0.240,
		stop: 4.130
	},
	{
		start: 4.130,
		stop: 7.535
	},
	{
		start: 7.535,
		stop: 11.270
	},
	{
		start: 11.270,
		stop: 13.960
	},
	{
		start: 13.960,
		stop: 17.940
	},
	{
		start: 17.940,
		stop: 22.370
	},
	{
		start: 22.370,
		stop: 26.880
	},
	{
		start: 26.880,
		stop: 30.920
	},
	{
		start: 32.100,
		stop: 34.730
	},
	{
		start: 34.730,
		stop: 39.430
	},
	{
		start: 39.430,
		stop: 41.190
	},
	{
		start: 42.350,
		stop: 46.300
	},
	{
		start: 46.300,
		stop: 49.270,
	},
	{
		start: 49.270,
		stop: 53.760
	},
	{
		start: 53.760,
		stop: 57.780
	},
	{
		start: 57.780,
		stop: 100.150
	}
];



/************************************************/
/* Other Globals                     			*/
/************************************************/
// Video
var video = document.getElementById("video");

// Buttons
var $slowButton = $("#play-slower");
var $playButton = $("#play-pause");
var $fastButton = $("#play-faster");
var $muteButton = $("#mute");
var $fullScreenButton = $("#full-screen");

// Sliders
var $seekBar = $("#seek-bar");
var $volumeBar = $("#volume-bar");
var $bufferBar = $("#buffer-bar");

// Info
var $currentTime = $("#current-time");

// misc
var $captions = $(".transcript-wrapper span");
var playbackRate = 1.0;

/************************************************/
/* Video controls                      			*/
/************************************************/
// Event listener for the play/pause button
$slowButton.click( function () {
	playbackRate -= 0.25;
	
	// limit speed to 0.25
	if (playbackRate < 0.25) {
		playbackRate = 0.25;
	} 
	
	video.playbackRate = playbackRate;
});



// Event listener for the play/pause button
$playButton.click( function () {
	if (video.paused === true) {
		
		// Play the video
		video.play();
		
		// Update the button text to 'Pause'
		$playButton.html('<img src="icons/pause-icon.png" alt="Pause" />');
	} else {
		
		// Pause the video
		video.pause();
		
		// Update the button text to 'Play'
		$playButton.html('<img src="icons/play-icon.png" alt="Play" />');
	}
});



// Event listener for the play/pause button
$fastButton.click( function () {
	playbackRate += 0.25;
	
	// limit speed to x2
	if (playbackRate > 2) {
		playbackRate = 2;
	} 
	
	video.playbackRate = playbackRate;
});



// Event listener for the mute button
$muteButton.click( function () {
	if (video.muted === true) {
		
		// Unmute the video
		video.muted = false;
		
		// Update the button text to 'Pause'
		$muteButton.html('<img src="icons/volume-on-icon.png" alt="Mute" />');
	} else {
		
		// Mute the video
		video.muted = true;
		
		// Update the button text to 'Play'
		$muteButton.html('<img src="icons/volume-off-icon.png" alt="UnMute" />');
	}
});



// Event listener for volume bar
$volumeBar.on('input', function() {
	
	// update the video volume
	video.volume = $volumeBar.val();
});



// Event listener for the full-screen button
$fullScreenButton.click( function() {
	
	if (video.requestFullscreen) {
		video.requestFullscreen();
		
	// Firefox
	} else if (video.mozRequestFullScreen) {
		video.mozRequestFullScreen(); 
	
	// Chrome and Safari
	} else if (video.webkitRequestFullscreen) {
		video.webkitRequestFullscreen(); 
	}
});



// Formats a time to MM:SS
function formatTime(time) {
	
	// pad time with 0's and convert it to a string
	var paddedTime = '00' + time + '00';
	
	// determine the location of the decimal point
	var decimalLocation = paddedTime.indexOf('.');
	
	// strip out the desired format
	return paddedTime.substr(decimalLocation - 2, 5);
	
}

// Event listener for the seek bar, updates video time
$seekBar.on("input", function() {

	// Calculate the new time
	var time = video.duration * ($seekBar.val() / 100);

	// Update the video time
	video.currentTime = time;
	
	// Update the current time display
	$currentTime.html(formatTime(time) + "/" + formatTime(video.duration));
});

// Update the seek bar and current time as the video plays
video.addEventListener("timeupdate", function() {
	
	// Calculate the slider value
	var value = (100 / video.duration) * video.currentTime;

	// Update the slider value
	$seekBar.val(value);
	
	// Update the current time
	$currentTime.html(formatTime(video.currentTime) + "/" + formatTime(video.duration));
});

// Pause the video when the slider handle is being dragged
$seekBar.mousedown( function() {
	video.pause();
});

// Play the video when the slider handle is dropped
$seekBar.mouseup( function() {
	video.play();
});
    

  
/************************************************/
/* Transcript Control                     		*/
/************************************************/

// highlight span if it matches the index.
function highlight ($span, i) {
	
	// if the index matches the caption value highlight it
	if ($span.attr('title') == i) {
		$span.addClass('highlight');
		
	// remove any existing highlights
	} else {
		$span.removeClass('highlight');
	}
}

// update highlight
video.addEventListener("timeupdate", function() {
	
	// cycle through all caption data
	for (var i = 0; i < captionData.length; i++) {
		
		// if currentTime within caption data check captions
		if (video.currentTime >= captionData[i].start && video.currentTime < captionData[i].stop) {

			// cycle through each caption
			$captions.each( function() {
				highlight($(this), i);
				});
		}
	}
});

// find each caption <span></span>
$captions.each ( function () {
	
	// add an event listener to each span
	$(this).click( function() {
		
		var $currentCaption = $(this);
		var index = this.getAttribute('title');
		
		// cycle thtough each caption
		$captions.each( function () {
			
			// remove any existing highlights
			$(this).removeClass('highlight');
		});
		
		// highlight the current class
		$currentCaption.addClass('highlight');
		
		// Update the current video time
		video.currentTime = captionData[index].start;
	});
});


/************************************************/
/* On load			                     		*/
/************************************************/
video.preload = "auto";

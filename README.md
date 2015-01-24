# OnlyHtml5Video

Pure **javascript** and **css** library which provides **same** style custom controls to HTML5 video in modern bowsers (known suport bowsers: Chrome, Firefox, IE11).

###For user:
(see in *example.html*)
```html
<script type="text/javascript" src="./js/onlyhtml5video.all.min.js"></script>
<link rel="stylesheet" type="text/css" href="./style/style.all.min.css">

<video id="video1">
	<source src="./small.mp4" type="video/mp4" >
	<p>Your browser does not support the video tag.</p>
</video>

<script type="text/javascript">
	var videoContainer = onlyHtml5Video.create("#video1");
</script>
```

#Features:
* Self-supporting: It is a pure javascript library which can work well without any other library or project.
* Small: the minify javascript and css is less than 6kb each.



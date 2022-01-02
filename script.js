(function() {
	
  // get the canvas from html
	var canvas = document.querySelector('#paint');

  // get the context
	var ctx = canvas.getContext('2d');
	
	var sketch = document.querySelector('#sketch');
	var sketch_style = getComputedStyle(sketch);
	// canvas.width = parseInt(sketch_style.getPropertyValue('width'));
	// canvas.height = parseInt(sketch_style.getPropertyValue('height'));
		
	// Load image
	var img = new Image();
	img.src = "resources/skyline.jpg";
  img.onload = drawImageActualSize;

  function drawImageActualSize() {
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    setTimeout(addBackgroundImage, 300);
  }

  function addBackgroundImage() {
    var targetBody = document.getElementById("pageBody");
    targetBody.style.background = "url('resources/profile2021.png')";
  }
	
	// Determine Tool
	var tool = 'eraser';
	// document.querySelector('#pencil').onchange = function() {
	// 	if (this.checked)
	// 		tool = 'pencil';
		
	// 	// Show Tmp Canvas
	// 	tmp_canvas.style.display = 'block';
	// };
	document.querySelector('#eraser').onchange = function() {
		if (this.checked)
			tool = 'eraser';
		
		// Hide Tmp Canvas
		tmp_canvas.style.display = 'none';
	};
	
	
	// Creating a tmp canvas to erase on...
	var tmp_canvas = document.createElement('canvas');
	var tmp_ctx = tmp_canvas.getContext('2d');
	tmp_canvas.id = 'tmp_canvas';
	tmp_canvas.width = canvas.width;
	tmp_canvas.height = canvas.height;
	
	sketch.appendChild(tmp_canvas);

	var mouse = {x: 0, y: 0};
	var last_mouse = {x: 0, y: 0};
	
	// Pencil Points
	var ppts = [];
	
	/* Mouse Capturing Work */
	tmp_canvas.addEventListener('mousemove', function(e) {
		mouse.x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
		mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;
	}, false);
	
	canvas.addEventListener('mousemove', function(e) {
		mouse.x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
		mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;
	}, false);

	// When eraser tool is selected
	canvas.addEventListener('mousedown', function(e) {
		canvas.addEventListener('mousemove', onErase, false);
		
		mouse.x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
		mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;
		
		ppts.push({x: mouse.x, y: mouse.y});
		
		onErase();
	}, false);
	
	canvas.addEventListener('mouseup', function() {
		canvas.removeEventListener('mousemove', onErase, false);
		
		// Emptying up Pencil Points
		ppts = [];
	}, false);
	
	var onErase = function() {
		
		// Saving all the points in an array
		ppts.push({x: mouse.x, y: mouse.y});
		
		ctx.globalCompositeOperation = 'destination-out';
		ctx.fillStyle = 'rgba(0,0,0,1)';
		ctx.strokeStyle = 'rgba(0,0,0,1)';
		ctx.lineWidth = 90;
		
		if (ppts.length < 3) {
			var b = ppts[0];
			ctx.beginPath();
			//ctx.moveTo(b.x, b.y);
			//ctx.lineTo(b.x+50, b.y+50);
			ctx.arc(b.x, b.y, ctx.lineWidth / 2, 0, Math.PI * 2, !0);
			ctx.fill();
			ctx.closePath();
			
			return;
		}
		
		// Tmp canvas is always cleared up before drawing.
		// ctx.clearRect(0, 0, canvas.width, canvas.height);
		
		ctx.beginPath();
		ctx.moveTo(ppts[0].x, ppts[0].y);
		
		for (var i = 1; i < ppts.length - 2; i++) {
			var c = (ppts[i].x + ppts[i + 1].x) / 2;
			var d = (ppts[i].y + ppts[i + 1].y) / 2;
			
			ctx.quadraticCurveTo(ppts[i].x, ppts[i].y, c, d);
		}
		
		// For the last 2 points
		ctx.quadraticCurveTo(
			ppts[i].x,
			ppts[i].y,
			ppts[i + 1].x,
			ppts[i + 1].y
		);
		ctx.stroke();
		
	};
	
}());

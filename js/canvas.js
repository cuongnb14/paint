var preX;
var preY;
var paint;
var canvas;
var context;
var backup = new Array();
var now = 0;

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }

$(document).ready(function() {

	//Colorpicker init
	$('#colorSelector').ColorPicker({
		color: '#000000',
		onShow: function (colpkr) {
			$(colpkr).fadeIn(500);
			return false;
		},
		onHide: function (colpkr) {
			$(colpkr).fadeOut(500);
			return false;
		},
		onChange: function (hsb, hex, rgb) {
			$('#colorSelector div').css('backgroundColor', '#' + hex);
			context.strokeStyle = '#'+hex;
		}
	});

	//powerange init
	var range = document.querySelector('.js-range');
	var init = new Powerange(range,{ callback: setRange, min: 1, max: 100, start: 1 });
	function setRange() {
		document.querySelector('#js-display-callback').innerHTML = range.value;
		if(context != null)
		context.lineWidth = range.value;
	}


	//Painting
	canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
    context.lineWidth = 1;
    context.lineCap = 'round';

    canvas.clear = function(){
		context.clearRect(0, 0, this.width, this.height);
	};
	canvas.undo = function(){
		canvas.clear();
		now--;
		if(now >=0 ) {
			context.putImageData(backup[now],0,0);
		} else {
			now++;
		}
	};

 	var rect = canvas.getBoundingClientRect();

    $('#canvas').mousedown(function(e){
    	backup[now] = context.getImageData(0, 0, this.width, this.height);
    	now++;
    	context.beginPath();// Tạo 1 đường mới
    	var pos = getMousePos(canvas,e);
        preX = pos.x;
        preY = pos.y;
        paint = true;
    });
    $('#canvas').mousemove(function(e){
      if(paint){
      	var pos = getMousePos(canvas,e);
        context.moveTo(preX,preY);
        context.lineTo(pos.x,pos.y);
        context.stroke();
        preX = pos.x;
        preY = pos.y;
      }
    });
    $('#canvas').mouseenter(function(e){
    	var pos = getMousePos(canvas,e);
        if(paint){
	        preX = pos.x;
	        preY = pos.y;
        }
    });
    $("#canvas").mouseup(function(){
        paint = false;
    });
    $('#canvas').mouseleave(function(e){
        //paint = false;
    });


    // Function top-bar
	$('#clear').click(function(event) {
		canvas.clear(); 
	});

	$('#undo').click(function(event) {
		canvas.undo(); 
	});

});
function reaction (intent,confidence,sentiment,comparative,body) {
	console.log(intent, confidence, sentiment);
	if (sentiment >= 0){
		if (confidence > 0.5) {
			switch (intent)
			{	

				//---------------------------------------------------------------------------------------
				//	hello!
				//---------------------------------------------------------------------------------------

				case "Hey_there":
					
					var random = Math.floor(Math.random() * (3 - 1 + 1)) + 1; // Math.floor(Math.random() * (max - min + 1)) + min;
					happy( random );
					
					break;

				//---------------------------------------------------------------------------------------
				//	Go to display
				//---------------------------------------------------------------------------------------


				case "ok":
					if (  $('.content').hasClass('hidden') == false ) { // check if it currently displaying something
						returnToOrigin();
						happy(1);
					} else {
						//$( ".two" ).trigger( "click" );
					}
					break;


				//---------------------------------------------------------------------------------------
				//	Do you like? 
				//---------------------------------------------------------------------------------------


				case "do_you_like":

					function checkColors(item) {
						var image = item;
						var colors = RGBaster.colors(image, function(payload){
						  console.log(payload.dominant);
						});
					}

					$('.content-body').html('');

					socket.get("/display/bing?sentence="+body.message_body.body, function (response) {
						for (var i = response.length - 1; i >= 0; i--) {
							console.log(response[i]);
						};

						$('.content-body').html("<div class='big'><ul class='imageList'></ul></div>");
						$('.content').removeClass('hidden');

						var cList = $('ul.imageList')
						d = new Date();
						$.each(response, function(i)
						{
						    var li = $('<li/>')
						        .addClass('ui-menu-item')
						        .appendTo(cList);
						    var aaa = $('<img/>')
						        .addClass('ui-all')
						        .attr('id','image-'+i)
						        .attr("src",response[i]+"?"+d.getTime())
						        .appendTo(li);

						        checkColors(response[i]);
						});

					// 	function checkColors(item) {
					// 		var image = item;//$('#image-'+item);

					// 		var colors = RGBaster.colors(image, function(payload){
					// 		  // console.log(payload.dominant);
					// 		  // console.log(payload.palette);
					// 		  console.log("------------------------------------------------");
					// 		});
					// 	}

					 });

					break;

				//---------------------------------------------------------------------------------------
				//	Go back to start position / abort
				//---------------------------------------------------------------------------------------


				case "close":
					returnToOrigin();
					break;

				//---------------------------------------------------------------------------------------
				//	Wolfram alpha search
				//---------------------------------------------------------------------------------------


				case "wolfram":

					var sentiment_minimum = -10;
					console.log(sentiment, body.wolfram_search_query.value);
					if (sentiment >= sentiment_minimum && confidence > 0.7) {
						$( ".two" ).trigger( "click" );
						$('.content').removeClass('hidden');

						socket.get("/display/wolfram?sentence="+body.wolfram_search_query.value, function (response) {
							//console.log(response);
							$('.content-body').html("<div class='big'>"+response.output+"</div>");
						});
					} else {
						nope(sentiment);
						console.log('minimum sentiment required');
					}
					break;

				//---------------------------------------------------------------------------------------
				//	...
				//---------------------------------------------------------------------------------------


				case "time":
					console.log(sentiment);
					if (sentiment >= 5) {
						var time = new Date();
						$( ".two" ).trigger( "click" );
						$('.content').removeClass('hidden');
						$('.content-body').text(time);
						    var today=new Date();
						    var h=today.getHours();
						    var m=today.getMinutes();
						    var s=today.getSeconds();
						    var n = today.toLocaleDateString();
						    //document.getElementById('txt').innerHTML = h+":"+m+":"+s;
						    $('.content-body').html("<div class='big'>"+h+":"+m+":"+s+"<div><br>"+n);
					} else {
						nope(sentiment);
					}

					break;

				default: 
					console.log('Default case');
					break;
				}
		} else {
			// wat ?
			console.log(' ¯\\_(ツ)_/¯');
		}

	} else {
		console.log('Watch your language, son!');
		returnToOrigin();
		nope(sentiment);
	}


}

//---------------------------------------------------------------------------------------
//	animation stuff
//---------------------------------------------------------------------------------------


function nope(sentiment) {

	sentiment = Math.abs(sentiment) * 10;
	var duration = sentiment * 20;
	sizeTemp(150, duration * 10, 0);

	var tween = new TWEEN.Tween( { x: 0, y:1 } )
	            .to( { x: sentiment, y:0.5 }, duration )
	        	.repeat(1)
	        	.yoyo(true)
	            .easing( TWEEN.Easing.Quadratic.InOut )
	            .onUpdate( function () {
	                $('.mood').css({
	                	'box-shadow': 
	                	'inset 0 0 0' + this.x + 'px tomato, inset 0 0 0' + this.x*.5 + 'px red, 0 0 0' + this.x*.8 + 'px tomato, 0 0 0' + this.x*2 + 'px red'}
	                	);
	                //$('.halo').css({'-webkit-transform':'scale('+this.y+')'});

	            } )
	            .start();
	            console.log(sentiment);
}

function wat2(sentiment) {
	//$('.halo').toggleClass('stop');
	$('.halo').velocity({ left: '100', scale: 2 }, { begin: function(elements) { $('.halo').css({ '-webkit-transform':'scale(1)','-webkit-animation-play-state': 'paused' })}, complete: function(elements) { $('.halo').css({ '-webkit-animation-play-state':'running' })}, loop: 1, duration: 500});
	//$("div").velocity({ height: "10em" }, { loop: 2 });

}

function happy( mode ) {

	console.log( mode );

	if (mode == 1 || mode == 2) {
		$(".halo").velocity({ marginTop: -200, width: '+=25', height: '+=25'}, { duration: 700, loop:1, easing: "easeInOutBack"});

	} else if (mode == 3) {
		$(".halo")
		.velocity({ width: '+=100', height: '+=100'}, { duration: 2000, easing: "easeOutElastic"})
		.velocity({ marginLeft: '-=200'}, { duration: 600, easing: "easeOutCirc"})
		.velocity({ marginLeft: '+=400'}, { duration: 800, easing: "easeOutCirc"})
		.velocity({ marginLeft: 0, width: '-=100', height: '-=100'}, { duration: 2000, easing: "easeOutElastic", delay: 500});
	} else {
		// 
	}

}


function size(size, duration, delay) {
	$(".halo").velocity(
		{ width: size, height: size }, { 
			begin: function(elements) { 
				//$('.halo').css({'-webkit-animation-play-state': 'paused'})
			} ,
			complete: function(elements) { 
				//$('.halo').css({'-webkit-animation-play-state': 'running'})
			}, duration: duration, easing: "easeOutElastic", delay: delay});
}

function sizeTemp (size, duration, delay) {
	$(".halo").velocity(
		{ width: size, height: size }, { 
			begin: function(elements) { 
				//$('.halo').css({'-webkit-animation-play-state': 'paused'})
			} ,
			complete: function(elements) { 
				//$('.halo').css({'-webkit-animation-play-state': 'running'})
			}, duration: duration,  easing: "easeOutElastic", delay: delay});
	$(".halo").velocity("reverse", { duration: duration, delay: delay });
}



// function show_time (argument) {
// 	// body...
// }
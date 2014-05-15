function reaction (intent,confidence,sentiment) {
	if (confidence > 0.5) {
		switch (intent)
		{	
			//---------------------------------------------------------------------------------------
			//	Go to display
			//---------------------------------------------------------------------------------------


			case "ok":
				if (  $('.content').hasClass('hidden') == false ) { // check if it currently displaying something
					returnToOrigin();  
				} else {
					$( ".two" ).trigger( "click" );
				}
				break;


			//---------------------------------------------------------------------------------------
			//	Go back to start position / abort
			//---------------------------------------------------------------------------------------


			case "close":
				returnToOrigin();
				break;

			//---------------------------------------------------------------------------------------
			//	...
			//---------------------------------------------------------------------------------------


			case "time":

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
		console.log(' ¯\\_(ツ)_/¯');
	}


}


function nope(sentiment) {
	var tween = new TWEEN.Tween( { x: 0, y:1 } )
	            .to( { x: 100, y:0.5 }, 400 )
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


// function show_time (argument) {
// 	// body...
// }
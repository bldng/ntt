// $(window).bind('storage', function (e) {
//      //console.log(e.originalEvent.key, e.originalEvent.newValue);
//      var positions = JSON.parse( localStorage.getItem('positions') );
//      //console.log( positions.translateX);
//      document.getElementById('movement-temp').style.top= 250 + positions.translateY + 'px';
//      document.getElementById('movement-temp').style.left= 500 + (positions.translateX*-1) + 'px';
//      document.getElementById('movement-temp').style.webkitTransform = "scale("+positions.scale*2+")";
//  });

// Animate.
function animate(highResTimestamp) {
  requestAnimationFrame(animate);
  var positions = JSON.parse( localStorage.getItem('positions') );
       document.getElementById('movement-temp').style.top= 250 + positions.translateY + 'px';
       document.getElementById('movement-temp').style.left=250 + (positions.translateX*-1) + 'px';
       document.getElementById('movement-temp').style.webkitTransform = "scale("+positions.scale*2+")";
       //$("#movement-temp").velocity({ top: 250 + positions.translateY, left:250 +(positions.translateX*-1), scale: positions.scale*2 }, 10, "linear");
}

// Start the animation.


$(document).ready(function(){

	//requestAnimationFrame(animate);

	$('.button').on('click', function(event) {
		event.preventDefault();
		socket.get("/display/ask?sentence="+$('.text').val(), function (response) { 
			console.log(response);
		});
	});

	$(window).bind('storage', function (e) {
		var oldValue = JSON.parse(e.originalEvent.oldValue);
		var newValue = JSON.parse(e.originalEvent.newValue);
		//var translateY = Math.abs(oldValue.translateY - newValue.translateY);
		var translateX = Math.abs(oldValue.translateX - newValue.translateX);
		// var scale = Math.abs(oldValue.scale - newValue.scale);
		var test = JSON.parse(localStorage.getItem('tracker'));
	    if (JSON.parse(localStorage.getItem('tracker')) == true) {
	    	$("#movement-temp").velocity({ top: 250 + newValue.translateY, left:250 +(newValue.translateX*-1), scale: newValue.scale*2 }, 10, "linear");
	    } else {
	    	console.log('tracker lost');
	    }
	    //$("#movement-temp").velocity({ top: 250 + positions.translateY, left:250 +(positions.translateX*-1), scale: positions.scale*2 }, 10, "linear");
	});

	// $("#movement-temp").velocity({ top: 0, left:0 }, 0, "swing");
	// $("#movement-temp").velocity({ top: 500 }, 1000, "swing");
	// $("#movement-temp").velocity({ left: 500 }, 1000, "swing");
	// $("#movement-temp").velocity({ top: 0 }, 1000, "swing");
	// $("#movement-temp").velocity({ left: 0 }, 1000, "swing");

	function sentimentCheck() {
		socket.get("/display/wit?sentence="+$('.text').val(), function (response) {
			console.log(	response.msg_body, response.outcome	);
		});
		socket.get("/display/ask?sentence="+$('.text').val(), function (response) { 
			console.log(	response['sentiment']	);
			if (response['sentiment'] >= 1 ) {
				$("#movement-temp").velocity({ borderColorRed: '0', borderColorGreen: '128', borderColorBlue: '255' },  200, "swing");
				$("#movement-temp").velocity({ borderColorRed: '0', borderColorGreen: '0', borderColorBlue: '0' }, { delay: 200 }, 1000, "swing");
			} else if (response['sentiment'] <= -1 ) {
				$("#movement-temp").velocity({ borderColorRed: '255', borderColorGreen: '0', borderColorBlue: '0' },  200, "swing");
				$("#movement-temp").velocity({ borderColorRed: '0', borderColorGreen: '0', borderColorBlue: '0' }, { delay: 200 }, 1000, "swing");
			}
		});
	}

	var recognition = new webkitSpeechRecognition();
	recognition.continuous = true;
	recognition.interimResults = true;
	recognition.lang = "en_US";
	//serviceURI = "https://www.google.com/speech-api/v1/recognize?xjerr=1&pfilter=0&client=chromium&lang=en-US",
	recognition.start();

	recognition.onresult = function (event) {
	    for (var i = event.resultIndex; i < event.results.length; ++i) {
	        if (event.results[i].isFinal) {
	            //insertAtCaret(textAreaID, event.results[i][0].transcript);
	            $('.text').val(event.results[i][0].transcript);
	            sentimentCheck();
	        } else {
	            // Outputting the interim result to the text field and adding
	            // an interim result marker - 0-length space
	            $('#speech-page-content').val(event.results[i][0].transcript + '\u200B');
	            // insertAtCaret(textAreaID, event.results[i][0].transcript + '\u200B');
	            // interimResult += event.results[i][0].transcript + '\u200B';
	        }
	    }
	};
	recognition.onend = function() { recognition.start(); console.log('restarted voice recognition...'); };


});
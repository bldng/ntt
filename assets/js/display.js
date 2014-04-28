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
       document.getElementById('movement-temp').style.left= 500 + (positions.translateX*-1) + 'px';
       document.getElementById('movement-temp').style.webkitTransform = "scale("+positions.scale*2+")";
}

// Start the animation.
requestAnimationFrame(animate);
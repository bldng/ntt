/**
 * DisplayController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

var sentiment = require('sentiment');

var Speakable = require('speakable');

module.exports = {
	
	index: function(req, res) {
		var sentence = sentiment(req.query.sentence);
       	return res.view({
            layout: "display/layout",
            sentiment: sentence.score
        })
	},
	ask: function(req, res) {
		var sentence = sentiment(req.query.sentence);
		console.log('\npositive tokens: '.green+ sentence.positive,'\nnegative tokens: '.red+sentence.negative);
       	return res.send({
            sentiment: sentence.score
        })
	},
	speak: function(req, res) {
		// var speakable = new Speakable();
		// speakable.on('speechStart', function() {
		//   console.log('onSpeechStart');
		// });
		// res.send('test');
		return res.send({
		     sentiment: "sentence.score"
		 })
		//console.log(sails);
	},
	// ask: function(req, res) {
	// 	//test = res.send(r1);
	// 	var r2 = sentiment('Dogs are fucking stupid.');
	// 	var sentence = sentiment(req.query.sentence);
	// 	console.log(sentence.score);
	// 	res.send(sentence.score);
	// 		return res.view({
	// 	     layout: "display/layout",
	// 	     test: r1.score
	// 	 })
	// },

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to DisplayController)
   */
  _config: {}

  
};

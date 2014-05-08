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
var https = require('https');
var http = require('http');
var Future = require('futures').future;

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
	wit: function(req, res) {
		var user_text = req.query.sentence;
		var future = Future.create();
	    var options = {
	        host: 'api.wit.ai',
	        path: '/message?q=' + encodeURIComponent(user_text),
	        // the Authorization header allows you to access your Wit.AI account
	        // make sure to replace it with your own
	        headers: {'Authorization': 'Bearer XUTTJGYPZD2W2HICRIJBRLUQKTKPNA4W'}
	    };

	    https.request(options, function(response_server) {
	        var response = '';

	        response_server.on('data', function (chunk) {
	            response += chunk;
	        });

	        response_server.on('end', function () {
	            future.fulfill(undefined, JSON.parse(response));
	            console.log(response);
	            return res.send(JSON.parse(response));
	        });
	    }).on('error', function(e) {
	        future.fulfill(e, undefined);
	    }).end();

	    return future
	},

	news: function(req,res) {

		var url = "http://content.guardianapis.com/search?section=world&page-size=50&order-by=relevance&show-fields=body&date-id=date%2Fyesterday&show-redistributable-only=body&api-key=mhe363khxt4dbm85vpewe2ev"
		http.get(url, function(response) {
		    var body = '';
		    var articles;

		    response.on('data', function(chunk) {
		        body += chunk;
		    });

		    response.on('end', function() {

		    	var allArticles = '';

		        var responseFull = JSON.parse(body);
		        var articles = responseFull.response.results.length;

		        for (var i = articles - 1; i >= 0; i--) {

		        	var sentence = responseFull.response.results[i].fields.body; // get text
		        	var stripped = sentence.replace(/(<([^>]+)>)/g,""); // strip html

		        	allArticles += stripped;
		        };

		        var analysed = sentiment(allArticles);

		        return res.send({
		             numberwang: analysed.score,
		             'analysed articles': articles,
		             'positive words total': analysed.positive.length,
		             'negative words total': analysed.negative.length,
		             positive: analysed.positive,
		             negative: analysed.negative

		         })
		    });
		}).on('error', function(e) {
		      console.log("Got error: ", e);
		});
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

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
var https = require('https');
var http = require('http');
var Future = require('futures').future;
var fs = require('fs');

module.exports = {
	
	index: function(req, res) {
		var sentence = sentiment(req.query.sentence);
       	return res.view({
            layout: "display/layout",
            sentiment: sentence.score
        })
	},
	ask: function(req, res) {
		var sentence = sentiment(req.query.sentence, {	// analyse sentence
		    'you': 10,
		    'love': 10,
		    'how are you': 10,
		    'please': 10,
		    'thank you': 10,
		    'thanks': 10
		});
		console.log('\npositive tokens: '.green+ sentence.positive,'\nnegative tokens: '.red+sentence.negative);
       	return res.send({
            sentiment: sentence.score
        })
	},
	ask2: function(req, res) {
		var result = sentiment('Cats are totally amazing!', {
		    'cats': 5,
		    'amazing': 2  
		});
		console.dir(result);
		return res.send({
		     sentiment: result
		 })
	},
	wit: function(req, res) {
		var user_text = req.query.sentence;
		var sentence = sentiment(req.query.sentence, {	// analyse sentence
		    'you': 10,
		    'love': 10,
		    'how are you': 10,
		    'please': 10,
		    'thank you': 10,
		    'thanks': 10
		});
		var future = Future.create();
	    var options = {
	        host: 'api.wit.ai',
	        path: '/message?v=20140513&q=' + encodeURIComponent(user_text),
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
	        	var answer = JSON.stringify({ wit: JSON.parse(response), sentiment: sentence });
	        	var answerPrettify = JSON.parse(answer);
	            console.log(answerPrettify);
	            return res.send(answerPrettify);
	        });
	    }).on('error', function(e) {
	        future.fulfill(e, undefined);
	        console.log('wit trouble');
	    }).end();

	    return future
	},

	news: function(req,res) {

		var date = new Date();

		var today = "./logs/news/"+date.toISOString().replace(/\T.+/, '')+".json";

		fs.exists(today, function(exists) {
		    if (exists) {
		        console.log('file already exists');
		        return res.send('file exists, fuck off')
		    } else {
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

		    	        Mood.findOne(4).done(function(err, item) {
		    	          // Error handling
		    	          if (err) {
		    	            return console.log(err);

		    	          // The item was found successfully!
		    	          } else {
		    	            item.value = parseInt(item.value) + 1;
		    	              item.save(function (err) {
		    	                if (err) return res.send(err,500);
		    	                // Report back with the new state of the item
		    	                Mood.publishUpdate( 4, {
		    	                  value: parseInt(item.value)
		    	                });
		    	              });
		    	          }
		    	        });

		    	        // fs.writeFile(today, JSON.stringify({
		    	        // 	numberwang: analysed.score,
		    	        //     'analysed articles': articles,
		    	        //     date: date,
		    	        //     'positive words total': analysed.positive.length,
		    	        //     'negative words total': analysed.negative.length,
		    	        //     positive: analysed.positive,
		    	        //     negative: analysed.negative,
		    	        //     body: responseFull

		    	        // }), function(err) {
		    	        //     if(err) {
		    	        //         console.log(err);
		    	        //     } else {
		    	        //         console.log(today +" was saved.");
		    	        //     }
		    	        // });

		    	        return res.send({
		    	             numberwang: analysed.score,
		    	             'analysed articles': articles,
		    	             'positive words total': analysed.positive.length,
		    	             'negative words total': analysed.negative.length,
		    	             // positive: analysed.positive,
		    	             // negative: analysed.negative
		    	         })
		    	    });
		    	}).on('error', function(e) {
		    	      console.log("Got error: ", e);
		    	});
		    }
		});
		date = '';
	},

	newsRatio: function(req,res) {

		var dir = "./logs/news/";
		var data={};
		var myfiles = [];
		var foo = [];
		var temp;

		fs.readdir( dir , function (err, files) { if (err) throw err;
		  files.forEach( function (file) {
		  	if (file !== ".DS_Store") {
		  		fs.readFileSync("./logs/news/"+file, 'utf-8',  function(err,content){
					if (err) throw err;
					data[file]=JSON.parse(content);
					temp = JSON.parse(content);
					//foo.push( JSON.parse(content) ); //socket.emit('init', {data: data});
					foo.push(temp.numberwang, temp['analysed articles'] );
				});
				//myfiles.push(data);
				console.log(foo);
		  	}  
		  });
		  console.log(foo);
		});
		return res.send({
		     numberwang: 'wat',
		 })
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

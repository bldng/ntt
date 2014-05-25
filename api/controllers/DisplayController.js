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
			'how are you': 15,
			'please': 5,
			'thank you': 25,
			'entity': 5,
			'thanks': 25,
			'suck': -20,
			'f': -20,
			'stupid': -10,
			's': -10,
			'c': -20,
			'a': -15,
			'd': -15,
			'sorry': 25,
			'i like you': 25,
		});
		console.log('\npositive tokens: '.green+ sentence.positive,'\nnegative tokens: '.red+sentence.negative);
       	return res.send({
            sentiment: sentence.score,
            comparative: sentence.comparative
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

	//---------------------------------------------------------------------------------------
	//	search images, get dominant colors
	//---------------------------------------------------------------------------------------

	bing: function(req,res) {

		var https = require('https');
		var qs = require('querystring');
		var request = require('request');

		var s = req.query.sentence;

		var result = {success:false};
		//console.log("Bing Search for "+s);
		var options = {
			hostname:"api.datamarket.azure.com",
			path:"/Bing/Search/Image?ImageFilters=%27Size%3AMedium%27&Query=%27" + qs.escape(s) + "%27&Adult=%27strict%27&$top=5&$format=json",
			method:"GET",
			auth:":LajDpVk8HkYOqRSOzr/B1eVrHNEndCSZRAYBHpJbbI8",
			rejectUnauthorized:false
		}


		https.get(options, function(response) {
			console.log("Got response: " +response.statusCode.green);
			var body = "";

			response.on('data', function (chunk) {
				body += chunk;
			});

			response.on('end', function() {
				result.success = true;
				var data = JSON.parse(body);
				result.data = data.d.results;

				var imageURLs = [];

				for (var __metadata in result.data) {
				   imageURLs.push(result.data[__metadata].MediaUrl);
				}

				var EMBEDLY_KEY = '3d29e3a35cee465ebb9fb8f35771349f';

				var embedly = require('embedly'),
				    util = require('util');

				var colors = [];

				new embedly({key: EMBEDLY_KEY}, function(err, api) {
				  if (!!err) {
				    console.error('Error creating Embedly api');
				    console.error(err.stack, api);
				    return;
				  }

				  var opts = { urls: imageURLs,
				           };

					  api.extract(opts, function(err, objs) {
					      if (!!err) {
					        console.error('request failed');
					        console.error(err.stack, objs);
					        return;
					      }

					      for (var images in objs) {
					         //console.log(objs[images].images[0].colors[0].color);
					         colors.push(objs[images].images[0].colors[0].color);
					      }

					      return res.send(colors)
					      // console.log('-------------------------------------------------------');
					      // console.log(util.inspect(objs));
					  });
				  });
				});


				// var imageURLs = [];

				// for (var __metadata in result.data) {

				// 	request(result.data[__metadata].MediaUrl).pipe(fs.createWriteStream('assets/images/img-temp/doodle'+__metadata+'.jpg'))

				// 	//--------
				//    console.log(__metadata + ": " + result.data[__metadata].MediaUrl);
				//    //imageURLs.push(result.data[__metadata].MediaUrl);
				//    imageURLs.push('/images/img-temp/doodle'+__metadata+'.jpg');
				// }

				//return res.send(imageURLs)
			//});

		}).on('error', function(e) {
			console.log("Got error: " + e.message);
			//cb(result);
		});

		

	},
	wolfram: function(req, res) {

		var Client = require('node-wolfram');
		var Wolfram = new Client('246XH8-K98WKX6TWL');
		var searchFor = req.query.sentence;

		var input;
		var output;

		Wolfram.query( searchFor , function(err, result) {
		    if(err || result.queryresult.$.success == "false") {
		        console.log(err);
		        	return res.send({
		        			input: req.query.sentence,
		        			output: 'no results.'
		        	 })
		    }
		    else {

		    	input = result.queryresult.pod[0];
		    	output = result.queryresult.pod[1];

		    	return res.send({
		    			input: input.subpod[0].plaintext.toString(),
		    			output: output.subpod[0].plaintext.toString()
		    	 })
		    }
		});
	},
	wit: function(req, res) {
		var user_text = req.query.sentence;
		var sentence = sentiment(req.query.sentence, {	// analyse sentence
		    'you': 10,
		    'love': 10,
		    'how are you': 10,
		    'please': 5,
		    'thank you': 25,
		    'entity': 5,
		    'thanks': 25,
		    'suck': -20,
		    'f': -20,
		    'stupid': -10,
		    's': -10,
		    'c': -20,
		    'a': -15,
		    'd': -15,
		    'sorry': 25,
		    'i like you': 25,
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
		console.log(today);

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
		    	            item.value = parseInt(item.value) + 1; // add sentiment to news total
		    	              item.save(function (err) {
		    	                if (err) return res.send(err,500);
		    	                // Report back with the new state of the item
		    	                Mood.publishUpdate( 4, {
		    	                  value: parseInt(item.value)
		    	                });
		    	              });
		    	          }
		    	        });

		    	        fs.writeFile(today, JSON.stringify({
		    	        	numberwang: analysed.score,
		    	        	comparative: analysed.comparative,
		    	            'analysed articles': articles,
		    	            date: date,
		    	            'positive words total': analysed.positive.length,
		    	            'negative words total': analysed.negative.length
		    	            // ,
		    	            // positive: analysed.positive,
		    	            // negative: analysed.negative,
		    	            // body: responseFull

		    	        }), function(err) {
		    	            if(err) {
		    	                console.log(err);
		    	            } else {
		    	                console.log(today +" was saved.");
		    	            }
		    	        });

		    	        return res.send({
		    	             numberwang: analysed.score,
		    	             comparative: analysed.comparative,
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
		//date = '';
	},

	newsRatio: function(req,res) {

		var dir = "./logs/news/";

		fs.readdir( dir, function( err, files) {
		    if ( err ) {
		        console.log("Error reading files: ", err);
		    } else {
		        // keep track of how many we have to go.

		        files.splice(files.indexOf('.DS_Store'), 1); // .DS_Store go home, you're drunk

		        var remaining = files.length;
		        var totalBytes = 0;
		        var sentimentScore = 0;

		        if ( remaining == 0 ) {
		            console.log("Done reading files. totalBytes: " +
		                totalBytes);
		        }

		        // for each file,
		        for ( var i = 0; i < files.length; i++ ) {
		            // read its contents.
		            fs.readFile( dir+files[i], 'utf-8',  function( error, data ) {
		                if ( error ) {
		                    console.log("Error: ", error);
		                } else {
		                    totalBytes += data.length
		                    sentimentScore += JSON.parse(data).comparative;
		                    console.log(JSON.parse(data).comparative);
		                    console.log("Successfully read a file.");
		                }
		                remaining -= 1;
		                if ( remaining == 0 ) {
		                    console.log("Done reading files... totalBytes: " +
		                        totalBytes, sentimentScore ,sentimentScore / files.length);
		                }
		            });
		        }
		    }
		});
		

	},

	how: function(req, res) {

		var date = new Date();
		var today = "./logs/news/"+date.toISOString().replace(/\T.+/, '')+".json";

		fs.exists(today, function(exists) {
		    if (exists) {
		        console.log('value for today exists');

		        Mood.findOne(4).done(function(err, item) {
		    	          // Error handling
		    	          if (err) {
		    	            return console.log(err);

		    	          // The item was found successfully!
		    	          } else {
		    	          	return res.send({
		     					sentiment: item.value
		 					})

		    	          }
		    	        });
		    } else {
				console.log('triggering /news');
		    }
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

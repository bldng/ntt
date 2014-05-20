/**
 * MoodController
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

module.exports = {

	foo: function (req,res) {
		Mood.findOne(req.param('id')).done(function(err, item) {
		  // Error handling
		  if (err) {
		    return console.log(err);

		  // The item was found successfully!
		  } else {
		    item.value = parseInt(item.value) + 1;
		      item.save(function (err) {
		        if (err) return res.send(err,500);
		        // Report back with the new state of the item
		        res.json(item);
		      });
		  }
		});
	},

	sentimentCalc: function (req,res) {
		Mood.findOne(req.param('id')).done(function(err, item) {
		  if (err) {
		    return console.log(err);
		  } else {
		    item.value = parseInt(item.value) + 1;
		      item.save(function (err) {
		        if (err) return res.send(err,500);
		        res.json(item);
		      });
		  }
		});
	},

	ratio: function (req,res) {
		Mood.find().done(function(err, collection) {

			var angry = collection.filter(function (item) { return item.name == "Angry" });
			var smile = collection.filter(function (item) { return item.name == "Smile" });

			percentage = (parseInt(smile[0].value) / ( parseInt(angry[0].value) + parseInt(smile[0].value) )) * 100;

			res.json({
				angry: parseInt(angry[0].value), 
				smile: parseInt(smile[0].value),
				total: parseInt(angry[0].value) + parseInt(smile[0].value),
				diff: parseInt(smile[0].value) - parseInt(angry[0].value),
				percentage: percentage.toFixed(2)
				});
		});
	},
    
    // foo: function(req, res) {
    // 	//var message = 'Hallo Wurst' + req.toJSON();
    // 	var param = req.param('value');

	   //  // Send a JSON response
	   //  res.json({
	   //    	success: true,
	   //    	message: param
	   //  });
    // },
  


  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to MoodController)
   */
  _config: {}

  
};

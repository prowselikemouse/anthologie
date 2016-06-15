var app = {};
app.apiKey = `272855367.b6f7db4.27aee70b486a4fd7b1b5546c1da0453d`;

// get user's search information from input
$(document).ready(function(){
	$(`form`).on(`submit`, function(e) {
		e.preventDefault();
		if ($(`#insta-search`).val() !== `` ) {
			app.tag = $(`#insta-search`).val();	
			$(`#insta-search`).val(``); // clear input
		};
		app.startDate = new Date($(`#dateFrom`).val()).getTime();
		app.endDate = new Date($(`#dateTo`).val()).getTime();
		app.apiUrl = `https://api.instagram.com/v1/tags/${app.tag}/media/recent?access_token=${app.apiKey}`;
		app.photosInDate = [];
		makeCall();
	});
	// get information from Instagram API
	var makeCall = function(nextPage) {
		var data = {};
		if (nextPage) {
			data.min_tag_id = nextPage;
		}
		$.ajax({
			url: app.apiUrl,
			dataType: `jsonp`,
			method: `GET`,
			data: data
		}).then(function(res) {
			// create range variable set to true
			console.log(res);
			var inRange = true;
			// loop over results data
			var filteredPhotos = res.data.forEach(function(photo) {
			// convert created_time to timeStamp
		  	var timeStamp = moment.unix(photo.caption.created_time);
		  	// if image tag date is within range, keep it
		  	if (timeStamp >= app.startDate && timeStamp <= app.endDate) {
		  		app.photosInDate.push(photo);
			  	// else if image date is before range, set inRange to false
			  	} else {
			  		inRange = false;
			  	}
			  	// get image from results
			});
			console.log(app.photosInDate);
			if (app.photosInDate.length > 50) {
				displayImages(app.photosInDate);
			} else if (inRange) {
			// run it again!
			  	makeCall(res.pagination.next_min_id);
			  } else {
			  	// you are done, display them
				 displayImages(app.photosInDate);
			  }
			});
		};
	// append images to page
	var displayImages = function(results) {
		$('#image-box').empty()
	  	for (var i = 0; i < results.length; i++) {
			// var getImage = results[i].images;
			var image = results[i].images.low_resolution.url;
			var caption = results[i].caption.text;
			var user = results[i].user.full_name;
			var userPhoto = results[i].user.profile_picture;
			var photoLink = results[i].link;
			$('#image-box').append('<div class="oneImage"><div class="user-info"><img class="user-image" src="' + userPhoto + '"/><p class="user-name">' + user + '</p></div><a href="' + photoLink + '"><img src="'+ image +'" alt="something" /></a><p class="caption">' + caption + '</p></div>');
      	}  
	}

});

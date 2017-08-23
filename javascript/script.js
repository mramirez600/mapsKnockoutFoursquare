var map;
// Create a new blank array for all the listing markers.
var markers = [];

function initMap() {
	//styles for map from snazzymaps
	var styles = [{
			"featureType": "all",
			"stylers": [{
					"saturation": 0
				},
				{
					"hue": "#e7ecf0"
				}
			]
		},
		{
			"featureType": "road",
			"stylers": [{
				"saturation": -70
			}]
		},
		{
			"featureType": "transit",
			"stylers": [{
				"visibility": "off"
			}]
		},
		{
			"featureType": "poi",
			"stylers": [{
				"visibility": "off"
			}]
		},
		{
			"featureType": "water",
			"stylers": [{
					"visibility": "simplified"
				},
				{
					"saturation": -60
				}
			]
		}
	];
	// Constructor creates a new map - only center and zoom are required.
	map = new google.maps.Map(document.getElementById('map'), {
		center: {
			lat: 43.6426916,
			lng: -79.3986131
		},
		zoom: 13,
		styles: styles,
		mapTypeControl: false
	});
	// These are the real estate listings that will be shown to the user.
	// Normally we'd have these in a database instead.
	/*jshint loopfunc: true */
	var largeInfowindow = new google.maps.InfoWindow();
	var bounds = new google.maps.LatLngBounds();
	// The following group uses the location array to create an array of markers on initialize.
	for (var i = 0; i < locations.length; i++) {
		//	locations.forEach {function(location) {
		// Get the position from the location array.
		var position = locations[i].location;
		var title = locations[i].title;
		var venueFoursquareID = locations[i].id;
		// Create a marker per location, and put into markers array.
		var marker = new google.maps.Marker({
			map: map,
			position: position,
			title: title,
			animation: google.maps.Animation.DROP,
			id: i,
			fourSQ: venueFoursquareID
		});
		// Push the marker to our array of markers.
		markers.push(marker);
		//results from filtered list
		locations[i].marker = marker;

		marker.addListener('click', toggleBounce);
		// Create an onclick event to open an infowindow at each marker.
		marker.addListener('click', function () {
			populateInfoWindow(this, largeInfowindow);
			console.log('clicked');

		});

		bounds.extend(markers[i].position);
	}
	// Extend the boundaries of the map for each marker
	map.fitBounds(bounds);



}

// error handling for map
function googleMapsApiErrorHandler() {
	console.log('Error: Google maps API');
	$('#map').append('<div class="errorerror"><p>Google Maps loading error. Please refresh in a few moments.</p></div>');
}

// This function populates the infowindow when the marker is clicked. We'll only allow
// one infowindow which will open at the marker that is clicked, and populate based
// on that markers position.
function populateInfoWindow(marker, infowindow) {
	// Check to make sure the infowindow is not already opened on this marker.
	if (infowindow.marker != marker) {
		//foursquare api info
		var apiURL = 'https://api.foursquare.com/v2/venues/';
		var foursquareClientID = '5JI5OMRGWLPI2EY5T4K44KUE4BC5AKKY4CCBEHQ1MECTT4YU';
		var foursquareSecret = 'I0HJT34P2IUV554D1LBEQBOP2NCHETN0DXGUOTQ5EGNMAWJT';
		var foursquareVersion = '20170112';

		var foursquareURL = apiURL + marker.fourSQ + '?client_id=' + foursquareClientID + '&client_secret=' + foursquareSecret + '&v=' + foursquareVersion;

		//calls to populate infowindow
		$.ajax({
			url: foursquareURL,
			success: function (data) {
				var desc = data.response.venue.location.formattedAddress;
				var descURL = data.response.venue.url;
				var fsqURL = data.response.venue.canonicalUrl;
				infowindow.marker = marker;
				infowindow.setContent('<h3>' + marker.title + '</h3>' + desc + '<br> <br> <a href="' + descURL + '" target="_blank">MAIN SITE</a> | <a href="' + fsqURL + '" target="_blank">FOURSQUARE</a>');
				infowindow.open(map, marker);
				// Make sure the marker property is cleared if the infowindow is closed.
				infowindow.addListener('closeclick', function () {
					infowindow.setMarker = null;
				});
			},

			error: function (data) {
				// Error handler when request to Foursquare fails
				alert("Details not currently available.");
			}
		});

	}
}


var locations = [{
		title: 'Art Gallery of Ontario',
		id: '4ad4c05ef964a520daf620e3', //foursquare id
		location: {
			lat: 43.6536,
			lng: -79.3925
		},

	},
	{
		title: 'CN Tower',
		id: '4ad4c05ef964a52096f620e3',
		location: {
			lat: 43.6426,
			lng: -79.3871
		}
	},
	{
		title: 'The Distillery Historic District',
		id: '4ad4c05ef964a520bff620e3',
		location: {
			lat: 43.6503,
			lng: -79.3596
		}
	},
	{
		title: 'St. Lawrence Market',
		id: '4ad4c062f964a520fbf720e3',
		location: {
			lat: 43.6491,
			lng: -79.3718
		}
	},
	{
		title: 'Casa Loma',
		id: '4bef48fcc80dc9284ec827e3',
		location: {
			lat: 43.6780,
			lng: -79.4094
		}
	},
	{
		title: 'Nathan Phillips Square',
		id: '4ad4c05ef964a520a6f620e3',
		location: {
			lat: 43.6525,
			lng: -79.3835
		}
	},
	{
		title: 'Hockey Hall of Fame',
		id: '4ad4c05ef964a520d8f620e3',
		location: {
			lat: 43.6473,
			lng: -79.3777
		}
	}

];


function toggleBounce() {
	var self = this;
	self.setAnimation(google.maps.Animation.BOUNCE);
	setTimeout(function () {
		self.setAnimation(null);
	}, 1450);
}

var viewModel = {
	query: ko.observable(''),
	markerListBounce: function (location) {
		google.maps.event.trigger(location.marker, 'click');
		console.log('list cliked!!!');
	}

};

//function to return match for return filtered lists
viewModel.locations = ko.dependentObservable(function () {
	var search = this.query().toLowerCase();
	return ko.utils.arrayFilter(locations, function (location) {
		var match = location.title.toLowerCase().indexOf(search) >= 0;
		console.log(location);

		if (location.marker) {
			location.marker.setVisible(match);
		}
		return match;
	});


}, viewModel);


ko.applyBindings(viewModel);

//function for accessing location list
function openNav() {
	document.getElementById("mySidenav").style.width = "362px";

}

function closeNav() {
	document.getElementById("mySidenav").style.width = "0";
}
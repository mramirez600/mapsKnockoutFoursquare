

      var map;
      // Create a new blank array for all the listing markers.
      var markers = [];
      function initMap() {
        // Constructor creates a new map - only center and zoom are required.
        map = new google.maps.Map(document.getElementById('map'), {
         center: {
      lat: 43.6426916,
      lng: -79.3986131
    },
          zoom: 13
        });
        // These are the real estate listings that will be shown to the user.
        // Normally we'd have these in a database instead.

        var largeInfowindow = new google.maps.InfoWindow();
        var bounds = new google.maps.LatLngBounds();
        // The following group uses the location array to create an array of markers on initialize.
        for (var i = 0; i < locations.length; i++) {
          // Get the position from the location array.
          var position = locations[i].location;
          var title = locations[i].title;
          // Create a marker per location, and put into markers array.
          var marker = new google.maps.Marker({
            map: map,
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
            id: i
          });
          // Push the marker to our array of markers.
          markers.push(marker);
          // Create an onclick event to open an infowindow at each marker.
          marker.addListener('click', function() {
            populateInfoWindow(this, largeInfowindow);
          });
          bounds.extend(markers[i].position);
        }
        // Extend the boundaries of the map for each marker
        map.fitBounds(bounds);
      }
      // This function populates the infowindow when the marker is clicked. We'll only allow
      // one infowindow which will open at the marker that is clicked, and populate based
      // on that markers position.
      function populateInfoWindow(marker, infowindow) {
        // Check to make sure the infowindow is not already opened on this marker.
        if (infowindow.marker != marker) {
          infowindow.marker = marker;
          infowindow.setContent('<div>' + marker.title + '</div>');
          infowindow.open(map, marker);
          // Make sure the marker property is cleared if the infowindow is closed.
          infowindow.addListener('closeclick',function(){
            infowindow.setMarker = null;
          });
        }
      }

      var locations = [{
        title: 'Chinatown',
        location: {
          lat: 43.6509,
          lng: -79.3972
        },
        marker: 1
      },
      {
        title: 'CN Tower',
        location: {
          lat: 43.6426,
          lng: -79.3871
        }
      },
      {
        title: 'The Distillery Historic District',
        location: {
          lat: 43.6503,
          lng: -79.3596
        }
      },
      {
        title: 'St. Lawrence Market',
        location: {
          lat: 43.6491,
          lng: -79.3718
        }
      },
      {
        title: 'Casa Loma',
        location: {
          lat: 43.6780,
          lng: -79.4094
        }
      },
      {
        title: 'Nathan Phillips Square',
        location: {
          lat: 43.6525,
          lng: -79.3835
        }
      },
      {
        title: 'Hockey Hall of Fame',
        location: {
          lat: 43.6473,
          lng: -79.3777
        }
      }
  
    ];



    var viewModel = {
    query: ko.observable('')
    };
    
    viewModel.locations = ko.dependentObservable(function() {
      var search = this.query().toLowerCase();
      return ko.utils.arrayFilter(locations, function(location) {       
          return location.title.toLowerCase().indexOf(search) >= 0;
      });
    }, viewModel);

    ko.applyBindings(viewModel);


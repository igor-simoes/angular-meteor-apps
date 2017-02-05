Meteor.methods({
  searchAlbums: function(query) {
      var spotifyApi = new SpotifyWebApi();
      //grab JSON list of albums based on text search
      var response = spotifyApi.searchAlbums(query, {
        limit: 50
      });
      // Need to refresh token
      if (checkTokenRefreshed(response, spotifyApi)) {
        response = spotifyApi.searchAlbums(query, {
          limit: 50
        });
      }
      return response.data.body;
  },

  searchArtists: function(query){
      var spotifyApi = new SpotifyWebApi();
      //grab JSON list of albums based on text search
      var response = spotifyApi.searchArtists(query, {
        limit: 50
      });
      // Need to refresh token
      if (checkTokenRefreshed(response, spotifyApi)) {
        response = spotifyApi.searchArtist(query, {
          limit: 50
        });
      }
      return response.data.body;
  },

  getPlaylists: function(query){
      var spotifyApi = new SpotifyWebApi();
      //grab JSON list of albums based on text search
      var response = spotifyApi.getUserPlaylists(query, {
        limit: 50
      });
      // Need to refresh token
      if (checkTokenRefreshed(response, spotifyApi)) {
        response = spotifyApi.getUserPlaylists(query, {
          limit: 50
        });
      }
      return response.data.body;
  }

});

var checkTokenRefreshed = function(response, api) {
    if (response.error && response.error.statusCode === 401) {
      api.refreshAndUpdateAccessToken();
      return true;
    }

    return false;
  };
}

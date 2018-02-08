var express = require("express"),
    app = express();
    
const igdb = require('igdb-api-node').default;
const client = igdb('edfd6a2a88c93f386e7b629be931cbb6');

app.set("view engine", "ejs");
app.use(express.static("public"));

//=======================
//      ROUTES
//=======================

// Index - search for games
app.get("/", function(req, res) {
    res.render("search");
});

// Show results of search
app.get("/results", function(req, res) {
    var query = req.query.search;
    client.games({
    search: query, // Search for user input
    limit: 30, // Limit to 10 results
    expand: ["genres"]
    },
    [
      "name",
      "url",
      "cover",
      "id",
      "game.genres"
    ]).then(response => {
        // response.body contains the parsed JSON response to this query
        var games = response.body;
        
        for(var i = games.length - 1; i >= 0; i--) {
            if(games[i].cover === undefined) {
                games.splice(i, 1);
            }
        }
        
        // iterating over all games for images 
        var images = []; 
        for(var i = 0; i < games.length; i++) {
            if(games[i].cover) {
                images.push(client.image({
                    cloudinary_id: games[i].cover.cloudinary_id
                }, "cover_big", "jpg"));
            }
        }
        
        // Render results page and send data
        res.render("results", {data: games, images: images});
    }).catch(error => {
        throw error;
    });
});

// Display description of individual game
app.get("/results/:id", function(req, res) {
    client.games({
        ids: [req.params.id],
        expand: ["game",
        "developers",
        "genres",
        "themes",
        "games"]
    },
    [
        "name",
        "summary",
        "storyline",
        "developers",
        "publishers",
        "genres",
        "first_release_date",
        "cover",
        "screenshots",
        "videos",
        "rating",
        "pegi",
        "esrb",
        "aggregated_rating",
        "game.genres",
        "game.developers",
        "developers.name",
        "game.games"
    ]).then(response => {
        // response.body contains the parsed JSON response to this query
        var data = response.body;

        console.log(data[0].games[0].cover);

        // store image of game cover
        var image = client.image({
            cloudinary_id: data[0].cover.cloudinary_id
        }, "cover_big", "jpg");
        
        //store screenshots for jumbotron
        var jumbotron = client.image({
            cloudinary_id: data[0].screenshots[0].cloudinary_id
        }, "screenshot_huge", "jpg");
        
        // Render individual game page and send data
        res.render("game", {data:data, image:image, jumbotron:jumbotron});
    }).catch(error => {
        throw error;
    });
});
    
app.listen(3000, function() {
    console.log("Game app has now started");
});
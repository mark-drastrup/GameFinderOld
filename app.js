var express = require("express"),
    app = express();

require("dotenv").config(); 

const igdb = require('igdb-api-node').default;
const client = igdb(process.env.APIKey);


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
    limit: 30, // Limit to 30 results
    filters: {
        'version_parent.not_exists': '1',
        'category.eq': '0'
        },
    },
    [
      "name",
      "url",
      "cover",
      "id"
    ]).then(response => {
        // Response.body contains the parsed JSON response to this query
        var games = response.body;
        
        for(var i = games.length - 1; i >= 0; i--) {
            if(games[i].cover === undefined) {
                games.splice(i, 1);
            }
        }
        
        // Iterating over all games for images 
        var images = []; 
        for(var i = 0; i < games.length; i++) {
            if(games[i].cover) {
                images.push(client.image({
                    cloudinary_id: games[i].cover.cloudinary_id
                }, "cover_big", "jpg"));
            }
        }

        // Render results page and send data
        res.render("results", {data: games, images: images, query:query});
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
        "platforms",
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
        "platforms.name",
        "aggregated_rating",
        "game.genres",
        "game.developers",
        "developers.name",
        "game.games"
    ]).then(response => {
        // response.body contains the parsed JSON response to this query
        var data = response.body;
        
        // store image of game cover
        var image = client.image({
            cloudinary_id: data[0].cover.cloudinary_id
        }, "cover_big", "jpg");

        // iterating through all related games and store covers 
        var covers = []; 
        for(var i = 0; i < data[0].games.length; i++) {
            if(data[0].games[i].cover !== undefined) {
                covers.push(client.image({
                    cloudinary_id: data[0].games[i].cover.cloudinary_id
                }, "cover_big", "jpg"));
            }
        }

        //console.log(covers);

        //console.log(data[0].games[0]);
        
        //store screenshots for jumbotron
        var jumbotron = client.image({
            cloudinary_id: data[0].screenshots[0].cloudinary_id
        }, "screenshot_huge", "jpg");
        
        // Render individual game page and send data
        res.render("description", {data:data, image:image, jumbotron:jumbotron, covers:covers});
    }).catch(error => {
        throw error;
    });
});
    
app.listen(3000, function() {
    console.log("Game app has now started");
});
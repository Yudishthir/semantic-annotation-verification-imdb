const fs = require('fs');
const validate = require('../modules/validate.js');

const Movie = require("../schemas/Movie.json");
const AggrRating = require("../schemas/AggregateRating.json");
const Review = require('../schemas/Review.json');

const MovieDetails = fs.readFileSync("data.json");
const data = JSON.parse(MovieDetails);

const ldJson = validate.getLdJsonKeys(data[0]);
const microdata = validate.getMicroDataKeys(data[1]);
const movieProps = validate.getMovieProps(Movie["https://schema.org/Movie"]["@graph"]);
const aggrProps = validate.getMovieProps(AggrRating["https://schema.org/AggregateRating"]["@graph"]);
const reviewProps = validate.getMovieProps(Review["https://schema.org/Review"]["@graph"]);

// console.log(reviewProps);
// console.log(aggrProps);
// console.log(microdata);

console.log("\nLd/Json Values:\n");
// console.log(ldJson);
ldJson[0].forEach(element => {
    if(element[0] != '@') {
        if (movieProps.indexOf(element) === -1) {
            console.log(element, ": Doesn't exist in Movie schema");
        }
        else {
            console.log(element, ": Found in Movie schema");
        }
    }
});

ldJson[1].forEach(element => {
    if(element[0] != '@') {
        if (reviewProps.indexOf(element) === -1) {
            console.log(element, ": Doesn't exist in Review schema");
        }
        else {
            console.log(element, ": Found in Review schema");
        }
    }
});

ldJson[2].forEach(element => {
    if(element[0] != '@') {
        if (aggrProps.indexOf(element) === -1) {
            console.log(element, ": Doesn't exist in AggregateRating schema");
        }
        else {
            console.log(element, ": Found in AggregateRating schema");
        }
    }
});

console.log("\nMicrodata Values:\n");
if(microdata.length > 1) {
    if(microdata[0].substring(0,4) == "http") {
        microdata[0] = microdata[0].substring(0,4) + "s" + microdata[0].substring(4);
    }

    if (Movie.hasOwnProperty(microdata[0])) {
        for(let i = 1; i < microdata.length; i++) {
            if (movieProps.indexOf(microdata[i]) === -1) {
                console.log(microdata[i], ": Doesn't exist in Movie schema");
            }
            else {
                console.log(microdata[i], ": Found in Movie schema");
            }
        }
    }
    else if(Review.hasOwnProperty(microdata[0])) {
        for(let i = 1; i < microdata.length; i++) {
            if (reviewProps.indexOf(microdata[i]) === -1) {
                console.log(microdata[i], ": Doesn't exist in Review schema");
            }
            else {
                console.log(microdata[i], ": Found in Review schema");
            }
        }
    }
    else if(AggrRating.hasOwnProperty(microdata[0])) {
        for(let i = 1; i < microdata.length; i++) {
            if (aggrProps.indexOf(microdata[i]) === -1) {
                console.log(microdata[i], ": Doesn't exist in AggregateRating schema");
            }
            else {
                console.log(microdata[i], ": Found in AggregateRating schema");
            }
        }
    }
    else {
        console.log("Listed properties may be from some other schema");
    } 
}


var express = require('express');
const Support = require("./modules/support");
const Validate = require('./modules/validate.js');

let cheerio = require('cheerio');
let request = require('request');

const Movie = require("./schemas/Movie.json");
const AggrRating = require("./schemas/AggregateRating.json");
const Review = require('./schemas/Review.json');

var app = express();

app.use(express.static('public'));

app.get('/', function (req, res) {
    res.render("index.html");
});

app.get('/getOutput', function (req, resp) {
    let url = req.query.url;
    let JsonObjList = [];
    let response = {};
    console.log("GET call made to getOutput");

    request(url, function (err, res, body) {
        if(err)
        {
            console.log(err, "error occured while hitting URL");
            res.end(JSON.stringify(err));
        }
        else
        {
            // ld/json format
            let $ = cheerio.load(body);
            const scriptContent = $('script').get();

            scriptContent.forEach(scriptTag => {
                let scriptType = scriptTag.attribs.type;
                if(scriptType == "application/ld+json"){
                    scriptTag.children.forEach(element => {
                        JsonObjList.push(JSON.parse(element.data.toString()));
                    });
                }
            });

            // microdata format
            const microData = $('body').find('[itemscope]');
            let microDataObj = {};

            const printChildren = function (parent,result = []) {
                let children = $(parent).children();
                if(children.length > 0){
                    result.push(JSON.parse(JSON.stringify(parent.attribs)));
                    children.each((i, elem) => printChildren(elem, result));
                }else{
                    result.push(JSON.parse(JSON.stringify(parent.attribs)));
                }
                return Support.getRelevantAttributes(result);
            };
            for (let index = 0; index < microData.length; index++) {
                microDataObj = {};
                const schemaElement = microData[index];
                // console.log(schemaElement);
                let content = $(schemaElement).text().split("\n");
                let dummy = content;
                let matchLoc = 0;
                content.forEach((element,index) => {
                    // Custom for IMDB page
                    if(element.indexOf('/') > -1) {
                        element = element.split('/');
                        dummy = Support.insertArrayAt(dummy, dummy.length-content.length+index, element);
                    }
                });
                content = dummy;
                content = Support.getRelevantText(content);
                microDataObj["microdata_" + index.toString()] = printChildren(schemaElement);
                Object.keys(microDataObj["microdata_" + index.toString()][0]).forEach(tag => {
                    if(tag != "itemtype" && tag != "itemscope" && matchLoc < content.length) {
                        microDataObj["microdata_" + index.toString()][0][[tag]] = '';
                    }
                });
                for(let i = 1; i < microDataObj["microdata_" + index.toString()].length; i++) {
                    element = microDataObj["microdata_" + index.toString()][i];
                    Object.keys(element).forEach(tag => {
                        if(tag != "itemtype" && tag != "itemscope" && matchLoc < content.length) {
                            element[[tag]] = content[matchLoc++];
                        }
                    });
                }
                JsonObjList.push(microDataObj);            
            }

            response.status = res.statusCode;
            response.content = JsonObjList;  
            resp.end(JSON.stringify(response)); 
        }
    });
});

app.get('/validate', function (req, resp) {
    console.log("GET call made to validate");
    let metadata = req.query.metadata;
    let data = JSON.parse(metadata).content;
    let valArray = [];

    const microdata = Validate.getMicroDataKeys(data[1]);
    const ldJson = Validate.getLdJsonKeys(data[0]);
    const movieProps = Validate.getMovieProps(Movie["https://schema.org/Movie"]["@graph"]);
    const aggrProps = Validate.getMovieProps(AggrRating["https://schema.org/AggregateRating"]["@graph"]);
    const reviewProps = Validate.getMovieProps(Review["https://schema.org/Review"]["@graph"]);

    // console.log(ldJson);
    ldJson[0].forEach(element => {
        if(element[0] != '@') {
            if (movieProps.indexOf(element) === -1) {
                // console.log(element, ": Doesn't exist in Movie schema");
                valArray.push(`${element} doesn't exist in Movie schema`);
            }
        }
    });

    ldJson[1].forEach(element => {
        if(element[0] != '@') {
            if (reviewProps.indexOf(element) === -1) {
                // console.log(element, ": Doesn't exist in Review schema");
                valArray.push(`${element} doesn't exist in Review schema`);
            }
        }
    });

    ldJson[2].forEach(element => {
        if(element[0] != '@') {
            if (aggrProps.indexOf(element) === -1) {
                // console.log(element, ": Doesn't exist in AggregateRating schema");
                valArray.push(`${element} doesn't exist in AggregateRating schema`);
            }
        }
    });

    if(microdata.length > 1) {
        if(microdata[0].substring(0,4) == "http") {
            microdata[0] = microdata[0].substring(0,4) + "s" + microdata[0].substring(4);
        }
    
        if (Movie.hasOwnProperty(microdata[0])) {
            for(let i = 1; i < microdata.length; i++) {
                if (movieProps.indexOf(microdata[i]) === -1) {
                    valArray.push(`${microdata[i]} doesn't exist in Movie schema`);
                }
            }
        }
        else if(Review.hasOwnProperty(microdata[0])) {
            for(let i = 1; i < microdata.length; i++) {
                if (reviewProps.indexOf(microdata[i]) === -1) {
                    valArray.push(`${microdata[i]} doesn't exist in Review schema`);
                }
            }
        }
        else if(AggrRating.hasOwnProperty(microdata[0])) {
            for(let i = 1; i < microdata.length; i++) {
                if (aggrProps.indexOf(microdata[i]) === -1) {
                    valArray.push(`${microdata[i]} doesn't exist in AggregateRating schema`);
                }
            }
        }
        else {
            valArray.push("Listed properties may be from some other schema");
        } 
    }
    // valArray.push("TEsting")
    // valArray.push("TEsting1")
    // valArray.push("TEsting2")

    resp.end(valArray.toString());
});

var server = app.listen(8081, function () {
    var host = server.address().address;
    var port = server.address().port;
    
    console.log("App listening at http://%s:%s", host, port);
});
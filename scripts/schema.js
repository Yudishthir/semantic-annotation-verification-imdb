const Support = require("../modules/support");

const cheerio = require('cheerio');
const axios = require('axios');
const fs = require('fs');

// let url = "https://www.imdb.com/title/tt0111161/?pf_rd_m=A2FGELUUNOQJNL&pf_rd_p=e31d89dd-322d-4646-8962-327b42fe94b1&pf_rd_r=6YVAD0220FVC6E1WC4AJ&pf_rd_s=center-1&pf_rd_t=15506&pf_rd_i=top&ref_=chttp_tt_1";
// let url = "https://www.imdb.com/title/tt0068646/?ref_=hm_tpks_tt_1_pd_tp1";
// let url = "https://www.imdb.com/title/tt0110912/?ref_=hm_tpks_tt_2_pd_tp1";
// let url = "https://www.imdb.com/title/tt0137523/?ref_=hm_tpks_tt_4_pd_tp1";
// let url = "https://www.imdb.com/title/tt0109830/?ref_=hm_tpks_tt_3_pd_tp1";
// let url = "https://schema.org/Movie";
// let url = "https://schema.org/AggregateRating";
// let url = "https://schema.org/Rating";
let url = "https://schema.org/Review";
let JsonObj = {};

axios.get(url)
    .then(function (response) {
        // ld/json format
        let $ = cheerio.load(response.data, {
            decodeEntities: false,
            xmlMode: false
        });

        const scriptContent = $('body > script').get();
        
        scriptContent.forEach(scriptTag => {
            let scriptType = scriptTag.attribs.type;
            if(scriptType == "application/ld+json"){
                scriptTag.children.forEach(element => {
                    JsonObj[url] = JSON.parse(element.data.toString());
                });
            }
        }); 
        // console.log(JsonObj);
        if(JsonObj) {
            let urlString = url.split('/');
            urlString = urlString[urlString.length - 1];

            fs.writeFile(`./schemas/${urlString}.json`, JSON.stringify(JsonObj, null, 4), function(err) {
                if (err) {
                    console.log(err);
                }
            });
        }
    })
    .catch(function (error) {
        // handle error
        console.log(error);
});
    

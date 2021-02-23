const Support = require("../modules/support");

let cheerio = require('cheerio');
let request = require('request');
const fs = require('fs');

let url = "https://www.imdb.com/title/tt0111161/?pf_rd_m=A2FGELUUNOQJNL&pf_rd_p=e31d89dd-322d-4646-8962-327b42fe94b1&pf_rd_r=6YVAD0220FVC6E1WC4AJ&pf_rd_s=center-1&pf_rd_t=15506&pf_rd_i=top&ref_=chttp_tt_1";
// let url = "https://www.imdb.com/title/tt0068646/?ref_=hm_tpks_tt_1_pd_tp1";
// let url = "https://www.imdb.com/title/tt0110912/?ref_=hm_tpks_tt_2_pd_tp1";
// let url = "https://www.imdb.com/title/tt0137523/?ref_=hm_tpks_tt_4_pd_tp1";
// let url = "https://www.imdb.com/title/tt0109830/?ref_=hm_tpks_tt_3_pd_tp1";
let JsonObjList = [];

request(url, function (err, res, body) {
    if(err)
    {
        console.log(err, "error occured while hitting URL");
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
        const microDataObj = {};

        const printChildren = function (parent,result = []) {
            let children = $(parent).children();
            if(children.length > 0){
                result.push(JSON.parse(JSON.stringify(parent.attribs)));
                children.each((i, elem) => printChildren(elem, result));
            }else{
                result.push(JSON.parse(JSON.stringify(parent.attribs)))
            }
            return Support.getRelevantAttributes(result);
        };
        
        for (let index = 0; index < microData.length; index++) {
            const schemaElement = microData[index];
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
            // console.log(content);
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

        // console.log(microDataObj);
        fs.writeFile("data.json", JSON.stringify(JsonObjList, null, 4), err => {
            if(err) {
                console.log(err, "\nFailed to write file");
            }
        });
    }
});

// First object in microdata list is always the sccope and type
module.exports = {
    getLdJsonKeys: (data) => {
        let keyArray = [];
        let movieArray = [];
        let reviewArray = [];
        let aggrArray = [];
        Object.keys(data).forEach(key => {
            if(key == "aggregateRating") {
                Object.keys(data[[key]]).forEach(elem => {
                    aggrArray.push(elem)
                })
            }
            else if(key == "review") {
                Object.keys(data[[key]]).forEach(elem => {
                    reviewArray.push(elem)
                })
            }
            else {
                movieArray.push(key)
            }
        });
        keyArray.push(movieArray);
        keyArray.push(reviewArray);
        keyArray.push(aggrArray);
        return keyArray;
    },
    
    getMovieProps: (data) => {
        let propArray = [];
        data.forEach(element => {
            if(element["@type"] == "rdf:Property")
                propArray.push(element["@id"].substring(7));
        });
        return propArray;
    },

    getMicroDataKeys: (data) => {
        let propArray = [];
        Object.keys(data).forEach((key) => {
            dataObj = data[[key]];
            if(dataObj[0].hasOwnProperty("itemtype")) {
                propArray.push(dataObj[0].itemtype);
            }
            else {
                propArray.push("xb69");
            }
            for(let i = 1; i < dataObj.length; i++) {
                Object.keys(dataObj[i]).forEach(subKey => {
                    propArray.push(subKey);
                });
            }
        });
        return propArray;
    }
}
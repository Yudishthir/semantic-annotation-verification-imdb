module.exports = {
    getAllAttributes: (node) => {
        return node.attributes || Object.keys(node.attribs).map(
            name => ({ name, value: node.attribs[name] })
        );
    },
    
    jsonify: (str) => {
        let obj = str.split('\n');
        let res = obj.join('');
        return res;
    },
    
    getRelevantAttributes: (result) => {
        let finRes = [];
        result.forEach(element => {
            let attributes = {};
            let attrList = Object.keys(element);
            attrList.forEach(key => {
                if(key == "itemtype" || key == "itemscope") {
                    attributes[[key]] = element[key];
                }
                else if(key == "itemprop") {
                    attributes[[element[key]]] = element[key];
                }
            });
            if(Object.keys(attributes).length > 0)
                finRes.push(attributes);
        });
        return finRes;
    },

    getRelevantText: (content) => {
        return content.map(element => {
            return element.replace(/\s+/g,' ').replace(/^\s+|\s+$/g,'');
        }).filter(element => {
            return element != ' ' && element.length != 0;
        });
    },

    insertArrayAt: (array, index, insertionArray) => {
        array.splice(index++,1,insertionArray[0]);
        for (let ind = 1; ind < insertionArray.length; ind++) {
            array.splice(index++,0,insertionArray[ind]);
        }
        return array;
    },
}

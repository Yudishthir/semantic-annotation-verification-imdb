function syntaxHighlight(json) {
    if (typeof json != 'string') {
        json = JSON.stringify(json, undefined, 2);
    }
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}

$(document).ready(function(){
    var url;
    var metadata;

    $("#url_search").submit(function(e){
        e.preventDefault();
        var loader = document.getElementById("loader");
        var test = document.getElementById("result");
        var footer = document.getElementById("footer");
        var copy = document.getElementById("copy");
        var validate = document.getElementById("validate");
        test.style.display = "none";
        footer.style.position = "absolute";
        copy.style.display = "none"
        validate.style.display = "none"
        loader.style.display = "block";
        url=$("#url").val();
        // console.log(url);
        $.get("http://localhost:8081/getOutput",{url:url}, function(data){
            let op = document.getElementById("output");
            metadata = data;
            op.innerHTML = "";
            test.style.display = "block";
            loader.style.display = "none";
            if(JSON.parse(data).content != 0) {
                footer.style.position = "static";
                op.innerHTML = syntaxHighlight(JSON.stringify(JSON.parse(data),null,2));
                copy.style.display = "block"
                validate.style.display = "block";
            }
            else {
                op.innerHTML = "<h2 style='color: red'>No Metadata found </h2>";
            }
        });
    });

    $("#validate").click(function(e){
        // console.log(metadata);
        $.get("http://localhost:8081/validate",{metadata:metadata}, function(data){
            var x = document.getElementById("snackbar");
            if(data.length == 0) {
                x.style.backgroundColor = "green";
                x.innerText = "No errors found";
                x.className = "show";
                setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
            }
            else {
                x.style.backgroundColor = "red";
                data = data.split(",");
                x.innerText = `${data.length} errors found`
                x.className = "show";
                setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
            }
        });
    });

    $("#copy").click(function(e){
        try {
            navigator.clipboard.writeText(JSON.stringify(JSON.parse(metadata), null, 4));
        }
        catch (error) {
            console.error("copy failed", error);
        }
    });
});


define(function() {
    var scratch = document.createElement('div');
    return function (html_str) {
        var rv;
        scratch.innerHTML = html_str;
        rv = scratch.childNodes[0];
        scratch.removeChild(rv);
        return rv;
    };
});

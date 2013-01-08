require(['controls', 'util'], function(controls, util) {
    var $ = (function() {
        var scratch = document.createElement('div');
        return function (html_str) {
            var rv;
            scratch.innerHTML = html_str;
            rv = scratch.childNodes[0];
            scratch.removeChild(rv);
            return rv;
        }
    }());

    var set_class = function(elem, classname, enabled) {
        var classes = elem.className.split(/\s+/),
            ix = classes.indexOf(classname);

        if (enabled && ix === -1) {
            classes.push(classname);
        } else if (!enabled && ix !== -1) {
            classes.splice(ix, 1);
        } else {
            return;
        }

        elem.className = classes.join(' ');

    };

    var bind = function(elem, event, fn) {
        if (elem.addEventListener) {
            elem.addEventListener(event, fn, false);
        }
        else if (elem.attachEvent) {
            elem.attachEvent('on'+event, (function(e) {
                return function() {
                    fn.call(e);
                }
            })(elm)) ;
        }
    };

    var id = function (x) {
        return document.getElementById(x);
    }

    var mklabel = function(name) {
        var d = $('<div class="label" />'),
            visible = true;

        d.appendChild($('<div><span></span>' + name + '</div>'));
        bind(d, 'click', function() {
            visible = !visible;
            controls.visible(name, visible);
            set_class(d, 'disabled', !visible);
        });

        return d;
    }

    util.names('example', function(names) {
        var d = $('<div />');
        names.forEach(function(name) {
            d.appendChild(mklabel(name));
        });
        document.getElementsByTagName('body')[0].appendChild(d);
    });

    window.controls = controls;
    window.util = util;
    controls.init('example');
});

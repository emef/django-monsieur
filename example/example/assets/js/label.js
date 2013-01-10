define(['html'], function($) {
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
    };

    return new (function Labels() {
        var self = this;

        this.make = function(text, cb1, cb2) {
            var l = $('<div class="label" />'),
                s = $('<div class="toggle" />'),
                d = $('<div />');

            d.appendChild(s);
            d.appendChild($('<span>'+text+'</span>'));
            l.appendChild(d);

            set_class(s, 'toggled', true);
            set_class(l, 'toggled', false);

            bind(s, 'click', (function() {
                var toggled = true;
                return function(e) {
                    toggled = !toggled;
                    cb1(toggled);
                    set_class(d, 'toggled', toggled);
                    e.stopPropagation();
                }
            }()));

            bind(l, 'click', (function() {
                var toggled = false;
                return function(e) {
                    toggled = !toggled;
                    cb2(toggled);
                    set_class(l, 'toggled', !toggled);
                    e.stopPropagation();
                }
            }()));

            return l;
        };
    });
});

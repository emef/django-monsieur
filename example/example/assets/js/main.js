require([
    'controls',
    'util',
    'label',
    'html'
], function(
    controls,
    util,
    label,
    $
) {
    var TAG = 'example';

    /* goal:

       plot:
           1. # offers/hour for each site
           2. # offers/hour total
    */

    var event_name = 'offer';

    util.attrs(event_name, {}, function(attrs) {
        var ids = [],
            options = attrs.site;

        ids.push(controls.register(event_name, {site: '*'}))

        options.forEach(function(site) {
            ids.push(controls.register(event_name, {site: site}));
        });

        controls.push_context(ids);
    });






/*




    var make_vals_column = function(event_id, key, vals) {
        var event_name = controls.mapped(event_id).name;

        util.attrs(event_name, {}, function(attrs) {
            console.log('key =', key, 'vals =', vals);
        });
    };

    var add_keys_column = function(event_id) {
        var event_name = controls.mapped(event_id).name;

        util.attrs(event_name, {}, function(attrs) {
            for (var key in attrs) {
                if (attrs.hasOwnProperty(key)) {
                    var cb2 = function(toggled) {

                    };

                    make_vals_column(event_id, key, attrs[key]);
                }
            }
        });
    };

    var add_events_column = function(names) {
        var ids = [],
            column = $('<div class="column" />');

        names.forEach(function(name) {
            ids.push(controls.register(name, {}));
        });

        ids.forEach(function(id) {
            var event_name = controls.mapped(id).name;

            var cb1 = function(toggled) {
                controls.toggle(id, toggled);
            };

            var cb2 = function(toggled) {
                if (!toggled) {
                    controls.unwind();
                } else {
                    add_keys_column(id);
                    controls.only(id);
                }
            };

            column.appendChild(label.make(event_name, cb1, cb2));
        });

        controls.push_context(ids);
        util.container.appendChild(column);

    };

    var make_column = function(ids, cb_gen) {
        var column = $('<div class="column" />');

        ids.forEach(function(id) {
            var name = controls.mapped(id).name;

            var cb1 = function(toggled) {
                controls.toggle(id, toggled);
            };

            var cb2 = cb_gen(id);

            column.appendChild(label.make(name, cb1, cb2));
        });

        return column;
    };

    util.names(TAG, add_events_column);
*/

/*
        var cb_gen = function(id) {
            return function(toggled) {
                var obj = controls.mapped(id);
                util.attrs(obj.name, obj.attrs, function(attrs) {
                    var ids = [];
                    for (var key in attrs) {
                        if (attrs.hasOwnProperty(key)) {
                            var x = {};
                            x[key] = attrs[key];
                            ids.push(controls.register(key, x));
                        }
                    }

                    var column = make_column(ids, function() {});
                    util.container.appendChild(column);
                    controls.push_context(ids);
                });
            };
        };
*/


    window.controls = controls;
    window.util = util;
    window.label = label;
    window.$ = $;
});

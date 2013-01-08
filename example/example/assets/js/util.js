define(function() {
    return (new function Util() {
        var self = this;

        this._plots = {};

        this.get = function(name, granularity, attrs, cb) {
            var url = ['/json', granularity, name].join('/');
            if (attrs) {
                url += '?';
                for (var key in attrs) {
                    if (attrs.hasOwnProperty(key)) {
                        url += escape(key) + '=' + escape(attrs[key]);
                    }
                }
            }

            if (!self._plots[url]) {
                self._plots[url] = {};
            }

            if (!self._plots[url][name]) {
                var cbs = [cb];

                self._plots[url][name] = function(cb) {
                    cbs.push(cb);
                }

                d3.json(url, function(plot) {
                    plot.forEach(function(pt, i) {
                        plot[i].dt = new Date(pt.dt);
                    });

                    self._plots[url] = self._plots[url] || {};
                    self._plots[url][name] = plot;

                    cbs.forEach(function(fn) {
                        fn(plot);
                    });
                });
            } else if (typeof(self._plots[url][name]) === 'function') {
                self._plots[url][name](cb);
            } else {
                cb(self._plots[url][name]);
            }
        };
    });
});
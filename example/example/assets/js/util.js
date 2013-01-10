define(function() {
    return (new function Util() {
        var self = this;

        this._names = [];
        this._plots = {};
        this._attrs = {};

        this.container = document.getElementsByTagName('body')[0];

        var makeqs = function(attrs) {
            var s = '';
            if (attrs) {
                s += '?';
                for (var key in attrs) {
                    if (attrs.hasOwnProperty(key)) {
                        s += escape(key) + '=' + escape(attrs[key]);
                    }
                }
            }
            return s;
        };

        this.names = function(tag, cb) {
            if (!self._names.length) {
                var queued = [cb];

                d3.json('/names/' + tag, function(names) {
                    self._names = names;
                    queued.forEach(function(fn) {
                        fn(names);
                    });
                });

                self._names = function(cb) {
                    queued.push(cb);
                }

            } else if (typeof(self._names) === 'function') {
                self._names(cb);
            } else {
                cb(self._names);
            }
        };

        this.attrs = function(name, attrs, cb) {
            var url = ['/attrs', name].join('/') + makeqs(attrs);
            if (!self._attrs[url]) {
                var queued = [cb];
                self._attrs[url] = function(cb) {
                    self.queued.push(cb);
                }

                d3.json(url, function(attrs) {
                    self._attrs[url] = attrs;
                    queued.forEach(function(fn) {
                        fn(attrs);
                    });
                });
            } else if (typeof(self._attrs) === 'function') {
                self._attrs[url](cb);
            } else {
                cb(self._attrs[url]);
            }
        };

        this.json = function(name, granularity, attrs, cb) {
            var url = ['/json', granularity, name].join('/') + makeqs(attrs);

            if (!self._plots[url]) {
                var queued = [cb];
                self._plots[url] = function(cb) {
                    queued.push(cb);
                }

                d3.json(url, function(res) {
                    var plot = res[name];
                    plot.forEach(function(pt, i) {
                        plot[i].dt = new Date(pt.dt);
                    });

                    self._plots[url] = plot;

                    queued.forEach(function(fn) {
                        fn(plot);
                    });
                });
            } else if (typeof(self._plots[url]) === 'function') {
                self._plots[url](cb);
            } else {
                cb(self._plots[url]);
            }
        };
    });
});

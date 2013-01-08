function defined(a, b) {
    if (a === undefined || a === null) {
        return b;
    } else if (b === undefined || b === null) {
        return a;
    }
}

function min(a, b) { return defined(a, b) || (a < b ? a : b) }
function max(a, b) { return defined(a, b) || (a < b ? b : a) }

var graph = (new function Graph() {
    var self = this;

    this.w = 600;
    this.h = 400;

    this.plots = [];
    this.min_date = null,
    this.max_date = null,
    this.max_count = 0;

    this.colors = ['steelblue', '#8B7355', '#2E8B57'];

    this.vis = d3.select('body')
        .append('div')
        .append('svg:svg')
        .attr('width', this.w)
        .attr('height', this.h)
        .append('svg:g');

    this.clear = function() {
        self.plots = [];
        self.max_count = 0;
        self.min_date = null;
        self.max_date = null;
    };

    this.draw = function(plot) {
        plot.forEach(function(pt) {
            self.max_count = max(self.max_count, pt.count);
            self.min_date = min(self.min_date, pt.dt);
            self.max_date = max(self.max_date, pt.dt);
        });

        var x = d3.time.scale().domain([self.min_date, self.max_date]).range([0, self.w]),
            y = d3.scale.linear().domain([0, self.max_count]).range([0, self.h]);

        self.vis.selectAll('path').remove()
        self.plots.push(plot);
        self.plots.forEach(function(plot, i) {
            self.vis.append('svg:path')
                .attr('class', 'line')
                .attr('stroke', self.colors[i%self.colors.length])
                .attr('d', (d3.svg.line()
                   .x(function(d) { return x(d.dt) })
                   .y(function(d) { return self.h - y(d.count) })
                   .interpolate('basis')
                )(plot)
            );
        });
    };
});

var controls = (new function Controls() {
    var self = this;

    this._names = [];
    this._visible = [];
    this._granularity = 'hour';
    this._filter = {};

    this.init = function(names) {
        self._names = names;
        self._visible = names;
        self.update();
    };

    this.add = function(name) {
        if (self._names.indexOf(name) === -1) {
            self._names.push(name);
            self._visible.push(name);
        }

        self.update();
    };

    this.visible = function(name, is_visible) {
        var ix = self._visible.indexOf(name);

        if (ix === -1 && is_visible) {
            self._visible.push(name);
        } else if (ix !== -1 && !is_visible) {
            self._visible.splice(ix, 1);
        } else {
            return;
        }

        self.update();
    };

    this.granularity = function(granularity) {
        if (granularity !== self._granularity) {
            self._granularity = granularity;
            self.update();
        }
    };

    this.filter = function(attrs) {
        self._filter = attrs;
        self.update();
    }

    this.update = function() {
        var done = (function(n) {
            var plots = [];
            return function(plot) {
                plots.push(plot);
                if (plots.length === n) {
                    graph.clear();
                    plots.forEach(graph.draw);
                }
            }
        }(self._visible.length));

        self._visible.forEach(function(name) {
            util.get(name, self._granularity, self._filter, done);
        });
    };
});

var util = (new function Util() {
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

controls.init(['e1', 'e2', 'e3']);

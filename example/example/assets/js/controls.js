define(['graph', 'util'], function(graph, util) {
    return (new function Controls() {
        var self = this;

        this._names = [];
        this._visible = [];
        this._granularity = 'hour';
        this._filter = {};

        this.init = function(tag) {
            util.json(function(names) {
                self._names = names;
                self._visible = names;
                self.update();
            });
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
});

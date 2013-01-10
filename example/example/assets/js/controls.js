define(['graph', 'util'], function(graph, util) {
    return (new function Controls() {
        var self = this;

        var is_array = function(x) {
            return (typeof(x) === 'object' &&
                    Object.prototype.toString.call(x) === '[object Array]');
        };

        var cpy = function(arr) {
            var a = [];
            arr.forEach(function(x) {
                if (is_array(x)) {
                    a.push(cpy(x));
                } else {
                    a.push(x);
                }
            });
            return a;
        };

        var color = (function() {
            var ix = 0, colors = ['steelblue', '#8B7355', '#2E8B57'];
            return function() {
                return colors[(ix++) % colors.length];
            };
        }());

        this._ids = [];
        this._visible = [];
        this._granularity = 'hour';
        this._filter = {};
        this._context = [];
        this._uid = 0;
        this._uid_map = {};

        this.push_context = function(ids) {
            self._ids = cpy(ids);
            self._visible = cpy(ids);
            self._context.push({
                ids: ids,
                visible: ids
            });
            self.update();
        }

        this.pop_context = function() {
            var context = self._context.pop();
            self._names = context.names;
            self._visible = context.visible;
            self.update();
        }

        this.unwind = function() {
            console.log('unwind');
            self._context = [self._context[0]];
            self._visible = self._ids;
            self.update();
        };

        this.register = function(name, attrs) {
            self._uid_map[self._uid] = {name:name, attrs:attrs, color:color()};
            self._uid += 1;
            return self._uid - 1;
        };

        this.mapped = function(id) {
            return self._uid_map[id];
        };

        this.toggle = function(id, toggled) {
            while (self._ids && (-1 === self._ids.indexOf(id))) {
                self.pop_context();
            }

            var ix = self._visible.indexOf(id);

            if (ix === -1 && toggled) {
                self._visible.push(id);
            } else if (ix !== -1 && !toggled) {
                self._visible.splice(ix, 1);
            } else {
                return;
            }

            self.update();
        };

        this.only = function(id) {
            self._visible = [id];
            self.update();
        };

        this.granularity = function(granularity) {
            if (granularity !== self._granularity) {
                self._granularity = granularity;
                self.update();
            }
        };

        this.update = function() {
            graph.clear();

            var done = (function(n) {
                var plots = [];
                return function(plot, color) {
                    plots.push([plot, color]);
                    if (plots.length === n) {
                        plots.forEach(function(args) {
                            graph.draw.apply(graph, args);
                        });
                    }
                };
            }(self._visible.length));

            self._visible.forEach(function(id) {
                var args = self._uid_map[id];
                util.json(args.name, self._granularity, args.attrs,
                          function(res) {
                              done(res, args.color);
                          });
            });
        };
    });
});

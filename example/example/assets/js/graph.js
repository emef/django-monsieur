define(function() {
    function defined(a, b) {
        if (a === undefined || a === null) {
            return b;
        } else if (b === undefined || b === null) {
            return a;
        }
    }

    function min(a, b) { return defined(a, b) || (a < b ? a : b) }
    function max(a, b) { return defined(a, b) || (a < b ? b : a) }

    return (new function Graph() {
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

});

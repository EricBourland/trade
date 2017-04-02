app.register("Location", function() {
    return Location;

    function Location(x, y) {
        this.directions = directions;

        this.x = x;
        this.y = y;

        function directions(xs, ys) {
            const v = {
                x: this.x - xs,
                y: this.y - ys
            };

            const magnitude = Math.sqrt(v.x * v.x + v.y * v.y);
            return {
                x: this.x,
                y: this.y,
                dx: v.x / magnitude,
                dy: v.y / magnitude,
                distance: magnitude
            };
        }
    }
});
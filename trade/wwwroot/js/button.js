app.register("Button", [function() {
    return Button;

    function Button(text, x, y, width, height, styles) {
        this.draw = draw;
        this.click = click;

        this.idle = true;
        this.hovering = false;
        this.pressed = false;
        this.text = text;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.styles = Object.assign({
            fillStyle: "#333",
            hoverFillStyle: "#666",
            pressFillStyle: "#777",
            fontSize: 14,
            fontFamily: "sans-serif",
            textFillStyle: "#77dd77"
        }, styles);

        let _click = () => {};

        function click(callback){
            _click = callback;
            return this;
        }

        function draw(context) {
            context.beginPath();
            context.rect(this.x, this.y, this.width, this.height);
            
            if (context.isPointInPath(app.mouse.offsetX, app.mouse.offsetY)) {
                if (app.mouse.down) {
                    if (this.hovering) {
                        this.pressed = true;
                        this.hovering = false;
                    }
                } else {
                    if (this.pressed){
                        _click();
                        this.pressed = false;
                    }
                    this.hovering = true;
                    this.idle = false;
                }
            }
            else {
                this.idle = true;
                this.hovering = this.pressed = false;
            }

            if (this.idle){
                context.fillStyle = this.styles.fillStyle;
            }
            else if (this.hovering){
                context.fillStyle = this.styles.hoverFillStyle;
            }
            else if (this.pressed){
                context.fillStyle = this.styles.pressFillStyle;
            }

            context.fill();

            const measure = context.measureText(this.text);
            context.font = this.styles.fontSize + "px " + this.styles.fontFamily;
            context.fillStyle = this.styles.textFillStyle;
            context.fillText(this.text, this.x + (this.width - measure.width) / 2, this.y + (this.height + this.styles.fontSize) / 2.2);
        }
    }
}]);
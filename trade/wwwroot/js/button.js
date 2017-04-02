app.register("Button", ["getMouseState", function(getMouseState) {
    return Button;

    function Button(text, x, y, width, height, styles) {
        this.draw = draw;
        this.click = click;

        this.state = {};
        this.text = text;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.textOffset = 0;
        this.styles = Object.assign({
            fillStyle: null,
            hoverFillStyle: "#eee",
            pressFillStyle: "#ddd",
            fontSize: 14,
            fontFamily: "sans-serif",
            fontStyle: "normal",
            textFillStyle: "#444"
        }, styles);

        let _click = () => {};

        function click(callback){
            _click = callback;
            return this;
        }

        function draw(context) {
            let measure;
            if (this.text){
                context.font = this.styles.fontStyle + " " + this.styles.fontSize + "px " + this.styles.fontFamily;
                measure = context.measureText(this.text);
                if (!this.width) {
                    this.width = measure.width + 10;
                }
                if (!this.height){
                    this.height = this.styles.fontSize + 6;
                }
            }

            context.beginPath();
            context.rect(this.x, this.y, this.width, this.height);

            this.state = getMouseState(context, this.state);

            if (this.show && !this.show(this)){
                return;
            }

            let fillStyle = null;
            if (this.state.idle){
                fillStyle = this.styles.fillStyle;
            }
            else if (this.state.hovering){
                fillStyle = this.styles.hoverFillStyle;
            }
            else if (this.state.pressed){
                fillStyle = this.styles.pressFillStyle;
            }

            if (fillStyle){
                context.fillStyle = fillStyle;
                context.fill();
            }

            if (this.styles.strokeStyle){
                context.strokeStyle = this.styles.strokeStyle;
                context.stroke();
            }

            if (this.text){
                context.fillStyle = this.styles.textFillStyle;
                let x;
                if (this.styles.alignment === "left"){
                    x = this.x + this.textOffset;
                } else {
                    x = this.x + this.textOffset + (this.width - measure.width) / 2;
                }
                context.fillText(this.text, x, this.y + (this.height + this.styles.fontSize) / 2.2);
            }

            if (this.state.clicked){
                _click();
            }
        }
    }
}]);
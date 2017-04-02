app.register("TradePost", ["getMouseState", function(getMouseState) {
    return TradePost;

    function TradePost(name, x, y) {
        this.draw = draw;

        this.name = name;

        const size = 24;
        const fillStyle = "#44aa55";
        const pressedFillStyle = "#55cc66";
        let state = {};

        function draw(context, selectedTrader) {
            context.beginPath();
            context.rect(x - size / 2, y - size / 2, size, size);
            context.fillStyle = fillStyle;
            

            state = getMouseState(context, state);

            let stroke = false;
            if (selectedTrader) {
                if (!state.idle) {
                    context.strokeStyle = "#000";
                    stroke = true;
                }
                if (state.pressed) {
                    context.fillStyle = pressedFillStyle;
                }
                if (state.clicked) {
                    console.log("idk");
                }
            }

            context.fill();
            if (stroke) {
                context.stroke();
            }
            context.font = "14px sans-serif";
            context.fillStyle = "#444";
            const measure = context.measureText(this.name);
            context.fillText(this.name, x - measure.width / 2, y + size + 2);
        }

        function deposit() {
            
        }

        function withdraw() {
            
        }


    }
}]);
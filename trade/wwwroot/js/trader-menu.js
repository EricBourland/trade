app.register("TraderMenu", [function() {
    return TraderMenu;

    function TraderMenu(x, y) {
        this.draw = draw;
        this.click = click;

        this.x = x;
        this.y = y;

        const buttons = [];
        const height = 20;

        let _click = () => {};

        function draw(context, selected) {
            let y = this.y;
            for (let trader of app.traders) {
                const summary = trader.summary();
                const percent = Math.round(100 * summary.capacity);
                const s = summary.name + " " + percent + "%";

                drawButton(context, trader, selected);

                context.fillStyle = summary.fillStyle;
                context.beginPath();
                context.arc(x + 10, y - 8, 8, 0, Math.PI * 2);
                context.fill();

                context.fillStyle = "#444";
                context.fillText(s, x + 20, y - 1);
                
                y += height;
            }
        }

        function drawButton(context, trader, selected) {
            const button = getButton(trader);

            context.beginPath();
            context.rect(x, y - height + 2, 170, height);
            if (context.isPointInPath(app.mouse.offsetX, app.mouse.offsetY)){
                if (app.mouse.down){
                    if (button.hovering){
                        button.hovering = false;
                        button.pressed = true;
                    }
                }
                else {
                    button.hovering = true;
                    if (button.pressed){
                        _click(trader);
                        button.pressed = false;
                    }
                }
            }
            else {
                button.hovering = false;
                button.pressed = false;
            }

            let fillStyle = null;
            if (button.hovering || trader === selected){
                fillStyle = "#eee";
            }
            if (button.pressed){
                fillStyle = "#ddd";
            }
            if (fillStyle !== null){
                context.fillStyle = fillStyle;
                context.fill();
            }
        }

        function getButton(trader){
            let button = buttons.find(b => b.trader === trader);
            if (button === undefined) {
                button = {trader: trader, button: {}};
                buttons.push(button);
            }
            return button.button;
        }

        function click(callback){
            _click = callback;
            return this;
        }
    }
}]);
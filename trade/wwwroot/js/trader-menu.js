app.register("TraderMenu", ["ButtonCollection", function(ButtonCollection) {
    return TraderMenu;

    function TraderMenu(x, y) {
        this.draw = draw;
        this.click = click;

        this.x = x;
        this.y = y;

        const buttons = new ButtonCollection().click(function(trader){
            _click(trader);
        });
        
        const height = 20;

        let _click = () => {};

        function draw(context, selected) {
            let y = this.y;
            for (let trader of app.traders) {
                const summary = trader.summary();
                const percent = Math.round(100 * summary.capacity) + "%";

                drawButton(context, trader, selected);
                
                context.fillStyle = summary.fillStyle;
                context.beginPath();
                context.arc(x + 10, y - 8, 8, 0, Math.PI * 2);
                context.fill();

                context.fillStyle = "#444";
                context.fillText(summary.name, x + 20, y - 1);
                const measure = context.measureText(percent);
                context.fillText(percent, x + 170 - measure.width - 5, y - 1);
                
                y += height;
            }
        }

        function drawButton(context, trader, selected) {
            const button = buttons.get(trader);
            button.x = x;
            button.y = y - height + 2;
            button.width = 170;
            button.height = height;
            button.styles.fillStyle = null;
            if (trader === selected){
                button.styles.fillStyle = "#eee";
            }
            button.draw(context);
        }
        
        function click(callback){
            _click = callback;
            return this;
        }
    }
}]);
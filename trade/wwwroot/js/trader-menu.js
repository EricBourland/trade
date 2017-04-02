app.register("TraderMenu", ["ButtonCollection", function(ButtonCollection) {
    return TraderMenu;

    function TraderMenu(traders) {
        const menu = this;
        this.draw = draw;
        this.click = click;

        this.x = 0;
        this.y = 0;
        this.width = 0;

        const buttons = new ButtonCollection().click(function(trader){
            _click(trader);
        });
        
        const height = 20;

        let _click = () => {};

        function draw(context, selected) {
            let y = this.y + height;
            for (let trader of app.traders) {
                const summary = trader.summary();
                const weight = summary.weight + "/" + trader.maxWeight + " (" + Math.round(100 * summary.capacity) + "%)";

                drawButton(context, trader, selected);
                
                context.fillStyle = summary.fillStyle;
                context.beginPath();
                context.arc(this.x + 10, y - 8, 8, 0, Math.PI * 2);
                context.fill();

                context.fillStyle = "#444";
                context.fillText(summary.name, this.x + 20, y - 1);
                const measure = context.measureText(weight);
                context.fillText(weight, this.x + this.width - measure.width - 5, y - 1);
                
                y += height;
            }
        }

        function drawButton(context, trader, selected) {
            const button = buttons.get(trader);
            button.x = menu.x;
            button.y = menu.y + 2;
            button.width = menu.width;
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
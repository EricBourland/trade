app.register("RouteMenu", ["ButtonCollection", function(ButtonCollection) {
    return RouteMenu;

    function RouteMenu(x, y, trader) {
        this.draw = draw;
        this.click = click;

        this.x = x;
        this.y = y;


        let _click = () => { };

        const height = 20;
        const buttons = new ButtonCollection().click((shop, transaction) => {
            _click(shop, transaction);
        });
        
        function draw(context, selectedShop) {
            this.height = 20;
            context.font = "18px sans-serif";
            context.fillText("Route", this.x, this.y);
            
            const summary = trader.summary();

            let _y = this.y + 20;
            for (let stop of summary.stops) {
                const button = buttons.get(stop.shop, stop);
                button.x = x;
                button.y = _y - height + 5;
                button.width = 150;
                button.height = height - 1;
                button.styles.fillStyle = null;
                if (stop.shop === selectedShop){
                    button.styles.fillStyle = "#eee";
                }
                button.draw(context);

                context.font = "14px sans-serif";
                context.fillStyle = "#444";
                context.fillText(stop.name, x + 5, _y);

                _y += height;
                this.height += height;
            }
        }

        function click(callback){
            _click = callback;
            return this;
        }
    }
}]);
app.register("RouteMenu", ["ButtonCollection", function(ButtonCollection) {
    return RouteMenu;

    function RouteMenu(trader) {
        this.draw = draw;
        this.selectStop = selectStop;
        this.removeStop = removeStop;

        this.x = 0;
        this.y = 0;
        this.width = 0;
        
        let _selectStop = () => { };
        let _removeStop = () => { };

        const height = 20;
        const buttons = new ButtonCollection().click((shop, transaction) => {
            _selectStop(shop, transaction);
        });

        const removeButtons = new ButtonCollection().click(shop => {
            _removeStop(shop)
        });
        
        function draw(context, selectedShop) {
            this.height = 20;
            context.font = "18px sans-serif";
            context.fillText("Route", this.x, this.y + height);
            
            const summary = trader.summary();

            let _y = this.y + 2 * height;
            for (let stop of summary.stops) {
                const button = buttons.get(stop.shop, stop);
                button.x = this.x;
                button.y = _y - height + 5;
                button.width = this.width - 25;
                button.height = height - 1;
                button.styles.fillStyle = null;
                
                const removeButton = removeButtons.get(stop.shop);
                
                removeButton.width = 20;
                removeButton.x = this.x + this.width - removeButton.width;
                removeButton.y = _y - height + 5;
                removeButton.height = height - 1;
                removeButton.text = "X";
                removeButton.show = rb => 
                    !rb.state.idle || stop.shop === selectedShop || button.state.hovering;

                removeButton.draw(context);

                if (stop.shop === selectedShop || !removeButton.state.idle){
                    button.styles.fillStyle = "#eee";
                }
                button.draw(context);
                
                context.font = "14px sans-serif";
                context.fillStyle = "#444";
                context.fillText(stop.name, this.x + 5, _y);

                _y += height;
                this.height += height;
            }
        }

        function selectStop(callback){
            _selectStop = callback;
            return this;
        }

        function removeStop(callback){
            _removeStop = callback;
            return this;
        }
    }
}]);
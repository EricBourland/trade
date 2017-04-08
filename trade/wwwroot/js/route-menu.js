app.register("RouteMenu", ["Button", "ButtonCollection", function(Button, ButtonCollection) {
    return RouteMenu;

    function RouteMenu(trader) {
        this.draw = draw;
        this.selectStop = selectStop;
        this.addStop = addStop;
        this.removeStop = removeStop;

        this.x = 0;
        this.y = 0;
        this.width = 0;
        
        let _selectStop = () => { };
        let _removeStop = () => { };
        let _addStop = () => { };

        const height = 20;
        const buttons = new ButtonCollection().click((shop, transaction) => {
            _selectStop(shop, transaction);
        });

        const removeButtons = new ButtonCollection().click(shop => {
            _removeStop(shop);
        });

        const addButton = new Button(null, 0, 0, 0, height - 1, {
            fontStyle: "italic",
            alignment: "left"
        }).click(() => {
            _addStop();
        });

        addButton.textOffset = 5;

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
                button.styles.strokeStyle = null;
                if (summary.nextStop && summary.nextStop.shop === stop.shop){
                    button.styles.strokeStyle = "#ddd";
                }
                if (summary.currentStop && summary.currentStop.shop === stop.shop){
                    button.styles.strokeStyle = "#ffd54f";
                }
                if (summary.destination && summary.destination.shop === stop.shop){
                    button.styles.strokeStyle = "#88cc88";
                }
                
                const removeButton = removeButtons.get(stop.shop);
                
                removeButton.width = 20;
                removeButton.x = this.x + this.width - removeButton.width;
                removeButton.y = _y - height + 5;
                removeButton.height = height - 1;
                removeButton.text = "X";
                removeButton.show = rb => !rb.state.idle || stop.shop === selectedShop || button.state.hovering;

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

            if (selectedShop && !summary.stops.some(s => s.shop === selectedShop)) {
                addButton.x = this.x;
                addButton.y = _y - height + 6;
                addButton.width = this.width;
                addButton.text = `Add ${selectedShop.name}...`;
                addButton.draw(context);
            }
        }

        function selectStop(callback) {
            _selectStop = callback;
            return this;
        }

        function addStop(callback) {
            _addStop = callback;
            return this;
        }

        function removeStop(callback){
            _removeStop = callback;
            return this;
        }
    }
}]);
app.register("TradePost", ["Location", "Inventory", "Deposit", "getMouseState", function(Location, Inventory, Deposit, getMouseState) {
    return TradePost;

    function TradePost(name, x, y) {
        this.draw = draw;
        this.directions = directions;
        this.available = available;
        this.snapshot = snapshot;
        this.newTrade = newTrade;
        this.accept = accept;
        this.table = table;

        this.name = name;
        this.x = x;
        this.y = y;
        
        const size = 24;
        const fillStyle = "#44aa55";
        const pressedFillStyle = "#55cc66";
        const location = new Location(x, y);
        const inventory = new Inventory();
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
                    selectedTrader.addStop(this);
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

        function directions(tx, ty){
            return location.directions(tx, ty);
        }

        function available() {
            return inventory.available();
        }

        function snapshot() {
            return {
                inventory: inventory.snapshot()
            };
        }

        function newTrade() {
            return new Deposit();
        }

        function accept(receipt){
            inventory.copy(receipt.inventory);
        }

        function table(){
            return [
                {
                    title: "Product",
                    value: p => p.product.name
                }, {
                    title: "Weight",
                    value: p => p.product.weight * p.quantity + " (" + p.product.weight + ")"
                }, {
                    title: "Quantity",
                    value: "quantity"
                }
            ];
        }
    }
}]);
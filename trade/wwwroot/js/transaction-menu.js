app.register("TransactionMenu", ["ButtonCollection", "Button", "Purchase", function(ButtonCollection, Button, Purchase) {
    return TransactionMenu;

    function TransactionMenu(x, y, _stop) {
        this.draw = draw;
        this.click = click;

        this.x = x;
        this.y = y;
        const height = 20;
        const buttons = new ButtonCollection().click(transaction => {
            _click(transaction);
        });
        const addButton = new Button("Add", x + 130, y - 15, 60, 20, {
            fillStyle: "#eee",
            hoverFillStyle: "#ddd",
            pressFillStyle: "#ccc"
        }).click(() => {
            addTrade();
            _click();
        });

        let _click = () => {};
        
        function draw(context, selectedTrade) {    
            context.save();
            context.font = "18px sans-serif";
            context.fillText("Transactions", this.x, this.y);
            context.restore();
            
            let _y = this.y + 20;
            for (let trade of _stop.transaction.trades) {

                const button = buttons.get(trade);
                button.x = this.x; 
                button.y = _y - height + 5;
                button.width = 150;
                button.height = height - 1;
                button.styles.fillStyle = null;
                if (trade === selectedTrade) {
                    button.styles.fillStyle = "#eee";
                }
                button.draw(context);
                
                const summary = trade.summary(_stop.shop);
                context.fillStyle = "#444";
                context.fillText(summary.verb + " " + summary.name + " for " + summary.price + "b", this.x + 5, _y);
                
                _y += height;
            }

            //addButton.draw(context);
        }

        function addTrade(){
            console.log(_stop.transaction);
            console.log(_stop.shop.listing());
            //_stop.transaction.addTrade(new Purchase());
        }

        function click(callback){
            _click = callback;
            return this;
        }
    }
}]);
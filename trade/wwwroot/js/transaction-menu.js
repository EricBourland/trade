app.register("TransactionMenu", ["ButtonCollection", "Button", "Purchase", function(ButtonCollection, Button, Purchase) {
    return TransactionMenu;

    function TransactionMenu(_stop) {
        this.draw = draw;
        this.selectTrade = selectTrade;
        this.removeTrade = removeTrade;

        this.x = 0;
        this.y = 0;
        this.width = 0;
        
        let _selectTrade = () => {};
        let _removeTrade = () => {};

        const height = 20;
        const buttons = new ButtonCollection().click(trade => {
            _selectTrade(trade);
        });

        const removeButtons = new ButtonCollection().click(trade => {
            _removeTrade(trade);
        })
        
        const addButton = new Button("Add Transaction...").click(() => {
            addTrade();
        });
        addButton.textOffset = 5;
        addButton.styles.alignment = "left";
        addButton.styles.fontStyle = "italic";

        function draw(context, selectedTrade) {    
            context.save();
            context.font = "18px sans-serif";
            context.fillText("Transactions", this.x, this.y + height);
            context.restore();
            
            this.height = 20;

            let _y = this.y + 2 * height;
            for (let trade of _stop.transaction.trades) {

                const button = buttons.get(trade);
                button.x = this.x; 
                button.y = _y - height + 5;
                button.width = this.width - 25;
                button.height = height - 1;
                button.styles.fillStyle = null;

                const removeButton = removeButtons.get(trade);
                removeButton.width = 20;
                removeButton.height = height - 1;
                removeButton.x = this.x + this.width - removeButton.width;
                removeButton.y = _y - height + 5;
                removeButton.text = "X";
                removeButton.show = rb => !rb.state.idle || button.state.hovering;
                removeButton.draw(context);

                if (trade === selectedTrade || !removeButton.state.idle) {
                    button.styles.fillStyle = "#eee";
                }
                button.draw(context);
                
                const summary = trade.summary(_stop.shop);
                context.fillStyle = "#444";
                context.fillText(summary.verb + " " + summary.name + " for " + summary.price + "b", this.x + 5, _y);
                
                _y += height;
                this.height += height;
            }

            addButton.x = this.x;
            addButton.y = _y - 15;
            addButton.width = this.width - 25;
            addButton.height = 19;
            addButton.draw(context);
        }

        function addTrade(){
            _stop.transaction.addTrade(new Purchase(_stop.shop.getPurchaseProduct()));
        }

        function selectTrade(callback){
            _selectTrade = callback;
            return this;
        }

        function removeTrade(callback) {
            _removeTrade = callback;
            return this;
        }
        
    }
}]);
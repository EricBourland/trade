app.register("TransactionMenu", ["Button", function(Button) {
    return TransactionMenu;

    function TransactionMenu(x, y, trades) {
        this.draw = draw;

        this.x = x;
        this.y = y;

        const addButton = new Button("Add", 420, 40, 60, 20).click(() => console.log("idk"));
        const height = 20;
        
        function draw(context) {    
            context.save();
            context.font = "18px sans-serif";
            context.fillText("Transactions", this.x, this.y);
            context.restore();
            
            let _y = this.y + 20;
            for (let trade of trades) {
                context.fillText(trade.verb + " " + trade.name + " for " + trade.price + "b", this.x, _y);
                _y += height;
            }

            drawAddButton(context, _y);
        }

        function drawAddButton(context, y) {
            addButton.y = y;
            addButton.draw(context);
        }
    }
}]);
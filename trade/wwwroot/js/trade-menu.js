app.register("TradeMenu", ["Button", "ButtonCollection", "Purchase", "Sale", function(Button, ButtonCollection, Purchase, Sale) {
    return TradeMenu;
    
    function TradeMenu(x, y, trader, shop, transaction, trade) {
        this.draw = draw;
        this.click = click;
        this.setTrade = setTrade;

        this.x = x;
        this.y = y;

        const buttons = new ButtonCollection().click(product => {
            _click();
            trade.product = product;
        });
        const buyButton  = new Button("Buy", x, y + 5, 35, 19).click(buy);
        buyButton.textOffset = 3;
        
        const sellButton = new Button("Sell", x + 45, y + 5, 35, 19).click(sell);
        const removeButton = new Button("Remove", x + 90, y + 5, 60, 19).click(remove);

        let sale = false;
        let purchase = false;

        if (trade instanceof Purchase){
            purchase = true;
            buyButton.styles.fillStyle = "#eee";
        }

        if (trade instanceof Sale){
            sale = true;
            sellButton.styles.fillStyle = "#eee";
        }

        let _click = () => {};
        let _setTrade = () => {};

        function draw(context) {
            context.font = "18px sans-serif";
            context.fillText("Trade", this.x, this.y);

            buyButton.draw(context);
            sellButton.draw(context);
            removeButton.draw(context);
            
            let products = [];
            if (sale) {
                products = shop.listing();
            } 
            else if (purchase) {
                products = trader.cargo();
            }

            context.font = "14px sans-serif";
            let _y = this.y + 40;
            for (let product of products){
                const button = buttons.get(product.product);
                button.x = this.x;
                button.y = _y - 15;
                button.width = 150;
                button.height = 19;
                button.styles.fillStyle = null;
                if (product.product === trade.product){
                    button.styles.fillStyle = "#eee";
                }
                button.draw(context);
                
                context.fillStyle = "#444";
                context.fillText(product.product.name, this.x + 5, _y);
                _y += 20;
            }
        }

        function click(callback){
            _click = callback;
            return this;
        }

        function setTrade(callback){
            _setTrade = callback;
            return this;
        }

        function buy(){
            _click();
            if (trade instanceof Purchase){
                return;
            }
            const product = shop.getPurchaseProduct();
            const purchase = new Purchase(product);
            transaction.remove(trade);
            transaction.addTrade(purchase);
            _setTrade(purchase);
        }

        function sell() {
            _click();
            if (trade instanceof Sale){
                return;
            }
            const product = shop.getSaleProduct();
            const sale = new Sale(product);
            transaction.remove(trade);
            transaction.addTrade(sale);
            _setTrade(sale);
        }

        function remove(){
            _click();
            transaction.remove(trade);
            _setTrade(null);
        }
    }
}]);
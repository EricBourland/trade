app.register("TradeMenu", ["Button", "ButtonCollection", "Purchase", "Sale", function(Button, ButtonCollection, Purchase, Sale) {
    return TradeMenu;
    
    function TradeMenu(trader, shop, transaction, trade) {
        this.draw = draw;
        this.setTrade = setTrade;

        this.x = 0;
        this.y = 0;

        const lineHeight = 20;
        
        let _setTrade = () => { };

        const buttons = new ButtonCollection().click(product => {
            trade.product = product;
        });
        const buyButton = new Button("Buy", 0, 0, 35, 19).click(buy);
        const sellButton = new Button("Sell", 0, 0, 35, 19).click(sell);

        const actions = [buyButton, sellButton];

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
        
        function draw(context) {
            context.font = "18px sans-serif";
            context.fillText("Trade", this.x, this.y + lineHeight);
            
            let offsetX = this.x;
            for (let action of actions){
                action.x = offsetX;
                action.y = this.y + lineHeight + 5;
                action.draw(context);
                offsetX += 45;
            }
            
            let products = [];
            if (sale) {
                products = shop.listing();
            } 
            else if (purchase) {
                products = shop.selling();
            }

            context.font = "14px sans-serif";
            let _y = this.y + 3 * lineHeight;
            for (let product of products){
                const button = buttons.get(product.product);
                button.x = this.x;
                button.y = _y - 15;
                button.width = this.width;
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

        function setTrade(callback){
            _setTrade = callback;
            return this;
        }

        function buy(){
            if (trade instanceof Purchase){
                return;
            }
            const product = shop.getPurchaseProduct();
            const purchase = new Purchase(product);
            transaction.swap(trade, purchase);
            _setTrade(purchase);
        }

        function sell() {
            if (trade instanceof Sale){
                return;
            }
            const product = shop.getSaleProduct();
            const sale = new Sale(product);
            transaction.swap(trade, sale);
            _setTrade(sale);
        }
    }
}]);
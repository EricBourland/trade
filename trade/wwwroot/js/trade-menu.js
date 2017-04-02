app.register("TradeMenu", ["Button", "ButtonCollection", "Shop", "Purchase", "Sale", "Deposit", "Withdrawal", function(Button, ButtonCollection, Shop, Purchase, Sale, Deposit, Withdrawal) {
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
        
        const actions = [];
        if (shop instanceof Shop) {
            actions.push(new Button("Buy").click(buy));
            actions.push(new Button("Sell").click(sell));
        } else {
            actions.push(new Button("Deposit").click(deposit));
            actions.push(new Button("Withdraw").click(withdraw));
        }

        for (let action of actions){
            action.height = 19;
            if (trade.verb === action.text){
                action.styles.fillStyle = "#eee";
            }
        }
        
        function draw(context) {
            context.font = "18px sans-serif";
            context.fillText("Trade", this.x, this.y + lineHeight);
            
            let offsetX = this.x;
            for (let action of actions){
                action.x = offsetX;
                action.y = this.y + lineHeight + 5;
                action.draw(context);
                offsetX += action.width + 10;
            }
            
            let products = trade.getProducts(trader, shop);

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

        function deposit() {
            if (trade instanceof Deposit){
                return;
            }
            const _deposit = new Deposit();
            transaction.swap(trade, _deposit);
            _setTrade(_deposit);
        }

        function withdraw(){
            if (trade instanceof Withdrawal){
                return;
            }
            const withdrawal = new Withdrawal();
            transaction.swap(trade, withdrawal);
            _setTrade(withdrawal);
        }
    }
}]);
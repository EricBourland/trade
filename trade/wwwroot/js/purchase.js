(function(app) {
    app.Purchase = Purchase;

    function Purchase(product) {
        const purchase = this;
        this.calculate = calculate;
        this.apply = apply;
        this.adjust = adjust;
        this.summary = summary;

        this.product = product;

        function calculate(trader, shop){
            const supply = shop.supply(this.product);
            const quantity = supply.quantity;

            return {
                weight: this.product.weight * quantity,
                total: supply.price * quantity,
                price: supply.price,
                quantity: quantity,
                success: quantity > 0
            };
        }

        function apply(trader, shop, deal, state) {
            const balance = deal.price * deal.quantity;
            state.shop.bits += balance;
            state.shop.inventory.subtract(this.product, deal.quantity);
            state.trader.bits -= balance;
            state.trader.weight += deal.weight;
            state.trader.inventory.add(this.product, deal.quantity);
        }

        function adjust(trader, shop, deal, state) {
            if (state.trader.bits < 0) {
                const fix = Math.ceil(-(state.trader.bits / deal.price));
                if (fix <= deal.quantity){
                    alter(deal, fix, state);
                }
            }

            if (state.trader.weight > trader.maxWeight){
                const fix = Math.ceil((state.trader.weight - trader.maxWeight) / this.product.weight);
                if (fix <= deal.quantity){
                    alter(deal, fix, state);
                }
            }
        }

        function alter(deal, fix, state){
            const balance = fix * deal.price;
            const weightBalance = fix * purchase.product.weight;
            deal.quantity -= fix;
            deal.total -= balance;
            deal.weight -= weightBalance;
            state.shop.bits -= balance;
            state.shop.inventory.add(purchase.product, fix);
            state.trader.bits += balance;
            state.trader.weight -= weightBalance; 
            state.trader.inventory.subtract(purchase.product, fix);
        }

        function summary(shop){
            const prices = shop.prices(this.product);
            return {
                verb: "Buy",
                name: this.product.name,
                price: prices.buy || prices.sell
            };
        }
    }
})(app);

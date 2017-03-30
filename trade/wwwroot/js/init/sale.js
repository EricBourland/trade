app.register("Sale", [function() {
    
    return Sale;
    
    function Sale(product) {
        this.calculate = calculate;
        this.apply = apply;
        this.adjust = adjust;
        this.summary = summary;

        function calculate(trader, shop) {
            const quantity = trader.supply(product);
            const price = shop.orders[product.id].price;
            
            return {
                weight: product.weight * quantity,
                total: price * quantity,
                price: price,
                quantity: quantity,
                success: quantity > 0,
            };
        }

        function apply(trader, shop, deal, state) {
            const balance = deal.price * deal.quantity;
            state.shop.bits -= balance;
            state.shop.inventory.add(product, deal.quantity);
            state.trader.bits += balance;
            state.trader.weight -= deal.weight;
            state.trader.inventory.subtract(product, deal.quantity);
        }

        function adjust(trader, shop, deal, state) {
            if (state.shop.bits < 0) {
                const fix = Math.ceil(-(state.shop.bits / deal.price));
                if (fix <= deal.quantity){
                    alter(deal, fix, state);
                }
            }
        }

        function alter(deal, fix, state){
            const balance = fix * deal.price;
            const weightBalance = fix * product.weight;
            deal.quantity -= fix;
            deal.total -= balance;
            deal.weight -= weightBalance;
            state.shop.bits += balance;
            state.shop.inventory.subtract(product, fix);
            state.trader.bits -= balance;
            state.trader.weight += weightBalance; 
            state.trader.inventory.add(product, fix);
        }

        function summary(shop){
            return {
                verb: "Sell",
                name: product.name,
                price: shop.prices(product).sell
            };
        }
    }
}]);
app.register("Sale", [function() {
    
    return Sale;
    
    function Sale(product) {
        const sale = this;
        this.calculate = calculate;
        this.apply = apply;
        this.adjust = adjust;
        this.summary = summary;
        this.getProducts = getProducts;

        this.product = product;
        this.verb = "Sell";

        function calculate(trader, shop) {
            const quantity = trader.supply(this.product);
            const prices = shop.prices(this.product);
            const price = prices.sell || prices.buy;
            
            return {
                weight: this.product.weight * quantity,
                total: price * quantity,
                price: price,
                quantity: quantity,
                success: quantity > 0,
            };
        }

        function apply(trader, shop, deal, state) {
            const balance = deal.price * deal.quantity;
            state.shop.bits -= balance;
            state.shop.inventory.add(this.product, deal.quantity, deal.price);
            state.trader.bits += balance;
            state.trader.weight -= deal.weight;
            state.trader.inventory.subtract(this.product, deal.quantity);
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
            const weightBalance = fix * sale.product.weight;
            deal.quantity -= fix;
            deal.total -= balance;
            deal.weight -= weightBalance;
            state.shop.bits += balance;
            state.shop.inventory.subtract(sale.product, fix);
            state.trader.bits -= balance;
            state.trader.weight += weightBalance; 
            state.trader.inventory.add(sale.product, fix);
        }

        function summary(shop){
            const prices = shop.prices(this.product);
            const price = prices.sell || prices.buy;
            const name = this.product.name;
            return {
                verb: this.verb,
                name: name,
                price: price,
                description: this.verb + " " + name + " for " + price + "b"
            };
        }

        function getProducts(trader, shop){
            return shop.listing();
        }
    }
}]);
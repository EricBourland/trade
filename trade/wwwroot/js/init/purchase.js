(function(app) {
    app.Purchase = Purchase;

    function Purchase(product) {
        this.apply = apply;
        this.negotiate = negotiate;

        function negotiate(trader, shop, balance){
            const supply = shop.supply(product);
            const demand = trader.demand(supply, balance);
            const quantity = Math.min(supply.quantity, demand);

            return {
                weight: product.weight * quantity,
                total: supply.price * quantity,
                quantity: quantity,
                success: quantity > 0
            };
        }

        function apply(trader, shop, deal) {
            trader.buy(shop.sell(product, deal.quantity));
        }
    }
})(app);

app.register("Sale", [function() {
    
    return Sale;
    
    function Sale(product) {
        this.apply = apply;
        this.negotiate = negotiate;

        function negotiate(trader, shop, balance) {
            const demand = shop.demand(product, balance);
            const supply = trader.supply(product);
            
            const quantity = Math.min(supply, demand.quantity);

            return {
                weight: product.weight * quantity,
                total: demand.price * quantity,
                price: demand.price,
                quantity: quantity,
                success: quantity > 0
            };
        }

        function apply(trader, shop, deal) {
            shop.buy(trader.sell(product, deal.quantity, deal.price));
        }
    }
}]);
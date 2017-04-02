app.register("Deposit", function() {
    return Deposit;

    function Deposit() {
        this.summary = summary;
        this.calculate = calculate;
        this.apply = apply;
        this.getProducts = getProducts;

        this.verb = "Deposit";

        function calculate(trader, shop) {
            let quantity = 0, weight = 0;
            if (this.product){
                quantity = trader.supply(this.product);
                weight = this.product.weight * quantity;
            }
            
            return {
                weight: weight,
                total: 0,
                price: 0,
                quantity: quantity,
                success: quantity > 0,
            };
        }

        function apply(trader, shop, deal, state) {
            state.shop.inventory.add(this.product, deal.quantity);
            state.trader.weight -= deal.weight;
            state.trader.inventory.subtract(this.product, deal.quantity);
        }

        function summary(){
            let name = "...";
            if (this.product){
                name = this.product.name;
            }
            return {
                verb: this.verb,
                name: name,
                description: this.verb + " " + name
            };
        }

        function getProducts(trader) {
            return trader.cargo();
        }
    }
});
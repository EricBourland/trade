app.register("Transaction", [function() {
    
    return Transaction;

    function Transaction() {
        this.addTrade = addTrade;
        this.negotiate = negotiate;
        this.commit = commit;

        const trades = [];

        function addTrade(trade) {
            trades.push(trade);
            return this;
        }

        function negotiate(shop, trader) {
            return {};
        }

        function commit(trader, shop, agreement) {
            
        }
    }
}]);
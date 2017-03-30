app.register("Transaction", [function() {
    
    return Transaction;

    function Transaction() {
        this.addTrade = addTrade;
        this.negotiate = negotiate;
        this.commit = commit;
        this.getTrades = getTrades;

        const trades = [];

        function addTrade(trade) {
            trades.push(trade);
            return this;
        }

        function negotiate(trader, shop) {
            const steps = [];
            for (let trade of trades) {
                const result = trade.calculate(trader, shop);
                if (result.success){
                    steps.push({trade: trade, result: result});
                }
            }

            const state = snapshot(trader, shop);
            for (let step of steps){
                step.trade.apply(trader, shop, step.result, state);
            }
            
            let attempts = 0;
            while (!valid(state, trader) && attempts < 3) {
                for (let step of steps){
                    step.trade.adjust(trader, shop, step.result, state);
                }
                attempts += 1;
            }

            let changed = false;
            for (let step of steps){
                if (step.result.quantity > 0) {
                    changed = true;
                }
            }

            return {
                snapshot: state,
                success: changed && valid(state, trader)
            };
        }

        function valid(state, trader) {
            return state.shop.bits >= 0 && state.trader.bits >= 0 && state.trader.weight <= trader.maxWeight;
        }

        function snapshot(trader, shop){
            return {
                trader: trader.snapshot(),
                shop: shop.snapshot()
            }
        }

        function commit(trader, shop, agreement) {
            trader.accept(agreement.snapshot.trader);
            shop.accept(agreement.snapshot.shop);
        }

        function getTrades(shop){
            return trades.map(t => t.summary(shop));
        }
    }
}]);
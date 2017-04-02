app.register("Transaction", [function() {
    
    return Transaction;

    function Transaction() {
        this.addTrade = addTrade;
        this.remove = remove;
        this.swap = swap;
        this.negotiate = negotiate;
        this.commit = commit;
        this.getTradeSummary = getTradeSummary;
        
        this.trades = [];

        function addTrade(trade) {
            this.trades.push(trade);
            return this;
        }

        function remove(trade){
            this.trades.splice(this.trades.indexOf(trade), 1);
        }

        function swap(existing, trade){
            const index = this.trades.indexOf(existing);
            this.trades[index] = trade;
        }

        function negotiate(trader, shop) {
            const steps = [];
            for (let trade of this.trades) {
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
                valid: valid(state, trader),
                changed: changed,
                empty: this.trades.length === 0,
                void: steps.length === 0
            };
        }

        function valid(state, trader) {
            return (state.shop.bits == null || state.shop.bits >= 0) && 
                state.trader.bits >= 0 && 
                state.trader.weight <= trader.maxWeight;
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

        function getTradeSummary(shop){
            return this.trades.map(t => t.summary(shop));
        }
    }
}]);
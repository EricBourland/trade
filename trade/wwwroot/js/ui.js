app.register("ui", ["TraderMenu", "CargoMenu", "RouteMenu", "ShopMenu", "TransactionMenu", "TradeMenu", function(TraderMenu, CargoMenu, RouteMenu, ShopMenu, TransactionMenu, TradeMenu) {

    return new Ui();

    function Ui () {
        this.draw = draw;
        this.selectTrader = selectTrader;
        this.selectShop = selectShop;

        const traders = new TraderMenu(app.traders).click(selectTrader);
        traders.x = 10;
        traders.y = 10;
        traders.width = 300;
        let _deselect = false;
        let cargo = null;
        let stock = null;
        let stops = null;
        let trade = null;
        let trades = null;
        let deferred = null;

        let selectedTrader = null;
        let selectedShop = null;
        let selectedTransaction = null;
        let selectedTrade = null;

        let stockWidth = 400;
        let cargoX = null;
        let cargoWidth = 400;
        
        Object.defineProperty(this, "selectedTrader", {get: () => selectedTrader});
        Object.defineProperty(this, "selectedShop", {get: () => selectedShop});

        function draw(context) {

            cargoX = context.canvas.width - cargoWidth - 10;

            context.save();
            context.font = "18px sans-serif";

            const str = app.bits + "b";
            const measure = context.measureText(str);
            context.fillText(str, context.canvas.width - measure.width - 15, 30);

            traders.draw(context, selectedTrader);

            if (selectedTrader) {
                stops.draw(context, selectedShop);
                cargo.x = cargoX;
                cargo.draw(context);
            }

            if (trades) {
                trades.draw(context, selectedTrade);
            }
            if (stock){
                stock.draw(context);
            }

            if (trade) {
                trade.draw(context);
            }

            context.restore();

            if (_deselect && !app.clicked && !app.mouse.down){
                deselect();
            }
            _deselect = app.mouse.down;
            app.clicked = null;

            if (deferred) {
                deferred();
                deferred = null;
            }
        }

        function selectShop(shop) {
            stock = new ShopMenu(shop);
            stock.x = cargoX - 10 - stockWidth;
            stock.y = 10;
            stock.width = stockWidth;
            
            selectedShop = shop;
        }

        function selectTrader(trader){
            cargo = new CargoMenu(trader);
            cargo.y = 10;
            cargo.width = 400;
            stops = new RouteMenu(trader)
                .selectStop(selectStop)
                .removeStop(removeStop);
            stops.x = traders.width + traders.x + 10;
            stops.y = 10;
            stops.width = 180;
            selectedTrader = trader;
        }

        function selectStop(shop, _stop) {
            trades = new TransactionMenu(_stop)
                .removeTrade(removeTrade)
                .selectTrade(selectTrade);
            trades.width = 180;
            trades.x = stops.x + stops.width + 10;
            trades.y = 10;
            selectShop(shop);
            selectedTransaction = _stop.transaction;
            trade = null;
            selectedTrade = null;
        }

        function removeTrade(_trade) {
            selectedTransaction.remove(_trade);
            selectedTrade = null;
            trade = null;
        }

        function selectTrade(_trade) {
            trade = new TradeMenu(selectedTrader, selectedShop, selectedTransaction, _trade)
                .setTrade(selectTrade);
            trade.x = trades.x + trades.width + 10;
            trade.y = 10;
            trade.width = 150;
            selectedTrade = _trade;
        }

        function removeStop(shop){
            selectedTrader.removeStop(shop);
            defer(function(){
                selectedShop = null;
                trades = null;
                trade = null;
                stock = null;
            });
        }

        function defer(func){
            deferred = func;
        }

        function deselect(){
            selectedTrader = null;
            selectedShop = null;
            stops = null;
            trades = null;
            trade = null;
            stock = null;
        }

    }
}]);
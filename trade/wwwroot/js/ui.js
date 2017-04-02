app.run(["TraderMenu", "CargoMenu", "RouteMenu", "ShopMenu", "TransactionMenu", "TradeMenu", function(TraderMenu, CargoMenu, RouteMenu, ShopMenu, TransactionMenu, TradeMenu) {

    const traders = new TraderMenu(app.traders).click(select);
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

    app.ui = {
        draw: draw,
        selectTrader: select
    };

    function draw(context) {

        context.save();
        context.font = "18px sans-serif";

        const str = app.bits + "b";
        const measure = context.measureText(str);
        context.fillText(str, context.canvas.width - measure.width - 15, 30);

        traders.draw(context, selectedTrader);

        if (selectedTrader) {
            stops.draw(context, selectedShop);

            cargo.x = context.canvas.width - cargo.width - 10;
            cargo.draw(context);
        }

        if (selectedShop) {
            trades.draw(context, selectedTrade);

            stock.x = cargo.x - stock.width - 30;
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

        return {
            selectedTrader: selectedTrader
        };
    }

    function select(trader){
        cargo = new CargoMenu(trader);
        cargo.y = 10;
        cargo.width = 400;
        stops = new RouteMenu(trader)
            .selectStop(selectShop)
            .removeStop(removeStop);
        stops.x = traders.width + traders.x + 10;
        stops.y = 10;
        stops.width = 180;
        selectedTrader = trader;
    }

    function selectShop(shop, _stop) {
        trades = new TransactionMenu(_stop)
            .removeTrade(removeTrade)
            .selectTrade(selectTrade);
        trades.width = 180;
        trades.x = stops.x + stops.width + 10;
        trades.y = 10;
        stock = new ShopMenu(shop);
        stock.width = 400;
        stock.y = 10;
        selectedTransaction = _stop.transaction;
        selectedShop = shop;
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
}]);
app.run(["TraderMenu", "CargoMenu", "RouteMenu", "TransactionMenu", "TradeMenu", function(TraderMenu, CargoMenu, RouteMenu, TransactionMenu, TradeMenu) {

    const traders = new TraderMenu(15, 50).click(select);
    let _deselect = false;
    let cargo = null;
    let stops = null;
    let trade = null;
    let trades = null;

    let selectedTrader = null;
    let selectedShop = null;
    let selectedTransaction = null;
    let selectedTrade = null;

    app.ui = {
        draw: function (context) {
            context.save();
            context.font = "18px sans-serif";
            
            const str = app.bits + "b";
            context.fillText(str, 10, 25);
            
            traders.draw(context, selectedTrader);

            if (selectedTrader) {
                stops.draw(context, selectedShop);
                cargo.y = stops.height + stops.y + 10;
                cargo.draw(context);                
            }

            if (trades){
                trades.draw(context, selectedTrade);
            }

            if (trade) {
                trade.draw(context);
            }
            
            context.restore();

            if (_deselect && !app.mouse.down){
                deselect();
            }
            _deselect = app.mouse.down;
        }
    };

    function select(trader){
        _deselect = false;
        cargo = new CargoMenu(200, 25, trader);
        stops = new RouteMenu(200, 25, trader).click(selectShop);
        selectedTrader = trader;
    }

    function selectShop(shop, _stop) {
        _deselect = false;
        trades = new TransactionMenu(360, 25, _stop).click(selectTrade);
        selectedTransaction = _stop.transaction;
        selectedShop = shop;
        trade = null;
        selectedTrade = null;
    }

    function selectTrade(_trade) {
        _deselect = false;
        trade = new TradeMenu(520, 25, selectedTrader, selectedShop, selectedTransaction, _trade)
            .click(() => {
                _deselect = false;
            })
            .setTrade(selectTrade);
        selectedTrade = _trade;
    }

    function deselect(){
        selectedTrader = null;
        selectedShop = null;
        stops = null;
        trades = null;
        trade = null;
    }
}]);
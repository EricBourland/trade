app.run(["TraderMenu", "RouteMenu", "TransactionMenu", function(TraderMenu, RouteMenu, TransactionMenu) {

    const traders = new TraderMenu(15, 50).click(select);
    let _deselect = false;
    let stops = null;
    let trades = null;
    let selectedTrader = null;
    let selectedShop = null;

    app.ui = {
        draw: function (context) {
            context.save();
            context.font = "18px sans-serif";
            
            const str = app.bits + "b";
            context.fillText(str, 10, 25);
            
            traders.draw(context, selectedTrader);

            if (stops) {
                stops.draw(context, selectedShop);
            }

            if (trades){
                trades.draw(context);
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
        stops = new RouteMenu(200, 25, trader).click(selectStop);
        selectedTrader = trader;
    }

    function selectStop(shop, transaction) {
        _deselect = false;
        trades = new TransactionMenu(365, 25, transaction);
        selectedShop = shop;
    }

    function deselect(){
        selectedTrader = null;
        selectedShop = null;
        stops = null;
        trades = null;
    }
}]);
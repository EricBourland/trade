app.run(["TraderMenu", "RouteMenu", function(TraderMenu, RouteMenu) {

    //const addButton = new Button("Add", 420, 40, 60, 20).click(() => console.log("idk"));

    const traders = new TraderMenu(15, 50).click(select);
    let _deselect = false;
    let routes = null;
    let selectedTrader = null;
    let selectedShop = null;

    app.ui = {
        draw: function (context) {
            context.save();
            context.font = "18px sans-serif";
            
            const str = app.bits + "b";
            context.fillText(str, 10, 25);
            
            traders.draw(context, selectedTrader);

            if (routes) {
                routes.draw(context, selectedShop);
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
        routes = new RouteMenu(200, 25, trader).click(selectShop);
        selectedTrader = trader;
    }

    function selectShop(shop){
        _deselect = false;
        selectedShop = shop;
    }

    function deselect(){
        selectedTrader = null;
        selectedShop = null;
        routes = null;
    }

    function drawTransactionMenu(context, stop){
        const x = 300;
        context.save();
        context.font = "18px sans-serif";
        context.fillText("Transactions", x, 25);
        context.restore();
        
        const h = 20;
        let y = 46;
        for (let trade of stop.trades){
            context.fillText(trade.verb + " " + trade.name + " for " + trade.price + "b", x, y);
            y += h;
        }

        drawAddButton(context, y);
    }

    function drawAddButton(context, y) {
        //addButton.y = y;
        //addButton.draw(context);
    }
}]);
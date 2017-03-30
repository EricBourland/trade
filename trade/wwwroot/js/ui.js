app.run(["TraderMenu", "RouteMenu", function(TraderMenu, RouteMenu) {

    //const addButton = new Button("Add", 420, 40, 60, 20).click(() => console.log("idk"));

    const traders = new TraderMenu(15, 50).click(select);
    let routes = new RouteMenu(200, 25);
    let deselect = false;

    app.ui = {
        draw: function (context) {
            context.save();
            context.font = "18px sans-serif";
            
            const str = app.bits + "b";
            context.fillText(str, 10, 25);
            
            const selected = app.ui.selected;
            traders.draw(context, selected);

            if (selected){
                drawRouteMenu(context, selected.summary());
            }
            
            context.restore();

            if (deselect && !app.mouse.down){
                app.ui.selected = null;
            }
            deselect = app.mouse.down;
        }
    };

    function select(trader){
        deselect = false;
        app.ui.selected = trader;

    }

    function drawRouteMenu(context, trader){
        const x = 200;
        context.fillText("Route", x, 25);
        context.font = "14px sans-serif";
        const h = 20;
        let y = 46;
        for (let stp of trader.stops) {
            context.fillText(stp.name, x, y);
            y += h;
        }

        const selected = trader.stops[0];
        drawTransactionMenu(context, selected);
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
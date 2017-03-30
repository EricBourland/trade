(function(app) {
    app.ui = {
        draw: function (context) {
            context.save();
            context.font = "18px sans-serif";
            
            const str = app.bits + "b";
            context.fillText(str, 10, 25);
            
            const h = 16;
            let y = 50;
            for (let trader of app.traders) {
                const summary = trader.summary();
                const percent = Math.round(100 * summary.capacity);
                const s = summary.name + " " + percent + "%";
                
                context.fillStyle = summary.fillStyle;
                context.beginPath();
                context.arc(15, y - 6, 8, 0, Math.PI*2);
                context.fill();

                context.fillStyle = "#444";
                context.fillText(s, 25, y);
                y += h;
            }

            const selected = app.traders[0].summary();
            drawRouteMenu(context, selected);

            context.restore();
        }
    };

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
    }
})(app);
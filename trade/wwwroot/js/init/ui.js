(function(app) {
    app.ui = {
        draw: function (context) {
            context.save();
            context.font = "18px sans-serif";
            context.fillStyle = "#444";
            const str = app.bits + "b";
            context.fillText(str, 10, 25);
            
            const h = 16;
            let y = 50;
            for (let trader of app.traders) {
                const summary = trader.summary();
                const percent = Math.round(100 * summary.capacity);
                const s = summary.name + " " + percent + "%";

                context.fillText(s, 15, y);
                y += h;
            }

            context.restore();
        }
    };
})(app);
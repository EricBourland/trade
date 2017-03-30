(function(app) {
    app.update = update;
    
    function update(dt) {
        for (let shop of app.shops) {
            shop.update(dt);
        }

        for (let trader of app.traders){
            trader.update(dt);
        }
    }
})(app);
(function(app) {
    const canvas = document.getElementById("trade");
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;
    const context = canvas.getContext("2d");

    app.draw = draw;

    function draw() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        
        context.save();
        context.translate(app.camera.x, app.camera.y);

        for (let shop of app.shops) {
            shop.draw(context);
        }

        for (let trader of app.traders) {
            trader.draw(context);
        }

        context.restore();
        app.ui.draw(context);
    }

})(app);
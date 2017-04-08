app.register("draw", ["camera", "ui", "posts", "shops", "traders", function(camera, ui, posts, shops, traders) {
    const canvas = document.getElementById("trade");
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;
    const context = canvas.getContext("2d");

    window.onresize = function(){
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;
    };

    return draw;

    function draw() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        
        context.save();
        context.translate(camera.x, camera.y);

        for (let post of posts) {
            post.draw(context);
        }

        for (let shop of shops) {
            shop.draw(context, ui.selectedShop);
        }

        for (let trader of traders) {
            trader.draw(context, ui.selectedTrader);
        }

        context.restore();
        ui.draw(context);
    }

}]);
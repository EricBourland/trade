app.register("update", ["posts", "shops", "traders", "ui", function(posts, shops, traders, ui) {
    return update;

    function update(dt) {

        for (let post of app.posts) {
            post.update(dt, ui);
        }

        for (let shop of app.shops) {
            shop.update(dt, ui);
        }

        for (let trader of app.traders) {
            trader.update(dt, ui);
        }

    }
}]);
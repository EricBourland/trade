app.run(["Shop", "Trader", "TradePost", function(Shop, Trader, TradePost) {

    const shops = [];
    const traders = [];
    const posts = [];

    shops.push(new Shop(125, 70, "The Bob Factory", 10));
    shops.push(new Shop(645, 160, "Nick's Knacks", 20));

    shops[0].stock(app.products[0], 2, 5, 20);
    shops[0].order(app.products[1], 5, 1, 6);
    shops[1].stock(app.products[1], 3, 15, 60);
    shops[1].order(app.products[0], 3, 1, 3);

    traders.push(new Trader(94, 175, "TR-995"));

    posts.push(new TradePost("Jack's Junkyard", 350, 285));

    app.shops = shops;
    app.traders = traders;
    app.posts = posts;

}]);
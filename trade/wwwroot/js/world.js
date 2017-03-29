app.run(["Shop", "Trader", "Purchase", "Sale", function(Shop, Trader, Purchase, Sale) {

    const shops = [];
    const traders = [];

    shops.push(new Shop(125, 70, "Bob Factory", 10));
    shops.push(new Shop(645, 160, "Nick's Knacks", 20));

    shops[0].stock(app.products[0], 2, 5, 20);
    shops[0].order(app.products[1], 2);
    shops[1].stock(app.products[1], 1, 15, 60);
    shops[1].order(app.products[0], 3);

    traders.push(new Trader(100, 50, "TR-995"));

    app.shops = shops;
    app.traders = traders;

    let stop = traders[0].addStop(shops[0]);
    stop.transaction
        .addTrade(new Purchase(app.products[0]))
        .addTrade(new Sale(app.products[1]));

    stop = traders[0].addStop(shops[1]);
    stop.transaction
        .addTrade(new Purchase(app.products[1]))
        .addTrade(new Sale(app.products[0]));

}]);
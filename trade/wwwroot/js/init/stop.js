app.register("Stop", ["Transaction", function(Transaction) {

    return Stop;

    function Stop(shop) {
        this.shop = shop;
        this.transaction = new Transaction();
    }
}]);
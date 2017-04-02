app.register("ShopMenu", ["Table", function(Table) {
    return ShopMenu;

    function ShopMenu(shop) {
        this.draw = draw;
        
        this.x = 0;
        this.y = 0;
        this.width = 0;
        this.height = 0;

        const lineHeight = 20;
        const table = new Table([
            {
                title: "Product",
                value: p => p.product.name
            },
            {
                title: "Weight",
                value: p => p.product.weight * p.quantity + " (" + p.product.weight + ")"
            }, {
                title: "Quantity",
                value: "quantity"
            }, {
                title: "Price",
                value: "price"
            }
        ]);
        
        function draw(context) {
            context.font = "18px sans-serif";
            context.fillText(shop.name, this.x, this.y + lineHeight);
            const bits = shop.bits + "b";
            const bitMeasure = context.measureText(bits);
            context.fillText(bits, this.x + this.width - bitMeasure.width, this.y + lineHeight);
            context.font = "14px sans-serif";

            table.x = this.x;
            table.y = this.y + lineHeight;
            table.width = this.width;
            table.draw(context, shop.selling());

        }
    }
}]);
app.register("CargoMenu", ["Table", function(Table) {
    return CargoMenu;

    function CargoMenu(trader) {
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
                value: p => (p.product.weight * p.quantity + " (" + p.product.weight + ")")
            },
            {
                title: "Quantity",
                value: "quantity"
            }
        ]);

        function draw(context) {
            this.height = lineHeight;
            context.save();
            context.font = "18px sans-serif";
            context.fillText(trader.name, this.x, this.y + lineHeight);

            context.font = "14px sans-serif";
            table.x = this.x;
            table.y = this.y + lineHeight;
            table.width = this.width;
            table.draw(context, trader.cargo());

            context.restore();
        }
    }
}]);
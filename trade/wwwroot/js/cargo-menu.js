app.register("CargoMenu", [function() {
    return CargoMenu;

    function CargoMenu(x, y, trader) {
        this.draw = draw;

        this.x = x;
        this.y = y;

        const height = 20;

        function draw(context) {
            this.height = 20;
            context.save();
            context.font = "18px sans-serif";
            context.fillText(trader.name, this.x, this.y);

            context.font = "14px sans-serif";
            let _y = this.y + 20;
            for (let item of trader.cargo()) {
                context.fillText(item.product.name, x + 5, _y);
                const quantity = item.quantity.toString();
                const measure = context.measureText(quantity);
                context.fillText(quantity, this.x + 140 - measure.width, _y);
                _y += height;
                this.height += height;
            }

            context.restore();
        }
    }
}]);
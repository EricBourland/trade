app.register("Shop", ["Inventory", function (Inventory) {
    return Shop;

    function Shop(x, y, name, bits) {

        this.name = name;
        this.draw = draw;
        this.update = update;
        this.stock = stock;
        this.order = order;
        this.supply = supply;
        this.directions = directions;
        this.snapshot = snapshot;
        this.accept = accept;
        this.prices = prices;
        
        this.orders = {};
        
        const size = 24;
        const fillStyle = "#64b5f6";
        const textStyle = "#444";
        const font = "14px sans-serif";
        const inventory = new Inventory();
        const restock = {};

        function draw(context) {
            context.save();
            context.fillStyle = fillStyle;
            context.beginPath();
            context.rect(x - size/2, y - size/2, size, size);
            context.fill();

            context.fillStyle = textStyle;
            context.font = font;
            const text = context.measureText(name);
            context.fillText(name, x - text.width / 2, y + size / 2 + 15);
            context.restore();
        }

        function update(dt) {
            for (let item of Object.values(restock)) {
                if (!item.interval) {
                    continue;
                }
                item.timer += dt;
                if (item.timer > item.interval) {
                    item.timer = 0;
                    const current = inventory.get(item);
                    if (current.quantity < item.quantity) {
                        inventory.setQuantity(current.product, item.quantity);
                    }
                }
            }
        }

        function directions(tx, ty){
            const v = {
                x: x - tx,
                y: y - ty
            };
            
            const magnitude = Math.sqrt(v.x*v.x + v.y*v.y);
            return {
                x: x,
                y: y,
                dx: v.x / magnitude,
                dy: v.y / magnitude,
                distance: magnitude
            };
        }

        function supply(product){
            return inventory.get(product);
        }

        function stock(product, price, quantity, seconds) {
            if (!seconds) {
                seconds = 0;
            }
            restock[product.id] = {
                id: product.id,
                interval: seconds * 1000,
                quantity: quantity,
                timer: 0
            };
            inventory.add(product, quantity, price);
        }

        function order(product, price) {
            this.orders[product.id] = {
                product: product,
                price: price
            };
        }

        function snapshot(){
            return {
                bits: bits,
                inventory: inventory.snapshot()
            };
        }

        function accept(snapshot){
            bits = snapshot.bits;
            inventory.copy(snapshot.inventory);
        }

        function prices(product){
            const purchase = inventory.get(product);
            const sale = this.orders[product.id];
            
            let buy, sell;
            if (purchase && purchase.price){
                buy = purchase.price;
            }

            if (sale && sale.price){
                sell = sale.price;
            }

            return {
                buy: buy,
                sell: sell
            };
        }
    }
}]);
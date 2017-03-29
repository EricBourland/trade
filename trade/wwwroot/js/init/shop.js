(function (app) {
    app.Shop = Shop;

    function Shop(x, y, name, bits) {

        this.draw = draw;
        this.update = update;
        this.stock = stock;
        this.order = order;
        this.sell = sell;
        this.buy = buy;
        this.directions = directions;
        this.supply = supply;
        this.demand = demand;
        
        const size = 24;
        const fillStyle = "#64b5f6";
        const textStyle = "#444";
        const font = "14px sans-serif";
        const inventory = {};
        const orders = {};

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
            for (let stock of Object.values(inventory)) {
                if (stock.interval === 0) {
                    continue;
                }
                stock.timer += dt;
                if (stock.timer > stock.interval) {
                    stock.timer = 0;
                    if (stock.quantity < stock.restock) {
                        stock.quantity = stock.restock;
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

        function stock(product, price, quantity, seconds) {
            if (!seconds) {
                seconds = 0;
            }
            inventory[product.id] = {
                product: product,
                price: price,
                quantity: quantity,
                restock: quantity,
                interval: seconds * 1000,
                timer: 0
            };
        }

        function order(product, price) {
            orders[product.id] = {
                product: product,
                price: price
            };
        }

        function buy(receipt) {
            const stocked = inventory[receipt.product.id];
            if (stocked){
                stocked.quantity += receipt.quantity;
            }
            bits -= receipt.total;
        }

        function sell(product, quantity) {
            const stocked = inventory[product.id];
            const price = stocked.price * quantity;
            stocked.quantity -= quantity;
            bits -= price;

            return {
                quantity: quantity,
                product: product,
                total: price
            };
        }

        function supply(product) {
            return inventory[product.id];
        }

        function demand(product, balance) {
            const ordered = orders[product.id];
            const quantity = Math.floor(bits / ordered.price);
            return {
                quantity: quantity,
                price: ordered.price
            };
        }
    }
})(app);
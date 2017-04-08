app.register("Shop", ["Location", "Inventory", "Purchase", "getMouseState", function (Location, Inventory, Purchase, getMouseState) {
    return Shop;

    function Shop(x, y, name, bits) {
        this.x = x;
        this.y = y;
        this.name = name;
        this.bits = bits;
        this.draw = draw;
        this.update = update;
        this.stock = stock;
        this.order = order;
        this.supply = supply;
        this.directions = directions;
        this.snapshot = snapshot;
        this.accept = accept;
        this.prices = prices;
        this.listing = listing;
        this.available = available;
        this.newTrade = newTrade;
        this.table = table;
        this.getPurchaseProduct = getPurchaseProduct;
        this.getSaleProduct = getSaleProduct;
        
        this.orders = {};
        
        const size = 24;
        const pressedFillStyle = "#81d4fa";
        const fillStyle = "#64b5f6";
        const strokeStyle = "#000"
        const textStyle = "#444";
        const font = "14px sans-serif";
        const inventory = new Inventory();
        const restock = {};
        const consume = {};
        const location = new Location(x, y);
        let state = {};

        function draw(context, selectedShop) {
            context.save();
            
            context.beginPath();
            context.rect(x - size/2, y - size/2, size, size);
            context.fillStyle = fillStyle;

            let stroke = false;
            
            state = getMouseState(context, state);
            if (state.pressed){
                context.fillStyle = pressedFillStyle;
            }
            if (state.hovering || state.pressed || selectedShop === this) {
                context.strokeStyle = strokeStyle;
                stroke = true;
            }

            context.fill();
            if (stroke){
                context.stroke();
            }
            
            context.fillStyle = textStyle;
            context.font = font;
            const text = context.measureText(name);
            context.fillText(name, x - text.width / 2, y + size / 2 + 15);
            context.restore();
        }

        function update(dt, ui) {
            updateItems(dt, restock, updateStockQuantity);
            updateItems(dt, consume, updateOrderQuantity);
            if (state.clicked){
                ui.selectShop(this);
            }
        }

        function updateItems(dt, settings, update) {
            for (let setting of Object.values(settings)) {
                if (!setting.interval){
                    continue;
                }
                setting.timer += dt;
                if (setting.timer > setting.interval) {
                    setting.timer = 0;
                    update(setting);
                }
            }
        }

        function updateStockQuantity(restock) {
            const stocked = inventory.get(restock.product);
            if (stocked.quantity < restock.quantity) {
                inventory.setQuantity(restock.product, restock.quantity);
            }
        }

        function updateOrderQuantity(consume) { 
            inventory.subtract(consume.product, consume.quantity);
        }

        function directions(tx, ty){
            return location.directions(tx, ty);
        }

        function supply(product){
            return inventory.get(product);
        }

        function available() {
            return inventory.available();
        }

        function stock(product, price, quantity, seconds) {
            if (!seconds) {
                seconds = 0;
            }
            restock[product.id] = {
                product: product,
                interval: seconds * 1000,
                quantity: quantity,
                timer: 0
            };
            inventory.add(product, quantity, price);
        }

        function order(product, price, quantity, seconds) {
            this.orders[product.id] = {
                product: product,
                price: price
            };
            if (!quantity){
                quantity = 1;
            }
            if (!seconds) {
                seconds = 0;
            }
            consume[product.id] = {
                product: product,
                interval: seconds * 1000,
                quantity: quantity,
                timer: 0
            };
        }

        function snapshot(){
            return {
                bits: this.bits,
                inventory: inventory.snapshot()
            };
        }

        function accept(snapshot){
            this.bits = snapshot.bits;
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

        function listing() {
            const wanted = Object.values(this.orders);
            const current = inventory.all().filter(c => !wanted.find(w => w.product === c.product)); 
            return wanted.concat(current);
        }

        function getPurchaseProduct() {
            return inventory.all()[0].product;
        }

        function getSaleProduct() {
            return Object.values(this.orders)[0].product;
        }

        function newTrade() {
            return new Purchase(getPurchaseProduct());
        }

        function table(){
            return [
                {
                    title: "Product",
                    value: p => p.product.name
                }, {
                    title: "Weight",
                    value: p => p.product.weight * p.quantity + " (" + p.product.weight + ")"
                }, {
                    title: "Quantity",
                    value: "quantity"
                }, {
                    title: "Price",
                    value: "price"
                }
            ];
        }
    }
}]);
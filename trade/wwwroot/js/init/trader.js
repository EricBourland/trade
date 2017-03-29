app.register("Trader", ["Stop", function(Stop) {
    return Trader;
    
    function Trader(x, y, name) {
        const trader = this;
        this.draw = draw;
        this.update = update;
        this.addStop = addStop;
        this.supply = supply;
        this.demand = demand;
        this.buy = buy;
        this.sell = sell;
        this.summary = summary;

        this.name = name;
        this.acceleration = 0.0001;
        this.maxSpeed = 0.1;
        this.transactionTime = 3000;
        this.maxWeight = 5;
        
        const fillStyle = "#bbddbb";
        const size = 10;
        const route = [];
        const inventory = {};
        let destination = null;
        let currentStop = null;
        let nextStop = 0;
        let speed = 0;
        let weight = 0;
        let currentTransactionTime = 0;

        function draw(context) {
            context.save();
            context.fillStyle = fillStyle;
            context.beginPath();
            context.arc(x, y, size, 0, Math.PI * 2);
            context.fill();
            context.restore();
        }

        function update(dt){
            if (this.trading){
                currentTransactionTime += dt;
                if (currentTransactionTime > this.transactionTime) {
                    tryCompleteTransaction();
                }
            }
            if (destination) {
                const threshold = speed * 200;
                const epsilon = 0.5;
                const dir = destination.shop.directions(x, y);
                
                if (dir.distance < epsilon){
                    arrive(dir);
                }

                if (speed < this.maxSpeed){
                    speed += this.acceleration * dt;
                }

                if (speed > this.maxSpeed){
                    speed = this.maxSpeed;
                }

                
                if (dir.distance < threshold){
                    speed *= dir.distance / threshold;
                }

                const dragThreshold = (2 * this.maxWeight) / 3;

                const drag = Math.max(1 - (Math.max(weight - dragThreshold, 0) / (this.maxWeight - dragThreshold)), 0.2);

                x += dir.dx * dt * speed * drag;
                y += dir.dy * dt * speed * drag;
            }
        }

        function addStop(shop) {
            const stop = new Stop(shop);
            route.push(stop);
            if (!destination){
                destination = stop;
            }
            return stop;
        }

        function arrive(dir){
            speed = 0;
            x = dir.x;
            y = dir.y;
            currentStop = destination;
            currentTransactionTime = 0;
            destination = null;
            trader.trading = true;
            nextStop += 1;
            if (nextStop >= route.length){
                nextStop = 0;
            }
        }

        function tryCompleteTransaction(){
            const transaction = currentStop.transaction;
            const shop = currentStop.shop;
            const agreement = transaction.negotiate(trader, currentStop.shop);
            if (!agreement.success){
                currentTransactionTime = 0;
                return; 
            }
            transaction.commit(trader, shop, agreement)
            
            trader.trading = false;
            destination = route[nextStop];
        }

        function buy(receipt) {
            if (!inventory[receipt.product.id]) {
                inventory[receipt.product.id] = { product: receipt.product, quantity: 0 };
            }

            const stocked = inventory[receipt.product.id];

            stocked.quantity += receipt.quantity;
            app.bits -= receipt.total;
            weight += receipt.quantity * receipt.product.weight;
        }

        function sell(product, quantity, price) {
            const stocked = inventory[product.id];
            const total = quantity * price;
            
            stocked.quantity -= quantity;
            app.bits += total;
            weight -= quantity * product.weight;

            return {
                quantity: quantity,
                product: product,
                total: total
            };
        }

        function demand(available, balance) {
            const byPrice = (app.bits - balance.total) / available.price;
            const byWeight = (this.maxWeight - weight + balance.weight) / available.product.weight;

            return Math.floor(Math.min(byPrice, byWeight));
        }

        function supply(product) {
            const cargo = inventory[product.id];
            if (!cargo){
                return 0;
            }
            return cargo.quantity;
        }

        function summary() {
            return {
                name: name,
                weight: weight,
                capacity: weight / trader.maxWeight,
            };
        }
    }
}]);
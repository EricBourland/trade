app.register("Trader", ["Stop", "Inventory", function(Stop, Inventory) {
    return Trader;
    
    function Trader(x, y, name) {
        const trader = this;
        this.draw = draw;
        this.update = update;
        this.addStop = addStop;
        this.supply = supply;
        this.summary = summary;
        this.snapshot = snapshot;
        this.accept = accept;

        this.name = name;
        this.acceleration = 0.0001;
        this.maxSpeed = 0.1;
        this.transactionTime = 3000;
        this.maxWeight = 5;

        const size = 10;
        const route = [];
        const inventory = new Inventory();
        let destination = null;
        let currentStop = null;
        let nextStop = 0;
        let speed = 0;
        let weight = 0;
        let currentTransactionTime = 0;

        function draw(context) {
            context.save();
            context.fillStyle = getStyle();
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

                const dragThreshold = (3 * this.maxWeight) / 5;
                const dragFactor = 0.2;

                const drag = 1 - ((Math.max(weight - dragThreshold, 0) / (this.maxWeight - dragThreshold)) * dragFactor);

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
                trader.blocked = true;
                return; 
            }

            transaction.commit(trader, shop, agreement);
            destination = route[nextStop];
            trader.trading = false;
            trader.blocked = false;
        }

        function supply(product) {
            const cargo = inventory.get(product);
            return cargo.quantity;
        }

        function summary() {
            return {
                name: name,
                weight: weight,
                capacity: weight / trader.maxWeight,
                inventory: inventory,
                fillStyle: getStyle(),
                stops: getStops()
            };
        }

        function getStops(){
            return route.map(r => {
                return {
                    name: r.shop.name,
                    trades: r.transaction.getTrades(r.shop)
                }
            });
        }

        function snapshot() {
            return {
                bits: app.bits,
                inventory: inventory.snapshot(),
                weight: weight
            };
        }

        function accept(snapshot){
            app.bits = snapshot.bits;
            weight = snapshot.weight;
            inventory.copy(snapshot.inventory);
        }

        function getStyle() {
            if (trader.blocked) {
                return "#c62828";
            }
            if (trader.trading) {
                return "#ffd54f";
            }
            return "#bbddbb";
        }
    }
}]);
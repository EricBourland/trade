app.register("Trader", ["Stop", "Inventory", "getMouseState", function(Stop, Inventory, getMouseState) {
    return Trader;
    
    function Trader(x, y, name) {
        const trader = this;
        this.draw = draw;
        this.update = update;
        this.addStop = addStop;
        this.removeStop = removeStop;
        this.toggle = toggle;
        this.supply = supply;
        this.summary = summary;
        this.snapshot = snapshot;
        this.accept = accept;
        this.cargo = cargo;

        this.name = name;
        this.acceleration = 0.0001;
        this.maxSpeed = 0.1;
        this.transactionTime = 3000;
        this.maxWeight = 5;
        this.dragFactor = 0.25;
        this.dragThreshold = 0.6;

        const size = 10;
        const route = [];
        const inventory = new Inventory();
        let destination = null;
        let currentStop = null;
        let nextStop = 0;
        let speed = 0;
        let weight = 0;
        let currentTransactionTime = 0;
        let state = {};

        function draw(context, selectedTrader) {
            context.save();

            if (destination) {
                context.save();
                context.globalCompositeOperation = "destination-over";
                context.lineWidth = 3;
                context.strokeStyle = "#88cc88";
                context.beginPath();
                context.moveTo(x, y);
                context.lineTo(destination.shop.x, destination.shop.y);
                context.stroke();
                context.restore();
            }
            
            if (route.length > 1){
                context.beginPath();
                context.moveTo(route[0].shop.x, route[0].shop.y);
                for (let i = 1; i < route.length; i++) {
                    context.lineTo(route[i].shop.x, route[i].shop.y);
                }
                if (route.length > 2){
                    context.closePath();
                }
                context.save();
                context.globalCompositeOperation = "destination-over";
                context.lineWidth = 2;
                context.strokeStyle = "#eee";
                context.stroke();
                context.restore();
            }

            context.beginPath();
            context.arc(x, y, size, 0, Math.PI * 2);

            state = getMouseState(context, state);
            context.fillStyle = getStyle();
            context.fill();
            if (selectedTrader === this || !state.idle){
                context.strokeStyle = "#444";
                context.stroke();
            }

            context.restore();

            if (state.clicked) {
                app.ui.selectTrader(this);
            }
        }

        function update(dt){
            if (this.trading){
                currentTransactionTime += dt;
                if (currentTransactionTime > this.transactionTime) {
                    if (tryCompleteTransaction()){
                        depart();
                    }
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

                const dragWeight = this.dragThreshold * this.maxWeight;

                const drag = 1 - ((Math.max(weight - dragWeight, 0) / (this.maxWeight - dragWeight)) * this.dragFactor);

                x += dir.dx * dt * speed * drag;
                y += dir.dy * dt * speed * drag;
            }
        }

        function addStop(shop) {
            const stop = new Stop(shop);
            route.push(stop);
            if (!trader.trading && !destination){
                destination = stop;
            }
            return stop;
        }

        function removeStop(shop){
            for (let i = route.length - 1; i >= 0; i--){
                if (route[i].shop === shop){
                    let removed = route.splice(i, 1);
                    return removed[0];
                }
            }
        }
        
        function toggle(shop){
            const existing = route.find(r => r.shop === shop);
            if (existing){
                removeStop(shop);
            } else {
                addStop(shop);
            }
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

        function depart(){
            destination = route[nextStop];
            currentStop = null;
            trader.trading = false;
            trader.blocked = false;
        }

        function tryCompleteTransaction(){
            const transaction = currentStop.transaction;
            const shop = currentStop.shop;
            const agreement = transaction.negotiate(trader, currentStop.shop);
            if (!agreement.valid){
                currentTransactionTime = 0;
                trader.blocked = true;
                return false; 
            }
            transaction.commit(trader, shop, agreement);
            return true;
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
                stops: getStops(),
                currentStop: currentStop,
                nextStop: route[nextStop],
                destination: destination
            };
        }

        function getStops() {
            return route.map(r => {
                return {
                    shop: r.shop,
                    name: r.shop.name,
                    transaction: r.transaction,
                    trades: r.transaction.getTradeSummary(r.shop)
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

        function cargo() {
            return inventory.all().filter(i => i.quantity > 0);
        }

        function accept(snapshot){
            app.bits = snapshot.bits;
            weight = snapshot.weight;
            inventory.copy(snapshot.inventory);
        }

        function getStyle() {
            if (state.pressed){
                return "#fcee8b";
            }
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
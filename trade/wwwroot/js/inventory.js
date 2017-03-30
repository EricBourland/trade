app.register("Inventory", [function() {
    return Inventory;

    function Inventory() {
        this.add = add;
        this.subtract = subtract;
        this.get = get;
        this.setQuantity = setQuantity;
        this.snapshot = snapshot;
        this.all = all;
        this.copy = copy;

        const items = {};

        function add(product, quantity, price) {
            const existing = items[product.id];
            if (existing) {
                existing.quantity += quantity;
                return;
            }
            
            items[product.id] = {
                product: product,
                price: price,
                quantity: quantity,
            };
        }

        function subtract(product, quantity){
            items[product.id].quantity -= quantity;
        }

        function setQuantity(product, quantity){
            items[product.id].quantity = quantity;
        }

        function get(product) {
            const item = items[product.id];
            if (!item) {
                return { product: product, quantity: 0 };
            }
            return item;
        }

        function snapshot() {
            const copy = new Inventory();
            for (let item of Object.values(items)){
                copy.add(item.product, item.quantity, item.price);
            }
            return copy;
        }

        function copy(snapshot) {
            for (let item of snapshot.all()){
                items[item.product.id] = Object.assign({}, item);
            }
        }

        function all() {
            return Object.values(items);
        }
    }
}]);
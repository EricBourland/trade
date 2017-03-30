app.register("ButtonCollection", ["Button", function(Button) {
    return ButtonCollection;

    function ButtonCollection(styles) {
        this.get = get;
        this.click = click;

        const buttons = [];

        let _click = () => {};

        function get(item, data) {
            let button = buttons.find(b => b.item === item);
            if (!button) {
                button = { button: new Button(), item: item };
                Object.assign(button.button.styles, styles);
                button.button.click(function () {
                    _click(item, data);
                });
                buttons.push(button);
            }
            return button.button;
        }

        function click(callback){
            _click = callback;
            return this;
        }
    }
}]);
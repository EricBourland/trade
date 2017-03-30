(function(app) {

    app.start = start;
    app.refresh = refresh;
    app.time = new Date();
    
    function start() {
        refresh();
        window.requestAnimationFrame(start);
    }

    function refresh() {
        const time = new Date();
        const dt = Math.min(time - app.time, 200);
        app.time = time;
        app.update(dt);
        app.draw(dt);
    }
    
})(app);

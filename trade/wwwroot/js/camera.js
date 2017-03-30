(function(app, $) {
    const camera = {
        x: 0,
        y: 0,
        scale: 1.0
    };
    const mouse = {};

    app.camera = camera;
    app.mouse = mouse;

    $(document.body).on("contextmenu", $event => $event.preventDefault());
    $(document.body).on("mousedown", mousedown);
    $(document.body).on("mouseup", mouseup);
    $(document.body).on("mousemove", mousemove);

    let last;
    let panning = false;

    function mousedown($event) {
        mouse.$event = $event;
        last = $event;
        if ($event.button === 0){
            mouse.down = true;
        }
        if ($event.button === 2) {
            panning = true;
        }
    }

    function mousemove($event) {
        mouse.$event = $event;
        mouse.offsetX = $event.offsetX;
        mouse.offsetY = $event.offsetY;
        
        if (panning){
            const delta = getDelta(last, $event);
            last = $event;
            camera.x += delta.x;
            camera.y += delta.y;
            app.refresh();
        }
        mouse.worldX = $event.offsetX - camera.x;
        mouse.worldY = $event.offsetY - camera.y;
    }

    function mouseup($event) {
        mouse.$event = $event;
        panning = false;
        if ($event.button === 0) {
            mouse.down = false;
        }
    }

    function getDelta(event1, event2) {
        return {
            x: event2.offsetX - event1.offsetX,
            y: event2.offsetY - event1.offsetY
        };
    }
    
})(app, $);
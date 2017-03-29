(function(app, $) {
    const camera = {
        x: 0,
        y: 0,
        scale: 1.0
    };

    app.camera = camera;

    $(document.body).on("contextmenu", $event => $event.preventDefault());
    $(document.body).on("mousedown", mousedown);
    $(document.body).on("mouseup", mouseup);
    $(document.body).on("mousemove", mousemove);

    let last;
    let panning = false;

    function mousedown($event) {
        last = $event;
        if ($event.button === 2) {
            panning = true;
        }
    }

    function mousemove($event) {
        if (!panning){
            return;
        }
        
        const delta = getDelta(last, $event);
        last = $event;
        camera.x += delta.x;
        camera.y += delta.y;

        app.refresh();
    }

    function mouseup($event) {
        panning = false;
    }

    function getDelta(event1, event2) {
        return {
            x: event2.offsetX - event1.offsetX,
            y: event2.offsetY - event1.offsetY
        };
    }
    
})(app, $);
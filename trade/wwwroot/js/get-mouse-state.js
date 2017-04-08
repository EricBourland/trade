app.register("getMouseState", function() {
    return function (context, state) {
        const result = {
            clicked: false
        };
        
        if (context.isPointInPath(app.mouse.offsetX, app.mouse.offsetY)) {
            if (app.mouse.down) {
                if (state.hovering) {
                    result.pressed = true;
                    result.hovering = false;
                    result.idle = false;
                } else if (state.pressed){
                    result.pressed = true;
                }
            } else {
                result.idle = false;
                result.hovering = true;
                if (state.pressed) {
                    result.pressed = false;
                    result.clicked = true;
                    app.clicked = state;
                }
            }
        } else {
            result.idle = true;
            result.hovering = false;
            result.pressed = false;
        }
        return result;
    }
});
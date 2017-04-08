const app = (function() {

    const registered = [];
    const runnables = [];

    $(document).ready(function() {
        let skipped;
        let progressed = true;
        do {
            if (!progressed){
                const failed = registered.filter(r => !r.registered);
                const msg = failed.map(f => f.name + ": [" + f.registration.slice(0, f.registration.length - 1) + "]");
                throw new Error("Dependency registration infinite loop detected: " + msg);
            }
            progressed = false;
            skipped = false;
            for (let r of registered) {
                if (r.registered){
                    continue;
                }
                let skip = false;
                const args = [];
                for (let i = 0; i < r.registration.length - 1; i++) {
                    const dependency = app[r.registration[i]];
                    if (!dependency){
                        skip = true;
                        break;
                    }
                    args.push(dependency);
                }
                if (skip){
                    skipped = true;
                    continue;
                }
                
                let builder = r.registration;
                if (Array.isArray(builder)){
                    builder = r.registration[r.registration.length - 1];
                }
                
                const result = builder.apply(null, args);
                
                if (!result) {
                    throw new Error("Registration failed: " + r.name);
                }
                app[r.name] = result;
                progressed = true;
                r.registered = true;
            }
        } while(skipped);

        for (let runnable of runnables){
            const args = [];
            for (let i = 0; i < runnable.length - 1; i++) {
                const dependency = app[runnable[i]];
                args.push(dependency);
            }
            runnable[runnable.length - 1].apply(null, args);
        }
        
        app.start();
    });

    return {
        bits: 2,
        register: function(name, registration) {
            registered.push({
                name: name,
                registration: registration
            });
        },
        run(runnable){
            runnables.push(runnable);
        }
    };
})();
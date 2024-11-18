class GameEvents {
    callbacks = [];
    nextId = 0;

    // emit the event
    emit(eventName, value) {
        this.callbacks.forEach(stored => {
            if(stored.eventName === eventName) {
                stored.callback(value);
            }
        })
    }

    // subscribe to something happening
    on(eventName, caller, callback) {
        this.nextId += 1;
        this.callbacks.push({
            eventName,
            caller,
            callback
        });
        return this.nextId;
    }

    // remove the subscription
    off(id) {
        this.callbacks = this.callbacks.filter((stored) => stored.id !== id);
    }

    unsubscribe(caller) {
        this.callbacks = this.callbacks.filter((stored) => stored.caller !== caller);
    }

}
var global = window || global;
global.GameEvents = new GameEvents();

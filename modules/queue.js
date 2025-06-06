class Queue {
    constructor() {
        this.items = [];
    }

    addToQueue(element) {
        this.items.push(element);
    }

    removeFromQueue() { //Removes and returns the element at the front of the queue.
        if (this.isEmpty()) {
            return "Queue is empty";
        }
        return this.items.shift();
    }

    clearQueue() {
        this.items = [this.items[0]];
    }

    front() { //Returns the element at the front of the queue without removing it.
        if (this.isEmpty()) {
            return "Queue is empty";
        }
        return this.items[0];
    }

    isEmpty() {
        return this.items.length === 0;
    }

    size() {
        return this.items.length;
    }

    playNextSong() {
        const track = this.front();
    }

}

const queueMap = new Map();
module.exports = {Queue,queueMap}

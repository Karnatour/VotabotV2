const {TrackEndEvent, TrackStartEvent} = require("shoukaku");
const client = require("./../index")
const sharedQueue = require("../modules/queue");

function handleTrackStartEvent() {
    client.shoukaku.players.get()
    console.log('Now playing: {}', event.track.info.title);
    playNextSong();
}

function handleTrackEndEvent(event: TrackEndEvent) {
    console.log('Track {} ended', event.track.info.title);
    sharedQueue.dequeue();//Delete now playing song from queue since it ended
}

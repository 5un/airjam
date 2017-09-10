console.log('initializing bot...')
//var outputChannel = config['CMAJOR']
//console.log('output channel: %s', outputChannel)
//forward message received from example.in channel to example.out channel
function onMessage(channel, message) {
    if(message.type == "note") {
        message.type = "modified";
        //modify
        if(message.instrument.name == 'piano') {
            //scale it to CMAJOR
            var note = message.note;
            //var notes = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
            var curr_note_index = message.note % 12;
            //CMAJOR: C, D, E, F, G, A, B
            switch(curr_note_index) {
            case 1: message.note -= 1; break;
            case 3: message.note -= 1; break;
            case 6: message.note -= 1; break;
            case 8: message.note -= 1; break;
            case 10: message.note -= 1; break;
            }
            message.volume = 0.7;
        }
        else if(message.instrument.name == 'drums') {
            message.volume = 0.5;
        }
    }
    rtm.publish(channel, message)
}
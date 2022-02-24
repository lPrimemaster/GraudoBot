const { 
    joinVoiceChannel,
    getVoiceConnection,
    createAudioPlayer,
    NoSubscriberBehavior,
    createAudioResource,
    AudioPlayerStatus,
    VoiceConnectionStatus,
    entersState,
    StreamType
} = require('@discordjs/voice');
const { join } = require('path');

module.exports.LeaveChannel = (channel) => {
    const connection = getVoiceConnection(channel.guild.id);
    if(connection) {
        connection.destroy();
    }
}

var queue = [];

// TODO: Joinning a channel and playing songs should be in diferent 'things'
module.exports.JoinChannel = (channel, track, volume, file=true) => {
    var connection = getVoiceConnection(channel.guild.id);
    if(connection) {
        // Already in a voice channel
        queue.push([track, file]);
    }
    else {
        connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guildId,
            adapterCreator: channel.guild.voiceAdapterCreator,
        });

        const player = createAudioPlayer();
        var resource;
        if(file)
        {
            resource = createAudioResource(join(__dirname, track), {
                inlineVolume: true 
            });
            console.log('Playing internal file: ' + join(__dirname, track));
        }
        else
        {
            resource = createAudioResource(track, {
                inputType: StreamType.WebmOpus,
                inlineVolume: true,
            });
            console.log('Playing from stream.');
        }
        
        resource.volume.setVolume(volume);
        connection.subscribe(player); 

        connection.on(VoiceConnectionStatus.Ready, () => {console.log("Ready"); player.play(resource);});
        connection.on(VoiceConnectionStatus.Disconnected, async (oldState, newState) => {
            try {
                console.log("Disconnected.")
                await Promise.race([
                    entersState(connection, VoiceConnectionStatus.Signalling, 5_000),
                    entersState(connection, VoiceConnectionStatus.Connecting, 5_000),
                ]);
            } catch (error) {
                connection.destroy();
            }
        });
        player.on('error', error => {
            console.error(`Error: ${error.message} with resource ${error.resource.metadata.title}`);
        });
        player.on(AudioPlayerStatus.Playing, () => {
            console.log('The audio player has started playing!');
        }); 
        player.on('idle', () => {
            if(queue.length === 0) {
                console.log('Disconnecting!');
                connection.destroy();
            }
            else {
                var ntrack = queue.shift();
                if(ntrack[1])
                {
                    resource = createAudioResource(join(__dirname, ntrack[0]), {
                        inlineVolume: true 
                    });
                    console.log('Playing internal file: ' + join(__dirname, ntrack[0]));
                }
                else
                {
                    resource = createAudioResource(ntrack[0], {
                        inputType: StreamType.WebmOpus,
                        inlineVolume: true,
                    });
                    console.log('Playing from stream.');
                }
                player.play(resource);
            }
        });
    }
}

module.exports.filter = (collection, predicate) => {
    var result = new Array();
    var length = collection.length;

    for(var j = 0; j < length; j++)
    {
        if(predicate(collection[j]) == true)
        {
            result.push(collection[j]);
        }
    }

    return result;
}

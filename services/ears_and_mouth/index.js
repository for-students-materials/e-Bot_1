require('dotenv').config();
const fs = require('fs/promises');
const yandexSpeech = require('yandex-speech');
const apikey = process.env.YANDEX_SPEECH_API_KEY;

// your code
function textToBuff(text){
    return new Promise((res, rej) => {
        yandexSpeech.TTS({
            developer_key: apikey,
            lang: 'ru-RU',
            format: 'lpcm',
            rate: 48000,
            text,
        }).then((audioStream) => {
            const buffers = [];
            audioStream.on('data', (buffer) => buffers.push(buffer));
            audioStream.on('end', () => res(Buffer.concat(buffers)));
        }).catch((err) => rej(err))
    }); 
}

function audioBuffToText(audioBuffer){
    return yandexSpeech.STT({
        developer_key: apikey,
        file: {
          data: audioBuffer,
          type: 'audio/lpcm;bit=16;samle-rate=48000;channels=1',
        },
        lang: 'ru-RU',
        format: 'lpcm',
      })
}

module.exports = {

    /**
     * @param {*} message.format - you'r messages format text | voice 
     * @param {*} message.data - you'r messages text 
     * @returns message of other type data is srting or arrBuffer
     */
    convert: async (message) => {
        // your code
        const type = message.type === 'voice'? 'text' : message.type === 'text'? 'voice' : null;
        if(!type) return message;
        if(type === 'text') return {type, data: await audioBuffToText(message.data)};
        if(type === 'voice') return {type, data: await textToBuff(message.data)};
    },

    
}
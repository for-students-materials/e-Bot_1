
const {readFileSync} = require('fs');
const fs = require('fs/promises');
const path = require('path');

function getMessFomStr(str, convert){
    let [type, data] = str.split(str.includes('>> ')? '>> ' : '<< ');
    return type === 'voice' ? convert({type:'text',data}): {type,data};
}

function check(res, str){
    // тут нужна проверка, пока что это простая заглушка но нужно проверять нормально спомощю регекспа
    return res == str.split(`<< `)[1];
}

module.exports = {

    /**
     * 
     * @param {Function} convert 
     * @param {Array} file 
     * @param {string} fileName 
     * @returns cb
     */
    calling: ({convert, file, fileName}) => async ({progress, setProgres, chat, message, send}) => {
        // тут нам надо понять кто звонит в каком боте и для этого юзера в зависимости  от типа звонка продолжить процесс общения
        const res = message.type === 'text'? message.data : (await convert(message)).data;
        const typeCheck = file[progress+1].includes(`${message.type}<< `);
        if(typeCheck && check(res, file[progress+1])){
            for(let i = progress+2; i<file.length; i++){
                if(file[i].includes('<< ')) break;
                await send(getMessFomStr(file[i], convert));
                setProgres(i);
            }
        }
        await send(getMessFomStr(file[progress+1], convert));
        await send(getMessFomStr(file[progress], convert));
    } 
}


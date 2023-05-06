require('dotenv').config();
const fs = require('fs/promises');
const path = require('path');
const tBot = require('./services/t-bot');
const ears_and_mouth = require('./services/ears_and_mouth');
const process = require('./services/process');


async function botGenerator(file){
    // что бы бот зарабоk
    // прочли файл получи пропсы бота
    // подняли экземпляр бота 
    // вызвали для каждого экземпляра функцию listen(process.calling({ears_andmouth, tme, botFileName}))

}

const showMastGoOn = (async ()=> {
    //цикл в котором поднимаются все боты из папки ботс
    const fNames = []
})


// const father = tBot({params}); // process.env.TELEGRAM_BOT_TOKEN
// father.listen(async (ctx) => {
//     // наверно надо как то это защитить
//     // добавь файл из контехста в папку ботс и вызови функцию создания нового бота
// })
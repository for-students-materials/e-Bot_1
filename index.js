require('dotenv').config();
const fs = require('fs/promises');
const path = require('path');
const axios = require('axios');
const tBot = require('./services/t-bot');
const ears_and_mouth = require('./services/ears_and_mouth');
const process = require('./services/process');


async function botGenerator(file){
    // что бы бот зарабоk
    // прочли файл получи пропсы бота
    // подняли экземпляр бота 
    // вызвали для экземпляра функцию listen(process.calling({ears_andmouth, tme, botFileName}))
    const [ botParamsJson, ...fileText] = (await fs.readFile(file, 'utf-8')).replace('\n\n','\n').split('\n');
    const {app} = tBot(JSON.stringify(botParamsJson));
    app.listen(process.calling({ears_and_mouth, fileName: file, file: fileText}))

}

const showMastGoOn = (async ()=> {
    //цикл в котором поднимаются все боты из папки ботс
    const fNames = await fs.readdir('./bots');
    fNames.forEach(f => botGenerator(f));
})


const father = tBot(process.env.TELEGRAM_BOT_TOKEN || '6054095011:AAHXC6GpXZeoZP5SJP-RS022QPTuL7_MJ7s'); // t.me/botsgenerator_genabot
father.listen(async (ctx) => { // bot.on('document', async (ctx) => {
    // наверно надо как то это защитить
    // добавь файл из контехста в папку ботс и вызови функцию создания нового бота
    const { document } = ctx.message;

    if(document.mime_type === 'text/plain') {
        const destanation = await axios.get(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/getFile?file_id=${document.file_id}`);
        const {data: fileText} = await axios.get(`https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${destanation.data.result.file_path}`);
        const fileData = JSON.parse(fileText.split('\n'))[0];
        await fs.writeFile(`./bots/${fileData.token}.txt`,fileText,'utf-8');
        botGenerator(`${fileData.token}.txt`);
        return ctx.reply('File received!');
    } 
    return ctx.reply('Only text files are supported!');
    
})
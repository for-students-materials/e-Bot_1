require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const { message } = require('telegraf/filters');


// путь к фалу с программой и первой стракой жсон с данными подключения к боту из ботпапы
module.exports = ({token, isCreator, file}) => {
    // create Telegraf
    const progress = {};
    const bot = new Telegraf(process.env.BOT_TOKEN);
    if(!isCreator){
        const levels = file.map((s, i) => s[0] === '#'? [s.slice(1), i] : null).filter(s => !!s);
        const menu = Markup.inlineKeyboard([
            Markup.callbackButton('Choose Lavel', 'level'),
            Markup.callbackButton('Restart', 'restart'),
        ]);
          
        bot.action('level', (ctx) => {
            ctx.reply(Markup.inlineKeyboard(
                levels.map(l => Markup.callbackButton(l[0], 'toLevel_'+l[1]))
            ).extra())
        });

        bot.action('restart', (ctx) => {
            progress[ctx.chat.id] = 0;
            ctx.reply('Was Restarting, send me something');
        });
        
        levels.forEach(l => {
            bot.action('toLevel_'+l[1], (ctx) => {
                ctx.reply(l[0]);
                progress[ctx.chat.id] = l[1];
            });
        });
        
        bot.start(async (ctx) => {
            progress[ctx.chat.id] = 0;
        });

    }

    return{ app: {        
        /**
         * 
         * @param {*} chat - it's chat id
         * @param {*} message - you'r message 
         * @param {*} message.format - you'r messages format text | voice | image | video  
         * @param {*} message.data - you'r messages text or link if there image or video
         * @returns 
         */
        send: async (chat, message) => {
            switch (message.type) {
                case 'text':
                    await bot.telegram.sendMessage(chat, message.data)
                    break;
                case 'voice':
                    bot.telegram.sendVoice(chatId, {source: audioBuffer}) // буфер голоса
                    break;
                case 'image':
                    bot.telegram.sendPhoto(chat, message.data) // ссылка на фото
                    break;
                case 'video':
                    bot.telegram.sendVideo(chat, message.data) // ссылка на видео
                    break;
            
                default:
                    break;
            }
            
        },

        /**
         * 
         * @param {*} cb - async function: cb({progress, setProgres, chat, message, send})
         * @returns 
         */
        listen: (cb) => {
            const call = async (type, ctx) => {
                const chat = ctx.chat.id;
                const message = {type, data: ctx.message.text || ctx.message.voice }
                const setProgres = (num) => progress[chat] = num;
                await cb({progress, setProgres, chat, message, send: (message) => this.send(chat, message)})
            }
            bot.on('text', async ctx => await call('text', ctx));
            bot.on('voice', async ctx => {
                const voiceLink = await ctx.telegram.getFileLink(ctx.message.voice.file_id);
                const { data } = await axios.get(voiceLink, { responseType: 'arraybuffer' });
                ctx.message.voice = data;
                await call('voice', ctx)
            });
        },
    }
}}
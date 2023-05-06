require('dotenv').config();
const { Telegraf } = require('telegraf');
const { message } = require('telegraf/filters');


// путь к фалу с программой и первой стракой жсон с данными подключения к боту из ботпапы
module.exports = (params) => {
    // create Telegraf
    return{ app: {
        listen: (cb) => {
            bot.on(_, async ctx => {
                await cb({tme, message, send: (message) => { /*тоже самое что сенд нижк но tme отдавать не надо*/}})
            })
        },
        /**
         * 
         * @param {*} tme -telegram tag <for example @K_Kukuliev>
         * @param {*} message - you'r message 
         * @param {*} message.format - you'r messages format text | audio | image | video  
         * @param {*} message.data - you'r messages text or link if there image or video
         * @returns 
         */
        send: async (tme, message) => {
        },
    }
}}
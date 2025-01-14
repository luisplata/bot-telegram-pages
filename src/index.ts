import express, { Request, Response } from 'express';
import { Telegraf } from 'telegraf';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const BOT_TOKEN = process.env.BOT_TOKEN;
const SERVER_URL = process.env.SERVER_URL; // URL pública de tu servidor
const ENDPOINT = process.env.ENDPOINT; // URL de la página que quieres abrir en Telegram

// Verificar que las variables estén definidas
if (!BOT_TOKEN) {
    throw new Error("El token del bot no está definido en el archivo .env");
}
if (!SERVER_URL) {
    throw new Error("La URL del servidor no está definida en el archivo .env");
}

// Inicializar bot
const bot = new Telegraf(BOT_TOKEN);

// Configurar webhook
const WEBHOOK_PATH = '/bot';
const WEBHOOK_URL = `${SERVER_URL}${WEBHOOK_PATH}`;

// Configurar el webhook en Telegram
bot.telegram.setWebhook(WEBHOOK_URL);

// Rutas de tu servidor
app.use(bot.webhookCallback(WEBHOOK_PATH));

app.get('/', (req: Request, res: Response) => {
    res.send('Servidor funcionando correctamente.');
});

bot.start((ctx) => {
    ctx.reply("¡Hola! Haz clic en el botón de abajo para abrir la página directamente en Telegram.", {
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: "Abrir Página en Telegram",
                        web_app: { url: `${ENDPOINT}` },
                    },
                    {
                        text: "Compartir Bot",
                        switch_inline_query: "", // Esto permite enviar el bot en otros chats
                    },
                ],
            ],
        },
    });
});

bot.command('info', (ctx) => {
    ctx.reply("Soy un bot creado para ayudarte. ¡Estoy aquí para lo que necesites!");
});

bot.command('menu', (ctx) => {
    ctx.reply("Selecciona una opción:", {
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: "Abrir Página en Telegram",
                        web_app: { url: "https://onlysfree.com" },
                    },
                ],
            ],
        },
    });
});


// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    console.log(`Webhook configurado en ${WEBHOOK_URL}`);
});

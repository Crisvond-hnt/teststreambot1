import { makeTownsBot } from '@towns-protocol/bot'
import { Hono } from 'hono'
import { logger } from 'hono/logger'
import commands from './commands'

const bot = await makeTownsBot(process.env.APP_PRIVATE_DATA!, process.env.JWT_SECRET!, {
    commands,
})

function getSarcasticComment(change24h: number, cryptoName: string): string {
    if (change24h >= 10) {
        const comments = [
            "🚀 TO THE MOON! Your lambo is being delivered next week!",
            "💎 DIAMOND HANDS PREVAIL! You absolute legend!",
            "🎰 Okay whale, calm down. Save some gains for the rest of us!",
            "🌟 This is your sign to quit your job! (jk please don't)",
            "👑 KING/QUEEN OF CRYPTO! Everyone bow down!"
        ]
        return comments[Math.floor(Math.random() * comments.length)]
    } else if (change24h >= 5) {
        const comments = [
            "📈 Nice gains! Time to update that LinkedIn to 'Crypto Investor'",
            "💰 Wen moon? Soon moon! Keep it up!",
            "🎉 You're basically Warren Buffett now",
            "✨ Look at you, making smart financial decisions!",
            "🏆 Not bad, not bad at all. Still poor, but trending rich!"
        ]
        return comments[Math.floor(Math.random() * comments.length)]
    } else if (change24h >= 0) {
        const comments = [
            "😊 Hey at least you're not losing money... yet",
            "🤷 Sideways action. Just like your life. But you're doing great!",
            "📊 Ah yes, the famous 'stable' coin strategy",
            "🐌 Slow and steady wins the race... or so they say",
            "💤 Wake me up when something interesting happens"
        ]
        return comments[Math.floor(Math.random() * comments.length)]
    } else if (change24h >= -5) {
        const comments = [
            "😬 Ouch! But hey, it's just money... that you worked hard for",
            "🤡 'HODL' they said. 'It'll be fun' they said.",
            "💸 You're not losing money, you're just... temporarily de-gaining",
            "🎢 Ah yes, the thrill of the dip! Character building!",
            "🫠 Look on the bright side - you're providing liquidity!",
            "😅 It's not a loss until you sell! (Keep telling yourself that)"
        ]
        return comments[Math.floor(Math.random() * comments.length)]
    } else if (change24h >= -10) {
        const comments = [
            "💀 RIP your portfolio. Should've bought the dip!",
            "🫡 Your sacrifice will be remembered. o7",
            "😭 Looks like ramen is back on the menu!",
            "🎪 Welcome to the circus! You're the main clown!",
            "📉 Delete the app. That's my professional financial advice.",
            "🔥 Everything is fine. This is fine. We're all fine. *nervous laughter*",
            "🤕 'BuY tHe DiP' - Past You, who was clearly delusional"
        ]
        return comments[Math.floor(Math.random() * comments.length)]
    } else {
        const comments = [
            "☠️ ARE YOU OKAY?! Blink twice if you need help!",
            "🪦 Rest in peace, your net worth. Gone but not forgotten.",
            "😱 YIKES! Have you considered a savings account instead?",
            "🎻 *plays sad violin music* This is... this is bad fam",
            "🆘 SOS! MAYDAY! Someone call the crypto police!",
            "😵 Did you... did you buy at the top? Be honest.",
            "🔻 Congratulations! You've unlocked achievement: ULTIMATE BAGHOLDER",
            "💩 Well well well, if it isn't the consequences of your own actions",
            "🚨 BREAKING: Local investor discovers gravity still works",
            "⚰️ Time to tell your family you lost it all on 'internet money'"
        ]
        return comments[Math.floor(Math.random() * comments.length)]
    }
}

async function getCryptoPrice(cryptoId: string): Promise<string> {
    try {
        const url = `https://api.coingecko.com/api/v3/simple/price?ids=${cryptoId}&vs_currencies=usd&include_24hr_change=true&include_market_cap=true`
        console.log(`🔍 Fetching price for: ${cryptoId}`)
        console.log(`📡 URL: ${url}`)
        
        const response = await fetch(url, {
            headers: {
                'Accept': 'application/json',
            }
        })
        
        console.log(`📊 Response status: ${response.status}`)
        
        if (!response.ok) {
            const errorText = await response.text()
            console.error(`❌ API Error (${response.status}):`, errorText)
            
            if (response.status === 429) {
                return `⏳ Rate limit exceeded! CoinGecko API is cooling down. Try again in a minute.\n\n💡 Tip: The free API has limits, so be patient!`
            }
            
            return `❌ Unable to fetch price data (Status: ${response.status}). Please try again later.`
        }
        
        const data = await response.json()
        console.log('📦 API Response:', JSON.stringify(data))
        
        if (!data[cryptoId]) {
            return `❌ Cryptocurrency "${cryptoId}" not found. Try using the full name like "ethereum", "bitcoin", "cardano", etc.`
        }
        
        const price = data[cryptoId].usd
        const change24h = data[cryptoId].usd_24h_change
        const marketCap = data[cryptoId].usd_market_cap
        
        const changeEmoji = change24h >= 0 ? '📈' : '📉'
        const changeColor = change24h >= 0 ? '+' : ''
        
        const sarcasticComment = getSarcasticComment(change24h, cryptoId)
        
        return `**${cryptoId.toUpperCase()} Price** ${changeEmoji}\n\n` +
               `💵 **Price:** $${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}\n` +
               `📊 **24h Change:** ${changeColor}${change24h.toFixed(2)}%\n` +
               `💰 **Market Cap:** $${(marketCap / 1_000_000_000).toFixed(2)}B\n\n` +
               `${sarcasticComment}`
    } catch (error) {
        console.error('💥 Error in getCryptoPrice:', error)
        return `❌ Error fetching crypto price: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again later.`
    }
}

bot.onSlashCommand('help', async (handler, { channelId }) => {
    await handler.sendMessage(
        channelId,
        '**Crypto Price Bot** 💰🤡\n\n' +
            '**Available Commands:**\n\n' +
            '• `/help` - Show this help message\n' +
            '• `/price <crypto>` - Check cryptocurrency price (with spicy commentary)\n\n' +
            '**Examples:**\n' +
            '• `/price ethereum`\n' +
            '• `/price bitcoin`\n' +
            '• `/price cardano`\n' +
            '• `/price solana`\n\n' +
            '**What to Expect:**\n' +
            '📈 Green days = Celebration time!\n' +
            '📉 Red days = Savage roasting 🔥\n' +
            '💀 Big dumps = Maximum sarcasm unlocked\n\n' +
            '**Supported Cryptocurrencies:**\n' +
            'Bitcoin, Ethereum, Cardano, Solana, Polygon, Avalanche, Chainlink, Dogecoin, and many more!\n\n' +
            '⚠️ *Not financial advice. Bot is just here for the memes.*'
    )
})

bot.onSlashCommand('price', async (handler, { channelId, args }) => {
    if (args.length === 0) {
        await handler.sendMessage(
            channelId,
            '❌ Please specify a cryptocurrency.\n\n**Usage:** `/price <crypto>`\n**Example:** `/price ethereum`'
        )
        return
    }
    
    const cryptoId = args[0].toLowerCase()
    const priceInfo = await getCryptoPrice(cryptoId)
    await handler.sendMessage(channelId, priceInfo)
})

// Server setup
const app = new Hono()
app.use('*', logger())

// Health check endpoint for Render
app.get('/health', (c) => {
    return c.json({ 
        status: 'ok', 
        service: 'crypto-price-bot',
        timestamp: new Date().toISOString()
    })
})

// Root endpoint
app.get('/', (c) => {
    return c.json({ 
        message: 'Crypto Price Bot is running!',
        bot: 'towns-protocol',
        endpoints: {
            webhook: '/webhook',
            health: '/health'
        }
    })
})

const { jwtMiddleware, handler } = bot.start()
app.post('/webhook', jwtMiddleware, handler)

const PORT = process.env.PORT || 3000
console.log(`🤖 Crypto Price Bot starting on port ${PORT}...`)

export default {
    port: PORT,
    fetch: app.fetch,
}

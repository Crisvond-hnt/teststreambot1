import type { PlainMessage, SlashCommand } from '@towns-protocol/proto'

const commands = [
    {
        name: 'help',
        description: 'Get help with bot commands',
    },
    {
        name: 'price',
        description: 'Check cryptocurrency price with spicy commentary',
    },
    {
        name: 'foolsgold',
        description: 'Get a random trending meme coin (probably a rug pull)',
    },
] as const satisfies PlainMessage<SlashCommand>[]

export default commands

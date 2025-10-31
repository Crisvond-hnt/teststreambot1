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
] as const satisfies PlainMessage<SlashCommand>[]

export default commands

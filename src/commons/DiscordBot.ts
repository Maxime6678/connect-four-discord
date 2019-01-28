import * as Discord from 'discord.js'

/*
 * This project is under MIT License
 * View LICENSE for more details
 *
 * Copyright (c) 2019 Maxime6678
 */

/**
 * Installation:
 *      npm install discord.js
 * 
 * Exemple:
 * 
 *      class PanimaBot extends BotConstructor {
 *
 *          constructor(token: string) {
 *             super(token)
 *          }
 *
 *          onReady(client: Discord.Client) {
 *              console.log(`Login as ${client.user.tag}`)
 *          }
 *
 *          onError(client: Discord.Client, error: Error) {
 *              console.log(`Error ${error.name}: ${error.message}`)
 *          }
 *
 *      }
 *
 *      class PingCommandConstructor extends CommandConstructor {
 *
 *          execute(client: Discord.Client, message: Discord.Message, args: string[]) {
 *              console.log(message.content)
 *          }
 *
 *      }
 * 
 *      class MessageEvent extends EventConstructor {
 *
 *          execute(client: Discord.Client) {
 *              return (message: Discord.Message) => {
 *                  console.log(message.content)
 *              }
 *          }
 *
 *      }
 * 
 *      const bot = new PanimaBot(process.env.TOKEN)
 *      bot.registerCommandConstructor('ping', new PingCommandConstructor())
 *      bot.registerEvent('message', new MessageEvent())
 *      bot.connect()
 * 
 */

/**
 * Use this as extends for create a Discord bot more easiest.
 *
 * @export
 * @abstract
 * @class BotConstructor
 */
export abstract class BotConstructor {

    public readonly client: Discord.Client
    public readonly token: string
    private commands: Map<string, CommandConstructor>

    /**
     * Creates an instance of BotConstructor.
     * @param {string} token Provide the bot token found on https://discordapp.com/developers/applications/
     * @memberof BotConstructor
     */
    constructor(token: string) {
        this.token = token
        this.client = new Discord.Client()
        this.commands = new Map<string, CommandConstructor>()
        this.client.on('ready', () => this.onReady(this.client))
        this.client.on('error', err => this.onError(this.client, err))
        this.client.on('message', message => {
            if (message.author.bot) return
            if (message.content.indexOf(process.env.PREFIX) !== 0) return

            let args = message.content.slice(process.env.PREFIX.length).trim().split(/ +/g)
            let command = args.shift().toLowerCase()

            if (this.commands.has(command)) {
                this.commands.get(command).execute(this.client, message, args)
            }
        })
    }

    /**
     * Login the bot to the Discord world.
     *
     * @memberof BotConstructor
     */
    public connect(): void {
        this.client.login(this.token)
    }

    /**
     * Register a command for your bot.
     *
     * @param {string} name The name of your command without the prefix
     * @param {CommandConstructor} command Instance of CommandConstructor class
     * @memberof BotConstructor
     */
    public registerCommand(name: string, command: CommandConstructor): void {
        this.commands.set(name, command)
    }

    /**
     * Register a event for your bot
     *
     * @param {string} name The name of your event
     * @param {EventConstructor} event Instance of EventBuilder class
     * @memberof BotConstructor
     */
    public registerEvent(name: string, event: EventConstructor): void {
        this.client.on(name, event.execute(this.client))
    }

    /**
     * Execute when the bot is ready.
     *
     * @abstract
     * @param {Discord.Client} client Provide the client of the bot
     * @memberof BotConstructor
     */
    public abstract onReady(client: Discord.Client): void

    /**
     * Execute when the bot trigger an error.
     *
     * @abstract
     * @param {Discord.Client} client Provide the client of the bot
     * @param {Error} error Provide the error from the bot
     * @memberof BotConstructor
     */
    public abstract onError(client: Discord.Client, error: Error): void

}

/**
 * Use this as extends for create a bot command more easiest.
 *
 * @exports
 * @abstract
 * @class CommandConstructor
 */
export abstract class CommandConstructor {

    /**
     * Execute when the command is trigged.
     *
     * @abstract
     * @param {Discord.Client} client Provide the client of the bot
     * @param {Discord.Message} message Provide the message from user
     * @param {string[]} args Provide the args of the command
     * @memberof CommandConstructor
     */
    public abstract execute(client: Discord.Client, message: Discord.Message, args: string[])

}

/**
 * Use this as extends for create a event more easiest.
 *
 * @exports
 * @abstract
 * @class EventConstructor
 */
export abstract class EventConstructor {

    /**
     * Execute when the event is trigged.
     *
     * @abstract
     * @param {Discord.Client} client Provide the client of the bot
     * @returns {Function} Return the function that the event must execute
     * @memberof EventConstructor
     */
    public abstract execute(client: Discord.Client): Function

}
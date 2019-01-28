import { BotConstructor } from './../commons/DiscordBot'
import { Client, Message } from 'discord.js'

/*
 * This project is under MIT License
 * View LICENSE for more details
 *
 * Copyright (c) 2019 Maxime6678
 */

export class ConnectBot extends BotConstructor {

    constructor(token: string) {
        super(token)
    }

    onReady(client: Client) {
        console.log(`Login as ${client.user.tag}`)
    }

    onError(client: Client, error: Error) {
        console.log(`Error ${error.name}: ${error.message}`)
    }

}
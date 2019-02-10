import { RedisInstance } from './classes/Redis'
import { RedisClientType } from './commons/Redis'
import { ConnectBot } from './classes/Bot'
import { Game } from './commons/Game'
import { CreateCommand } from './commands/Create'
import { Language } from './utils/languages/Languages'
import { InviteCommand } from './commands/Invite';

/*
 * This project is under MIT License
 * View LICENSE for more details
 *
 * Copyright (c) 2019 Maxime6678
 */

// Register lib & var
export var playingGame: Map<string, Game> = new Map<string, Game>()
export const language = new Language()

// Create instance of redis & bot
export const redisInstance = new RedisInstance(RedisClientType.NORMAL, process.env.REDIS_HOST, process.env.REDIS_PASSWORD, Number(process.env.REDIS_PORT), Number(process.env.REDIS_DATABASE), 'connect-four-discord')
export const connectBot = new ConnectBot(process.env.TOKEN)

// Register commands bot
connectBot.registerCommand('create', new CreateCommand())
connectBot.registerCommand('invite', new InviteCommand())

// Connect instance
redisInstance.connect()
connectBot.connect()
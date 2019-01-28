import { RedisInstance } from './classes/Redis'
import { RedisClientType } from './commons/Redis'
import { ConnectBot } from './classes/Bot'

/*
 * This project is under MIT License
 * View LICENSE for more details
 *
 * Copyright (c) 2019 Maxime6678
 */

export const redisInstance = new RedisInstance(RedisClientType.NORMAL, process.env.REDIS_HOST, process.env.REDIS_PASSWORD, Number(process.env.REDIS_PORT), 0, 'connect-four-discord')
export const connectBot = new ConnectBot(process.env.TOKEN)

redisInstance.connect()
connectBot.connect()
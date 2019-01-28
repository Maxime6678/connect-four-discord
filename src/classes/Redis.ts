import { RedisBuilder, RedisClientType } from './../commons/Redis'
import { Redis } from 'ioredis'

/*
 * This project is under MIT License
 * View LICENSE for more details
 *
 * Copyright (c) 2019 Maxime6678
 */

export class RedisInstance extends RedisBuilder {

    constructor(type: RedisClientType, host: string, password: string, port: number, database: number, name: string) {
        super(type, host, password, port, database, name)
    }

    onConnect(client: Redis) {
        console.log(`redis connected!`)
    }

    onReady(client: Redis) {
        console.log(`redis ready!`)
    }

    onError(client: Redis, err: string) {
        console.log(`redis error: ${err}`)
    }

}
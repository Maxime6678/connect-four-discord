import { User, TextChannel } from 'discord.js'
import * as debug from 'debug'
import { redisInstance, playingGame } from './../App';

/*
 * This project is under MIT License
 * View LICENSE for more details
 *
 * Copyright (c) 2019 Maxime6678
 */

export enum GameState {
    IN_SETTING, IN_WAIT, IN_GAME
}

export class Game {

    public readonly creator: User
    public readonly channel: TextChannel
    private guid: string
    public players: Map<string, User>
    public board: Board
    public maxPlayers: number = 2
    public gameState: GameState
    public x: number
    public y: number

    constructor(creator: User, channel: TextChannel, x: number, y: number) {
        this.guid = guidGenerator()
        while (playingGame.get(this.guid)) {
            this.guid = guidGenerator()
        }

        this.creator = creator
        this.channel = channel
        this.players = new Map<string, User>()
        this.players.set(creator.id, creator)
        this.x = x
        this.y = y
        this.board = new Board(this.x, this.y)
        this.gameState = GameState.IN_SETTING
    }

    public hasPlayer(player: User): boolean {
        return this.players.has(player.id)
    }

    public addPlayer(player: User): boolean {
        return (this.players.size < this.maxPlayers - 1) ? this.players.set(player.id, player) && true : false
    }

    public removePlayer(user: User): boolean {
        return this.hasPlayer(user) ? this.players.delete(user.id) && true : false
    }

    public play(player: User, x: number, y: number, callback: (err: Error) => void): void {
        let caseInstance = this.board.cases[x][y]
        if (caseInstance === undefined) return callback(new Error('Case not exist!'))
        if (caseInstance.state) return callback(new Error('Case already used!'))
        caseInstance.changeState(true, player)
        return callback(null)
    }

    public changeX(x: number): void {
        this.x = x
        this.resetBoard()
    }

    public changeY(y: number): void {
        this.y = y
        this.resetBoard()
    }

    public changeBoard(x: number, y: number): void {
        this.x = x
        this.y = y
        this.resetBoard()
    }

    public changeState(gameState: GameState): void {
        this.gameState = gameState
    }

    public getState(): GameState {
        return this.gameState
    }

    public getURLImage(): string {
        return `${process.env.API_ENDPOINT}${process.env.URI_BASE}/getBoard?settings=${encodeURI(this.getSetting())}&pos=${encodeURI(this.board.getCasesWithPlayer())}`
    }

    public getSetting(): string {
        let users = []
        this.players.forEach((player) => {
            users.push({
                id: player.id
            })
        })
        return JSON.stringify({
            playerInGame: this.players.size,
            users: users
        })
    }

    public getGuid(): string {
        return this.guid
    }

    private resetBoard(): void {
        this.board = new Board(this.x, this.y)
    }

}

export class Board {

    public cases: Case[][]

    constructor(x: number, y: number) {
        this.cases = []

        for (let i: number = 0; i < x; i++) {
            this.cases[i] = []
            for (let j: number = 0; j < y; j++) {
                this.cases[i][j] = new Case(i, j)
            }
        }
    }

    public getCasesWithPlayer(): string {
        let result = []
        for (let i: number = 0; i < this.cases.length; i++) {
            for (let j: number = 0; j < this.cases[i].length; j++) {
                if (this.cases[i][j].state) {
                    result.push(this.cases[i][j].getCoordUsed())
                }
            }
        }
        return JSON.stringify(result)
    }

}

export class Case {

    public state: boolean
    public owner: User
    public readonly x: number
    public readonly y: number

    constructor(x: number, y: number) {
        this.state = false
        this.owner = null
        this.x = x
        this.y = y
    }

    public changeState(state: boolean, player: User) {
        this.state = state
        this.owner = player
    }

    public getCoordUsed(): any {
        return {
            use: this.state,
            user: {
                id: this.owner.id
            },
            pos: {
                x: this.x,
                y: this.y
            }
        }
    }

}

function guidGenerator() {
    var S4 = function () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4() + S4() + S4());
}
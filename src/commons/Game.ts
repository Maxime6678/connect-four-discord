import { User, TextChannel } from 'discord.js'

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
    public players: Map<string, User>
    public board: Board
    public maxPlayers: number = 2
    public gameState: GameState
    public x: number
    public y: number

    constructor(creator: User, channel: TextChannel, x: number, y: number) {
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
        if (caseInstance) return callback(new Error('Case not exist!'))
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

    public getURLImage(): string {
        return `${process.env.API_ENDPOINT}/${process.env.URI_BASE}/getBoard?pos=${encodeURI(JSON.stringify(this.board.getCasesWithPlayer()))}`
    }

    private resetBoard(): void {
        this.board = new Board(this.x, this.y)
    }

    private onSetting(): void {
    }

}

export class Board {

    public cases: Case[][]

    constructor(x: number, y: number) {
        this.cases = []

        for (let i: number = 0; i < x; i++) {
            this.cases[i] = []
            for (let j: number = 0; j < y; j++) {
                this.cases[i][j] = new Case()
            }
        }
    }

    public getCasesWithPlayer(): any {
        let results = '{'
        for (let i: number = 0; i < this.cases.length; i++) {
            for (let j: number = 0; j < this.cases[i].length; j++) {
                if (this.cases[i][j].state) {
                    results += JSON.stringify(this.cases[i][j].getInfo())
                }
            }
        }
        return JSON.parse(results + '}')
    }

}

export class Case {

    public state: boolean
    public owner: User

    constructor() {
        this.state = false
        this.owner = null
    }

    public changeState(state: boolean, player: User) {
        this.state = state
        this.owner = player
    }

    public getInfo(): any {
        return {
            use: this.state,
            owner: this.owner
        }
    }

}
import { CommandConstructor } from './../commons/DiscordBot'
import { Client, Message, TextChannel, RichEmbed } from 'discord.js'
import { Game } from './../commons/Game'
import { redisInstance, playingGame, language } from './../App'
import { Languages, formatString } from './../utils/languages/Languages'

export class CreateCommand extends CommandConstructor {

    execute(client: Client, message: Message, args: string[]) {
        let game = new Game(message.author, <TextChannel>message.channel, 5, 5)
        playingGame.set(game.getGuid(), game)
        redisInstance.set('player:' + message.author.id, game.getGuid())
        let embed = new RichEmbed()
            .setColor(0xA28009)
            .setTitle(language.getLabel(Languages.ENGLISH, 'gameCreated'))
            .setDescription(language.getLabel(Languages.ENGLISH, 'gameCreatedDesc') + '\n ឵឵ ឵឵')
            .addField(language.getLabel(Languages.ENGLISH, 'globalSettings'), language.getLabel(Languages.ENGLISH, 'globalSettingsDesc') + '\n ឵឵ ឵឵')
            .addField(language.getLabel(Languages.ENGLISH, 'globalBoard'),
                `\`${game.x}x${game.y}\``, true)
            .addField(language.getLabel(Languages.ENGLISH, 'globalMaxPlayers'),
                `\`${game.maxPlayers}\`` + '\n ឵឵ ឵឵', true)
            .setFooter(formatString(language.getLabel(Languages.ENGLISH, 'globalGuid'), game.getGuid()))
        message.channel.send(embed)
    }

}
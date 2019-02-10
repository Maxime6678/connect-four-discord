import { CommandConstructor } from './../commons/DiscordBot'
import { Client, Message, TextChannel, RichEmbed, Channel } from 'discord.js'
import { language, redisInstance, playingGame } from '../App'
import { Languages, formatString } from '../utils/languages/Languages'

export class InviteCommand extends CommandConstructor {

    execute(client: Client, message: Message, args: string[]) {
        if (message.channel.type != "text") return message.channel.send(formatString(language.getLabel(Languages.ENGLISH, 'commandCannotSendInDM'), message.author))

        if (!message.isMemberMentioned) return message.channel.send(formatString(language.getLabel(Languages.ENGLISH, 'inviteCommandError'), message.author))
        let userMentioned = message.mentions.users.first()
        if (!userMentioned) return message.channel.send(formatString(language.getLabel(Languages.ENGLISH, 'tagUser'), message.author))
        if (userMentioned.id == message.channel.id) return message.channel.send(formatString(language.getLabel(Languages.ENGLISH, 'cannotInviteYourself'), message.author))

        redisInstance.get('player:' + message.author.id, (err: Error, res: string) => {
            if (err) return message.channel.send(formatString(language.getLabel(Languages.ENGLISH, 'errorOccurred'), message.author))
            if (res == null) return message.channel.send(formatString(language.getLabel(Languages.ENGLISH, 'youAreNotInGame'), message.author))
            let game = playingGame.get(res)
            if (!game) return message.channel.send(formatString(language.getLabel(Languages.ENGLISH, 'errorOccurred'), message.author))
            if (game.creator.id != message.author.id) return message.channel.send(formatString(language.getLabel(Languages.ENGLISH, 'youAreNotCreator'), message.author))
            if (game.players.size + 1 > game.maxPlayers) return message.channel.send(formatString(language.getLabel(Languages.ENGLISH, 'maxPlayerReach'), message.author))

            redisInstance.get('player:' + userMentioned.id, (err: Error, res: string) => {
                if (err) return message.channel.send(formatString(language.getLabel(Languages.ENGLISH, 'errorOccurred'), message.author))
                if (res) return message.channel.send(formatString(language.getLabel(Languages.ENGLISH, 'playerAlreadyGame'), message.author))

                let embed = new RichEmbed()
                    .setColor(0x80FF80)
                    .setTitle(language.getLabel(Languages.ENGLISH, 'inviteSend'))
                    .addField(language.getLabel(Languages.ENGLISH, 'globalUser'),
                        userMentioned, true)
                    .addField(language.getLabel(Languages.ENGLISH, 'globalInviteExpire'),
                        '60 seconds' + '\n ឵឵ ឵឵', true)
                    .addField(language.getLabel(Languages.ENGLISH, 'globalInviteExpire'),
                        language.getLabel(Languages.ENGLISH, 'globalWait'))
                message.channel.send(embed).then((msg: Message) => {
                    embed = new RichEmbed()
                        .setColor(0xA28009)
                        .setTitle(language.getLabel(Languages.ENGLISH, 'inviteReceive'))
                        .addField(language.getLabel(Languages.ENGLISH, 'globalCreator'),
                            message.author.tag, true)
                        .addField(language.getLabel(Languages.ENGLISH, 'globalPlayers'),
                            'In comming', true)
                        .addField(language.getLabel(Languages.ENGLISH, 'globalChannel'),
                            message.channel + '\n ឵឵ ឵឵', false)
                        .addField(language.getLabel(Languages.ENGLISH, 'globalSettings'),
                            language.getLabel(Languages.ENGLISH, 'globalSettingsDescOther'))
                        .addField(language.getLabel(Languages.ENGLISH, 'globalBoard'),
                            `\`${game.x}x${game.y}\``, true)
                        .addField(language.getLabel(Languages.ENGLISH, 'globalMaxPlayers'),
                            `\`${game.maxPlayers}\`` + '\n ឵឵ ឵឵', true)
                        .addField(language.getLabel(Languages.ENGLISH, 'globalJoining'),
                            language.getLabel(Languages.ENGLISH, 'globalJoiningText'))
                    userMentioned.send(embed).then((msg2: Message) => {
                        redisInstance.setex('invite:' + userMentioned.id, 60, JSON.stringify({ guid: game.getGuid(), embedId: msg.id, dmId: msg2.id }), (err: Error) => {
                            if (err) {
                                msg.delete()
                                msg2.delete()
                                return message.channel.send(formatString(language.getLabel(Languages.ENGLISH, 'errorOccurred'), message.author))
                            }
                        })
                    })
                })
            })

        })
    }

}
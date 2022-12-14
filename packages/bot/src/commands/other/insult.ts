import { ApplyOptions } from '@sapphire/decorators';
import {
  ApplicationCommandRegistry,
  Command,
  CommandOptions
} from '@sapphire/framework';
import { CommandInteraction, MessageEmbed } from 'discord.js';
import axios from 'axios';
import Logger from '../../lib/utils/logger';

@ApplyOptions<CommandOptions>({
  name: 'insult',
  description: 'Replies with a mean insult',
  preconditions: ['isCommandDisabled']
})
export class InsultCommand extends Command {
  public override chatInputRun(interaction: CommandInteraction) {
    axios
      .get('https://evilinsult.com/generate_insult.php?lang=en&type=json')
      .then(async response => {
        const insult: string = response.data.insult;
        const embed = new MessageEmbed()
          .setColor('#E41032')
          .setAuthor({
            name: 'Evil Insult',
            url: 'https://evilinsult.com',
            iconURL: 'https://i.imgur.com/bOVpNAX.png'
          })
          .setDescription(insult)
          .setTimestamp()
          .setFooter({
            text: 'Powered by evilinsult.com'
          });
        return await interaction.reply({ embeds: [embed] });
      })
      .catch(async error => {
        Logger.error(error);
        return await interaction.reply(
          'Something went wrong when fetching an insult :('
        );
      });
  }

  public override registerApplicationCommands(
    registry: ApplicationCommandRegistry
  ): void {
    registry.registerChatInputCommand({
      name: this.name,
      description: this.description
    });
  }
}

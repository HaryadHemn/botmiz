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
  name: 'advice',
  description: 'Get some advice!',
  preconditions: ['isCommandDisabled']
})
export class AdviceCommand extends Command {
  public override async chatInputRun(interaction: CommandInteraction) {
    axios
      .get('https://api.adviceslip.com/advice')
      .then(async response => {
        const advice: string = response.data.slip.advice;
        const embed = new MessageEmbed()
          .setColor('#403B3A')
          .setAuthor({
            name: 'Advice Slip',
            url: 'https://adviceslip.com/',
            iconURL: 'https://i.imgur.com/8pIvnmD.png'
          })
          .setDescription(advice)
          .setTimestamp()
          .setFooter({
            text: 'Powered by adviceslip.com'
          });

        return await interaction.reply({ embeds: [embed] });
      })
      .catch(async error => {
        Logger.error(error);
        return await interaction.reply(
          'Something went wrong when asking for advice :('
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

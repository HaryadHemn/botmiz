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
  name: 'chucknorris',
  description: 'Get a satirical fact about Chuck Norris!',
  preconditions: ['isCommandDisabled']
})
export class ChuckNorrisCommand extends Command {
  public override chatInputRun(interaction: CommandInteraction) {
    axios
      .get('https://api.chucknorris.io/jokes/random')
      .then(async response => {
        const embed = new MessageEmbed()
          .setColor('#CD7232')
          .setAuthor({
            name: 'Chuck Norris',
            url: 'https://chucknorris.io',
            iconURL: response.data.icon_url
          })
          .setDescription(response.data.value)
          .setTimestamp()
          .setFooter({
            text: 'Powered by chucknorris.io'
          });
        return interaction.reply({ embeds: [embed] });
      })
      .catch(async error => {
        Logger.error(error);
        return await interaction.reply(
          ':x: An error occured, Chuck is investigating this!'
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

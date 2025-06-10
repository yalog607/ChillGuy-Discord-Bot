const { SlashCommandBuilder } = require("discord.js");
const { useQueue, useTimeline } = require("discord-player");

const data = new SlashCommandBuilder()
  .setName("resume") // Command name
  .setDescription("Resume the currently playing song"); // Command description

module.exports = {
  data,
  async execute(interaction) {
    // Get the queue's timeline
    const timeline = useTimeline({
      node: interaction.guild,
    });

    if (!timeline) {
      return interaction.reply(
        "This server does not have an active player session."
      );
    }

    // Invert the pause state
    const wasPaused = timeline.paused;
    if (wasPaused) timeline.resume();

    // If the timeline was previously paused, the queue is now back to playing
    return interaction.reply(`The player is now playing'}.`);
  },
};

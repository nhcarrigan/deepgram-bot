import { Context } from "../interfaces/Context";

export const help: Context = {
  data: {
    name: "help",
    type: 3,
  },
  run: async (bot, interaction) => {
    await interaction.editReply("Coming soon!");
  },
};

import { ResponseText } from "../config/ResponseText";
import { Context } from "../interfaces/Context";
import { errorHandler } from "../utils/errorHandler";

export const productBoard: Context = {
  data: {
    name: "Send to Product Board",
    type: 3,
  },
  run: async (bot, interaction) => {
    try {
      if (!process.env.PRODUCT_BOARD_API_KEY) {
        await interaction.editReply({
          content: "Product Board API is not configured.",
        });
        return;
      }
      const { member } = interaction;

      if (!bot.env.helperRoles.some((r) => member.roles.cache.has(r))) {
        await interaction.editReply({
          content: ResponseText.MustBeHelper,
        });
        return;
      }

      const message = interaction.options.getMessage("message");
      if (!message) {
        await interaction.editReply({
          content: ResponseText.NoMessage,
        });
        return;
      }
      const { content, author } = message;

      const req = await fetch("https://api.productboard.com/notes", {
        headers: {
          authorization: `Bearer ${process.env.PRODUCT_BOARD_API_KEY}`,
          "X-Version": "1",
          accept: "application/json; charset=utf-8",
          "content-type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          title: `${author.username}'s Feedback`,
          content,
          display_url: message.url,
        }),
      });
      const res = (await req.json()) as { links: { html: string } };
      await interaction.editReply({
        content: `[Note created](<${res.links.html}>)`,
      });
    } catch (err) {
      await errorHandler(bot, "product board context", err);
      await interaction.editReply({
        content: ResponseText.InteractionError,
      });
    }
  },
};

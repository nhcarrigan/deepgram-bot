// import fetch from "node-fetch";

import { ResponseText } from "../config/ResponseText";
import { AiEndpoint } from "../interfaces/AiEndpoint";
import { ExtendedClient } from "../interfaces/ExtendedClient";
import { errorHandler } from "../utils/errorHandler";

/**
 * Sends a request to the AI server, then returns the appropriate response.
 *
 * @param {ExtendedClient} bot The bot's Discord instance.
 * @param {AiEndpoint} endpoint The endpoint to make a request to.
 * @param {string} question The question asked by the user.
 * @param {string} response The AI response to evaluate, if applicable.
 * @returns {Promise<string>} For a response request, returns the AI's response. For a confirm or deny request, returns a confirmation message.
 */
export const makeAiRequest = async (
  bot: ExtendedClient,
  endpoint: AiEndpoint,
  question: string,
  response?: string
): Promise<string> => {
  try {
    const url = process.env.AI_URL;
    if (!url) {
      return ResponseText.NoAiUrl;
    }
    if (endpoint === "response") {
      // const req = await fetch(url + endpoint, {
      //   method: "POST",
      //   headers: {
      //     "content-type": "application/json",
      //   },
      //   body: JSON.stringify({ question }),
      // });
      // const res = await req.json();
      // return res.response;
      return "This is where the AI would generate a response.";
    }
    if (!response) {
      return ResponseText.NoAiResponseArg;
    }
    //   await fetch(url + endpoint, {
    //     method: "POST",
    //     headers: {
    //       "content-type": "application/json",
    //     },
    //     body: JSON.stringify({ question, response }),
    //   });
    return endpoint === "confirm"
      ? ResponseText.ConfirmButton
      : ResponseText.InaccurateButton;
  } catch (err) {
    await errorHandler(bot, "make ai request module", err);
    return "err";
  }
};

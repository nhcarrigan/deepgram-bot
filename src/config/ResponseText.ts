/**
 * This object controls the bot's responses to things like commands. They
 * are stored here to facilitate contributions when a message needs to be
 * reworded.
 */
export enum ResponseText {
  MustBeHelper = "This command can only be used by our server helpers.",
  MustBeHelperButton = "Only server helpers can mark a message as inaccurate.",
  MustBeHelperOrAuthor = "Only server helpers or the original question author may mark a message as helpful.",
  NoMessage = "There was an error loading the message. Please try again later.",
  HelpSuccess = "The question has been moved to the help forum.",
  NoAiUrl = "The AI has not been configured.",
  NoAiResponseArg = "You must provide a response to confirm or deny.",
  ConfirmButton = "Thanks for confirming! Your feedback helps us improve our AI responses.",
  InaccurateButton = "Thanks for marking this response as inaccurate. Your feedback helps us improve our AI responses.",
  InteractionError = "There was an error processing your request.",
  MemberError = "There was an error loading your user record. Please try again later.",
  NoCommand = "This command is not available.",
  NoGuild = "This command can only be used in a server.",
}

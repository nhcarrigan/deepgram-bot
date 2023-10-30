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
  NoChannel = "Could not load the channel data. Please try again.",
  NoOP = "Could not load original thread post. Please try again.",
  MustBeHelpChannel = "Messages can only be marked as an answer in the help forum channel.",
  AlreadyAnswered = "This thread has already been marked as answered.",
  AnswerFailed = "This question has been flagged as answered on Discord, but could not be migrated to the discussion channel. Please migrate manually.",
  AnswerSuccess = "This question has been flagged as answered!",
  MovedThread = "Please make sure to respond in this thread with as much detail about your question as possible. This will help us better provide you support.",
  CreatedThread = "Thanks for asking your question. Please be sure to reply with as much detail as possible so we can assist you efficiently.",
}

/**
 * This is separate so that the environment value can be interpolated.
 */
export const StickyMessage = `A friendly reminder to everyone that questions should be asked in <#${process.env.HELP_CHANNEL_ID}>`;

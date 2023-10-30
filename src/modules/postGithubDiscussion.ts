import { graphql } from "@octokit/graphql";

import { ExtendedClient } from "../interfaces/ExtendedClient";
import { errorHandler } from "../utils/errorHandler";

/**
 * Posts an answered thread to a GitHub discussion.
 *
 * @param {ExtendedClient} bot The bot's Discord instance.
 * @param {string} title The thread title.
 * @param {string} question The original question.
 * @param {string} answer The flagged answer.
 * @returns {boolean} True if the post is created.
 */
export const postGithubDiscussion = async (
  bot: ExtendedClient,
  title: string,
  question: string,
  answer: string
): Promise<boolean> => {
  try {
    const {
      GITHUB_TOKEN: token,
      GITHUB_OWNER: owner,
      GITHUB_REPO: repo,
    } = process.env;
    if (!token || !owner || !repo) {
      await bot.env.debugHook.send({
        content: "Missing GitHub environment variables.",
      });
      return false;
    }

    const github = graphql.defaults({
      headers: {
        authorization: `token ${token}`,
      },
    });

    const repoQuery: {
      repository: {
        id: string;
        discussionCategories: { nodes: { id: string; name: string }[] };
        labels: { nodes: { id: string; name: string }[] };
      };
    } = await github(`
        {
            repository(owner: "${owner}", name: "${repo}") {
                id
                discussionCategories(first: 10) {
                  nodes {
                    id
                    name
                  }
                }
                labels(first: 50) {
                  nodes {
                    id
                    name
                  }
                }
            }
        }
      `);

    const category = repoQuery.repository.discussionCategories.nodes.find(
      (n) => n.name === "Q&A"
    );
    const label = repoQuery.repository.labels.nodes.find(
      (label) => label.name.toLowerCase() === "discord"
    );

    if (!category) {
      await bot.env.debugHook.send({
        content: "Could not find the expected discussion category.",
      });
      return false;
    }

    const discussionQuery: {
      createDiscussion: { discussion: { id: string } };
    } = await github(`
        mutation {
        createDiscussion(input: 
            { 
            repositoryId: "${repoQuery.repository.id}", 
            categoryId: "${category.id}", 
            body: "${question}", 
            title: "${title}"}
        ) { 
            discussion { id } 
            }
        }`);

    const discussionId = discussionQuery.createDiscussion.discussion.id;

    const commentQuery: { addDiscussionComment: { comment: { id: string } } } =
      await github(`
        mutation {
            addDiscussionComment(input: {
                discussionId: "${discussionId}",
                body: "${answer}"
            }) {
                comment {
                id
                }
            }
        }
        `);

    const commentId = commentQuery.addDiscussionComment.comment.id;

    const answerQuery: {
      markDiscussionCommentAsAnswer: { discussion: { isAnswered: boolean } };
    } = await github(`
        mutation {
          markDiscussionCommentAsAnswer(input: {
              id: "${commentId}"
          }) {
              discussion {
                  isAnswered
              }
          }
        }
      `);

    if (label) {
      await github(`
      mutation {
        addLabelsToLabelable(input:{
          labelableId: "${discussionId}",
          labelIds: ["${label.id}"]
        }) {
          clientMutationId
        }
      }
      `);
    }
    return answerQuery.markDiscussionCommentAsAnswer.discussion.isAnswered;
  } catch (err) {
    await errorHandler(bot, "post github discussion", err);
    return false;
  }
};

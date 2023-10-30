import { graphql } from "@octokit/graphql";

import { ExtendedClient } from "../interfaces/ExtendedClient";
import { errorHandler } from "../utils/errorHandler";

interface Post {
  content: string;
  author: string;
}

const formatPost = (post: Post) =>
  `${post.content}\n\n> Posted by ${post.author}`;

/**
 * Posts an answered thread to a GitHub discussion.
 *
 * @param {ExtendedClient} bot The bot's Discord instance.
 * @param {string} title The thread title.
 * @param {Post} question The original question.
 * @param {Post} answer The flagged answer.
 * @returns {boolean} True if the post is created.
 */
export const postGithubDiscussion = async (
  bot: ExtendedClient,
  title: string,
  question: Post,
  answer: Post
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
            }
        }
      `);

    const categoryId = repoQuery.repository.discussionCategories.nodes.find(
      (n) => n.name === "Q&A"
    );

    if (!categoryId) {
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
            categoryId: "${categoryId.id}", 
            body: "${formatPost(question)}", 
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
                body: "${formatPost(answer)}"
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
    return answerQuery.markDiscussionCommentAsAnswer.discussion.isAnswered;
  } catch (err) {
    await errorHandler(bot, "post github discussion", err);
    return false;
  }
};

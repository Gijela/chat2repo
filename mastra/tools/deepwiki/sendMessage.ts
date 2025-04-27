import { Tool } from '@mastra/core/tools';
import { z } from 'zod';

const inputSchema = z.object({
  // isFirstQuery: z.boolean().describe('Whether this is the first query.'),
  repo_name: z
    .string()
    .describe("The name of the repository (e.g., 'owner/repo')."),
  user_prompt: z.string().describe("The user's query or prompt."),
});

const outputSchema = z.object({
  data: z.any().describe('The response data from the API.'),
  error: z
    .string()
    .optional()
    .describe('An error message, if the operation failed.'),
});

export const sendMessage = new Tool({
  id: 'send_message',
  description: 'Sends a message to the DeepWiki API.',
  inputSchema,
  outputSchema,
  execute: async ({ context, runId }) => {
    console.log('🚀 ~ execute: ~ runId:', runId);
    const { repo_name, user_prompt } = context;

    try {
      const response = await fetch('https://api.devin.ai/ada/query', {
        method: 'POST',
        headers: {
          accept: '*/*',
          'content-type': 'application/json',
          origin: 'https://deepwiki.com',
          referer: 'https://deepwiki.com/',
          'user-agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36',
        },
        body: JSON.stringify({
          engine_id: 'multihop',
          user_query: user_prompt,
          keywords: [],
          repo_names: [repo_name],
          additional_context: '',
          query_id:
            '-1-ascii-2-3_3556fa63-aae5-4f1f-b85c-11a8be8113da' || runId,
          use_notes: false,
        }),
      });

      const data = await response.json();
      return { data };
    } catch (error) {
      console.error('Error sending message:', error);
      return {
        error:
          error instanceof Error ? error.message : 'Failed to send message',
      };
    }
  },
});

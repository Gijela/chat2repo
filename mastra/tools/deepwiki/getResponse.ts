import { Tool } from '@mastra/core/tools';
import { z } from 'zod';

const outputSchema = z.object({
  data: z.any().describe('The response data from the API.'),
  error: z
    .string()
    .optional()
    .describe('An error message, if the operation failed.'),
});

export const getResponse = new Tool({
  id: 'get_response',
  description: 'Gets the response from DeepWiki API using a query ID.',
  outputSchema,
  execute: async ({ runId }) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/deepwiki/getResponse`,
        {
          method: 'POST',
          headers: {
            accept: 'application/json',
          },
          body: JSON.stringify({
            query_id: '-1-ascii-2-3_3556fa63-aae5-4f1f-b85c-11a8be8113da' || runId,
          }),
        },
      );

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting response:', error);
      return {
        error:
          error instanceof Error ? error.message : 'Failed to get response',
      };
    }
  },
});

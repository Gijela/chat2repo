import { Agent } from '@mastra/core/agent';
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';

// import { githubMCP } from '../mcp/github';
import { instructions } from './instructions';
import { sendMessage } from '../tools/deepwiki/sendMessage';
import { getResponse } from '../tools/deepwiki/getResponse';

const deepseek = createOpenAICompatible({
  baseURL: 'https://api.deepseek.com/v1',
  name: 'deepseek',
  headers: {
    Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
  },
});
const model = deepseek.chatModel('deepseek-chat') as any;

// const githubTools = await githubMCP.getTools();

export const agent = new Agent({
  name: 'agent',
  instructions,
  model,
  tools: { sendMessage, getResponse },
});

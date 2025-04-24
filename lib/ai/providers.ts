import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from 'ai';
import { xai } from '@ai-sdk/xai';
import { isTestEnvironment } from '../constants';
import {
  artifactModel,
  chatModel,
  reasoningModel,
  titleModel,
} from './models.test';

import { createOpenAICompatible } from '@ai-sdk/openai-compatible';

const deepseek = createOpenAICompatible({
  baseURL: 'https://api.deepseek.com/v1',
  name: 'deepseek',
  headers: {
    Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
  },
});
const deepseekChatModel = deepseek.chatModel('deepseek-chat') as any;

export const myProvider = isTestEnvironment
  ? customProvider({
      languageModels: {
        'chat-model': deepseekChatModel,
        'chat-model-reasoning': deepseekChatModel,
        'title-model': deepseekChatModel,
        'artifact-model': deepseekChatModel,
      },
    })
  : customProvider({
      languageModels: {
        'chat-model': deepseekChatModel,
        'chat-model-reasoning': wrapLanguageModel({
          model: deepseekChatModel,
          middleware: extractReasoningMiddleware({ tagName: 'think' }),
        }),
        'title-model': deepseekChatModel,
        'artifact-model': deepseekChatModel,
      },
      imageModels: {
        'small-model': deepseekChatModel,
      },
    });

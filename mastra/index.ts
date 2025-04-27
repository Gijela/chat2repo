import { Mastra } from '@mastra/core/mastra';
import { createLogger } from '@mastra/core/logger';

import { agent } from './agent';

export const mastra = new Mastra({
  agents: { agent },
  logger: createLogger({ level: 'debug' }),
});

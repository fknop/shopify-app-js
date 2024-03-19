import isbot from 'isbot';

import type {BasicParams} from '../../types';

export function respondToBotRequest(
  {logger}: BasicParams,
  request: Request,
): void | never {
  if (isbot(request.headers.get('User-Agent'))) {
    logger.debug('Request is from a bot, skipping auth');
    throw new Response(undefined, {status: 410, statusText: 'Gone'});
  }
}

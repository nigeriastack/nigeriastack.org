import { createServerFn } from '@tanstack/react-start';
export const getPage = createServerFn({ method: 'GET' }).validator((input: {path: string; query: string}) => input).handler(async ({data}) => { const { buildPage } = await import('./content.server'); return buildPage(data.path, data.query); });

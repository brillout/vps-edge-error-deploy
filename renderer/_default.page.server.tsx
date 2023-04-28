import { generateHydrationScript, renderToStream, renderToStringAsync } from "solid-js/web";
import { PageLayout } from "./PageLayout";
import {
  escapeInject,
  dangerouslySkipEscape,
  stampPipe,
} from "vite-plugin-ssr/server";
import { PageContext } from "./types";
import logoUrl from "./logo.svg";

export { render };
export { passToClient };

// See https://vite-plugin-ssr.com/data-fetching
const passToClient = ["pageProps", "documentProps"];

async function render(pageContext: PageContext) {
  const app = await renderToStringAsync(() => (
    <PageLayout pageContext={pageContext} />
  ));

  // See https://vite-plugin-ssr.com/head
  const { documentProps } = pageContext;
  const title = (documentProps && documentProps.title) || "Vite SSR app";
  const description =
    (documentProps && documentProps.description) ||
    "App using Vite + vite-plugin-ssr";

  return escapeInject`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <link rel="icon" href="${logoUrl}" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="${description}" />
        <title>${title}</title>
        ${dangerouslySkipEscape(generateHydrationScript())}
      </head>
      <body>
        <div id="page-view">${app}</div>
      </body>
    </html>`;
}

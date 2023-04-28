import { renderPage } from "vite-plugin-ssr";
import { RequestContext } from "@vercel/edge";

export const config = {
  runtime: "edge",
  regions: ["iad1"],
};

export default async (request: Request, ctx: RequestContext) => {
  const { url } = request;
  console.log("Request to url:", url);

  const pageContextInit = { url };
  const pageContext = await renderPage(pageContextInit);
  const { httpResponse } = pageContext;

  if (!httpResponse) {
    return new Response(null, {
      status: 200,
    });
  }

  return new Response(httpResponse.body, {
    status: httpResponse.statusCode,
    headers: {
      "content-type": httpResponse.contentType,
    },
  });
};

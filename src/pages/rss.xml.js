import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { SITE_TITLE, SITE_DESCRIPTION } from "../lib/constants";

export async function GET(context) {
  const posts = await getCollection("posts", ({ data }) => !data.draft);
  posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description ?? post.body?.slice(0, 200),
      link: `/posts/${post.id}/`,
    })),
    customData: `<language>zh-CN</language>`,
  });
}

export interface NewsArticleItem {
  title: string;
  source: string;
  date?: string;
  url?: string;
}

export async function fetchLiveNews(
  company: string,
  ticker: string,
  isDemo = false
): Promise<{ articles: NewsArticleItem[]; sourceLabel: string }> {
  if (isDemo) {
    return {
      articles: [],
      sourceLabel: 'DEMO DATA (Sample Intelligence Archive)',
    };
  }

  // 1. Check if optional NEWS_API_KEY is available
  const apiKey = process.env.NEWS_API_KEY;
  if (apiKey && apiKey !== 'MY_NEWS_API_KEY' && apiKey.trim() !== '') {
    try {
      const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(
        company
      )}&sortBy=publishedAt&pageSize=5&apiKey=${apiKey}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      const resp = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (resp.ok) {
        const data = await resp.json();
        if (Array.isArray(data.articles) && data.articles.length > 0) {
          const articles: NewsArticleItem[] = data.articles
            .slice(0, 5)
            .map((a: any) => ({
              title: a.title,
              source: a.source?.name || 'NewsAPI Feed',
              date: a.publishedAt,
              url: a.url,
            }));
          return { articles, sourceLabel: 'Live News Feed (NewsAPI)' };
        }
      }
    } catch {
      // Gracefully fall through to public RSS feed
    }
  }

  // 2. Alternative publicly accessible source (No API key required)
  try {
    const query = `${company} stock`;
    const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(
      query
    )}&hl=en-US&gl=US&ceid=US:en`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const resp = await fetch(rssUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (resp.ok) {
      const text = await resp.text();
      const articles: NewsArticleItem[] = [];
      const itemMatches = text.matchAll(/<item>([\s\S]*?)<\/item>/g);

      for (const match of itemMatches) {
        const itemXml = match[1];
        const titleMatch = itemXml.match(/<title>([\s\S]*?)<\/title>/);
        const sourceMatch = itemXml.match(/<source[^>]*>([\s\S]*?)<\/source>/);
        const pubDateMatch = itemXml.match(/<pubDate>([\s\S]*?)<\/pubDate>/);
        const linkMatch = itemXml.match(/<link>([\s\S]*?)<\/link>/);

        if (titleMatch) {
          const cleanTitle = titleMatch[1]
            .replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1')
            .trim();
          const cleanSource = sourceMatch
            ? sourceMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1').trim()
            : 'Public Financial News';
          const pubDate = pubDateMatch ? pubDateMatch[1].trim() : undefined;
          const link = linkMatch ? linkMatch[1].trim() : undefined;

          articles.push({
            title: cleanTitle,
            source: cleanSource,
            date: pubDate,
            url: link,
          });
        }
        if (articles.length >= 5) break;
      }

      if (articles.length > 0) {
        return {
          articles,
          sourceLabel: 'Live Public News Feed (Google News RSS)',
        };
      }
    }
  } catch {
    // Silently fall through if public feed is unreachable
  }

  // 3. If live news feed fails or unavailable, clearly return empty with fallback label
  return {
    articles: [],
    sourceLabel: 'Public Regulatory Disclosures & SEC/NSE Registries',
  };
}

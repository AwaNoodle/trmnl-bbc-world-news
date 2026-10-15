// Normalizes the BBC RSS/XML response back to the flat `items` / `feed`
// shape the markup already expects, so no template changes are needed.
//
//   rss.channel.item[]  ->  items[]
//   rss.channel.image   ->  feed.image

function normalizeRss(input) {
  var channel = (input && input.rss && input.rss.channel) || {};

  var raw = channel.item || [];
  if (!Array.isArray(raw)) raw = [raw];

  var items = raw.map(function (it) {
    return {
      title: it.title || '',
      description: it.description || '',
      pubDate: it.pubDate || '',
      link: it.link || '',
      thumbnail: (it.thumbnail && it.thumbnail.url) || ''
    };
  });

  var image = channel.image || {};
  var link = channel.link;
  if (Array.isArray(link)) link = link[0];

  return {
    items: items,
    feed: {
      title: channel.title || '',
      description: channel.description || '',
      link: link || '',
      image: image.url || '',
      lastBuildDate: channel.lastBuildDate || ''
    }
  };
}

// default runtime entry point
function transform(input) {
  try {
    return normalizeRss(input);
  } catch (e) {
    return input;
  }
}

// serverless runtime entry point (same logic, whichever runtime is active)
function run(input) {
  try {
    return normalizeRss(input);
  } catch (e) {
    return input;
  }
}

// Remove { Dict, Query } if not using TypeScript
import mixpanel, { Dict, Query } from "mixpanel-browser";

const isProd = process.env.NODE_ENV === "production";

mixpanel.init(`${process.env.MIXPANEL_TOKEN}`, {
  api_host: `${process.env.SITE_URL}/mp`,
});

export const Mixpanel = {
  identify: (id: string) => {
    mixpanel.identify(id);
  },
  alias: (id: string) => {
    mixpanel.alias(id);
  },
  track: (name: string, props?: Dict) => {
    mixpanel.track(name, props);
  },
  track_links: (query: Query, name: string) => {
    mixpanel.track_links(query, name, {
      referrer: document.referrer,
    });
  },
  people: {
    set: (props: Dict) => {
      mixpanel.people.set(props);
    },
  },
};
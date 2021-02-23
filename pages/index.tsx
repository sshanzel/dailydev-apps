import React, { ReactElement } from 'react';
import { ANONYMOUS_FEED_QUERY, FEED_QUERY } from '../graphql/feed';
import MainFeedPage, {
  getMainFeedLayout,
  mainFeedLayoutProps,
} from '../components/layouts/MainFeedPage';
import { NextSeoProps } from 'next-seo/lib/types';
import { defaultOpenGraph, defaultSeo } from '../next-seo';
import { NextSeo, SiteLinksSearchBoxJsonLd } from 'next-seo';

const seo: NextSeoProps = {
  title: 'daily.dev | All-in-one coding news reader',
  titleTemplate: '%s',
  openGraph: { ...defaultOpenGraph },
  ...defaultSeo,
};

const Home = (): ReactElement => {
  return (
    <>
      <NextSeo {...seo} />
      <SiteLinksSearchBoxJsonLd
        url="https://app.daily.dev"
        potentialActions={[
          {
            target: 'https://app.daily.dev/search?q',
            queryInput: 'search_term_string',
          },
        ]}
      />
      <MainFeedPage query={ANONYMOUS_FEED_QUERY} queryIfLogged={FEED_QUERY} />
    </>
  );
};

Home.getLayout = getMainFeedLayout;
Home.layoutProps = mainFeedLayoutProps;

export default Home;

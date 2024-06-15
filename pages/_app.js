// import node module libraries
import Head from 'next/head';
import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';
import SSRProvider from 'react-bootstrap/SSRProvider';
import { AuthContextProvider } from '../context/AuthContext';

// import theme style scss file
import 'styles/theme.scss';

// import default layouts
import DefaultDashboardLayout from 'layouts/DefaultDashboardLayout';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const pageURL = process.env.baseURL + router.pathname;
  const title = 'Tripnary';
  const description =
    'Tripnary es una aplicación que te ayuda a planificar tus viajes de manera fácil y rápida.';
  const keywords =
    'web app, multipurpose, trip, travel, trip planner, travel app, travel organizer, journey scheduler, itinerary builder, destination explorer, restaurant finder, global travel guide, travel recommendations, restaurant recommendations, travel tips, sightseeing suggestions, adventure planning, cultural etiquette, local events, food experiences, transportation options, travel safety, travel reviews';

  return (
    <SSRProvider>
      <Head>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <meta name='keywords' content={keywords} />
        <link rel='shortcut icon' href='/favicon.ico' type='image/x-icon' />
      </Head>
      <NextSeo
        title={title}
        description={description}
        canonical={pageURL}
        openGraph={{
          url: pageURL,
          title: title,
          description: description,
          site_name: process.env.siteName,
        }}
      />

      <AuthContextProvider>
        <Component {...pageProps} />{' '}
      </AuthContextProvider>
    </SSRProvider>
  );
}

export default MyApp;

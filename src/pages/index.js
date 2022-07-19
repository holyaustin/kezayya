import React from 'react';
import { ThemeProvider } from 'theme-ui';
import theme from 'theme';
import SEO from 'components/seo';
import Layout from 'components/layout';
import Banner from 'sections/banner';
import Services from 'sections/services';
import PremiumFeature from 'sections/premium-feature';
import UltimateFeatures from 'sections/ultimate-feature';
import CustomerSupport from 'sections/customer-support';
import Pricing from 'sections/pricing';
import Testimonials from 'sections/testimonials';
import Blog from 'sections/blog';
import Faq from 'sections/faq';
import Support from 'sections/support';

export default function IndexPage() {
  return (
    <ThemeProvider theme={theme}>
      <Layout>
        <SEO
          title="Startup hosting provider landing"
          description="Collection of free top of the line startup landing templates built using react/ next js. Free to download, simply edit and deploy! Updated weekly!"
        />
        <Banner />
        <Services />
        <PremiumFeature />
        <UltimateFeatures />
        <CustomerSupport />
        <Pricing />
        <Testimonials />
        <Blog />
        <Faq />
        <Support />
      </Layout>
    </ThemeProvider>
  );
}

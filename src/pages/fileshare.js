import React from 'react';
import { ThemeProvider } from 'theme-ui';
import theme from 'theme';
import SEO from 'components/seo';
import Layout from 'components/layout2';
import Share from 'components/share';

export default function Dashboard() {
  return (
    <ThemeProvider theme={theme}>
      <Layout>
        <SEO
          title="P2P File Share"
          description="Share file"
        />
        <Share/>
      </Layout>
    </ThemeProvider>
  );
}
import * as React from 'react';

import { CardPageProps } from '@fluentui/react-examples/lib/react-cards/Card/Card.doc';
import { DemoPage } from '../DemoPage';

export const CardPage = (props: { isHeaderVisible: boolean }) => (
  <DemoPage
    jsonDocs={require('@fluentui/api-docs/lib/pages/react-cards/Card.page.json')}
    {...{ ...CardPageProps, ...props }}
  />
);

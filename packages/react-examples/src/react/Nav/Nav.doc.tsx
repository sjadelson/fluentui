import * as React from 'react';
import { NavBasicExample } from './Nav.Basic.Example';
import { IDocPageProps } from '@fluentui/react-internal/lib/common/DocPage.types';
import { NavFabricDemoAppExample } from './Nav.FabricDemoApp.Example';
import { NavNestedExample } from './Nav.Nested.Example';
import { NavCustomGroupHeadersExample } from './Nav.CustomGroupHeaders.Example';

const NavBasicExampleCode = require('!raw-loader!@fluentui/react-examples/src/react/Nav/Nav.Basic.Example.tsx') as string;
const NavFabricDemoAppExampleCode = require('!raw-loader!@fluentui/react-examples/src/react/Nav/Nav.FabricDemoApp.Example.tsx') as string;
const NavNestedExampleCode = require('!raw-loader!@fluentui/react-examples/src/react/Nav/Nav.Nested.Example.tsx') as string;
const NavCustomGroupHeadersExampleCode = require('!raw-loader!@fluentui/react-examples/src/react/Nav/Nav.CustomGroupHeaders.Example.tsx') as string;

export const NavPageProps: IDocPageProps = {
  title: 'Nav',
  componentName: 'Nav',
  componentUrl: 'https://github.com/microsoft/fluentui/tree/master/packages/react-internal/src/components/Nav',
  examples: [
    {
      title: 'Basic nav with sample links',
      code: NavBasicExampleCode,
      view: <NavBasicExample />,
    },
    {
      title: 'Nav similar to the one in this demo app',
      code: NavFabricDemoAppExampleCode,
      view: <NavFabricDemoAppExample />,
    },
    {
      title: 'Nav with nested links',
      code: NavNestedExampleCode,
      view: <NavNestedExample />,
    },
    {
      title: 'Nav with custom group header',
      code: NavCustomGroupHeadersExampleCode,
      view: <NavCustomGroupHeadersExample />,
    },
  ],
  overview: require<string>('!raw-loader!@fluentui/react-examples/src/react/Nav/docs/NavOverview.md'),
  bestPractices: require<string>('!raw-loader!@fluentui/react-examples/src/react/Nav/docs/NavBestPractices.md'),
  isHeaderVisible: true,
  isFeedbackVisible: true,
};

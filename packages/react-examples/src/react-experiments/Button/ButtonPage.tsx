import * as React from 'react';
import {
  ExampleCard,
  IComponentDemoPageProps,
  ComponentPage,
  PropertiesTableSet,
} from '@fluentui/react-docsite-components';
import { KeytipLayer } from '@fluentui/react';

import { ButtonExample } from './Button.Example';
import { MenuButtonExample } from './MenuButton/MenuButton.Example';
import { SplitButtonExample } from './SplitButton/SplitButton.Example';
import { ButtonKeytipsExample } from './Button.Keytips.Example';
import { ButtonSlotsExample } from './Button.Slots.Example';
import { ButtonStylesExample } from './Button.Styles.Example';
import { ButtonToggleExample } from './Button.Toggle.Example';
import { ButtonTokensExample } from './Button.Tokens.Example';
import { ButtonVariantsExample } from './Button.Variants.Example';

const ButtonExampleCode = require('!raw-loader!@fluentui/react-examples/src/react-experiments/Button/Button.Example.tsx') as string;
const MenuButtonExampleCode = require('!raw-loader!@fluentui/react-examples/src/react-experiments/Button/MenuButton/MenuButton.Example.tsx') as string;
const SplitButtonExampleCode = require('!raw-loader!@fluentui/react-examples/src/react-experiments/Button/SplitButton/SplitButton.Example.tsx') as string;
const ButtonKeytipsExampleCode = require('!raw-loader!@fluentui/react-examples/src/react-experiments/Button/Button.Keytips.Example.tsx') as string;
const ButtonSlotsExampleCode = require('!raw-loader!@fluentui/react-examples/src/react-experiments/Button/Button.Slots.Example.tsx') as string;
const ButtonStylesExampleCode = require('!raw-loader!@fluentui/react-examples/src/react-experiments/Button/Button.Styles.Example.tsx') as string;
const ButtonToggleExampleCode = require('!raw-loader!@fluentui/react-examples/src/react-experiments/Button/Button.Toggle.Example.tsx') as string;
const ButtonTokensExampleCode = require('!raw-loader!@fluentui/react-examples/src/react-experiments/Button/Button.Tokens.Example.tsx') as string;
const ButtonVariantsExampleCode = require('!raw-loader!@fluentui/react-examples/src/react-experiments/Button/Button.Variants.Example.tsx') as string;

export class ButtonPage extends React.Component<IComponentDemoPageProps, {}> {
  public render(): JSX.Element {
    return (
      <ComponentPage
        title=" Button"
        componentName=" Button"
        exampleCards={
          <div>
            <ExampleCard title="Button Ramps" code={ButtonExampleCode}>
              <ButtonExample />
            </ExampleCard>
            <ExampleCard title="Menu Button Examples" code={MenuButtonExampleCode}>
              <MenuButtonExample />
            </ExampleCard>
            <ExampleCard title="Split Button Examples" code={SplitButtonExampleCode}>
              <SplitButtonExample />
            </ExampleCard>
            <ExampleCard title="Button Variants Examples" code={ButtonVariantsExampleCode}>
              <ButtonVariantsExample />
            </ExampleCard>
            <ExampleCard title="Toggle Button Examples" code={ButtonToggleExampleCode}>
              <ButtonToggleExample />
            </ExampleCard>
            <ExampleCard title="Buttons with Keytips" code={ButtonKeytipsExampleCode}>
              <ButtonKeytipsExample />
            </ExampleCard>
            <ExampleCard title="Button Slots Customization" code={ButtonSlotsExampleCode}>
              <ButtonSlotsExample />
            </ExampleCard>
            <ExampleCard title="Button Styles Customization" code={ButtonStylesExampleCode}>
              <ButtonStylesExample />
            </ExampleCard>
            <ExampleCard title="Button Tokens Customization" code={ButtonTokensExampleCode}>
              <ButtonTokensExample />
            </ExampleCard>
            <KeytipLayer content="Alt Windows" />
          </div>
        }
        propertiesTables={
          <PropertiesTableSet
            sources={[
              require<string>('!raw-loader!@fluentui/react-experiments/src/components/Button/Button.types.tsx'),
              require<
                string
              >('!raw-loader!@fluentui/react-experiments/src/components/Button/MenuButton/MenuButton.types.tsx'),
              require<
                string
              >('!raw-loader!@fluentui/react-experiments/src/components/Button/SplitButton/SplitButton.types.tsx'),
            ]}
          />
        }
        isHeaderVisible={this.props.isHeaderVisible}
      />
    );
  }
}

import { ButtonPageProps as ExternalProps } from '@fluentui/react-examples/lib/react/Button/Button.doc';
import { Platforms } from '../../../interfaces/Platforms';
import { TPlatformPageProps } from '@fluentui/react-docsite-components/lib/index2';

const related = require('!raw-loader!@fluentui/public-docsite/src/pages/Controls/ButtonPage/docs/ButtonRelated.md') as string;
const componentUrl =
  'https://github.com/microsoft/fluentui/tree/master/apps/public-docsite/src/pages/Controls/ButtonPage';

export const ButtonPageProps = (disabled: boolean, checked: boolean): TPlatformPageProps<Platforms> => {
  const externalProps = ExternalProps({ areButtonsDisabled: disabled, areButtonsChecked: checked });
  return {
    web: {
      ...(externalProps as any),
      related,
    },
    ios: {
      overview: require('!raw-loader!@fluentui/public-docsite/src/pages/Controls/ButtonPage/docs/ios/ButtonOverview.md') as string,
      related,
      componentUrl,
    },
    android: {
      overview: require('!raw-loader!@fluentui/public-docsite/src/pages/Controls/ButtonPage/docs/android/ButtonOverview.md') as string,
      related,
      componentUrl,
    },
    windows: {
      overview: require('!raw-loader!@fluentui/public-docsite/src/pages/Controls/ButtonPage/docs/windows/ButtonOverview.md') as string,
      usage: require('!raw-loader!@fluentui/public-docsite/src/pages/Controls/ButtonPage/docs/windows/ButtonUsage.md') as string,
      related,
      componentUrl,
    },
    mac: {
      overview: require('!raw-loader!@fluentui/public-docsite/src/pages/Controls/ButtonPage/docs/mac/ButtonOverview.md') as string,
      usage: require('!raw-loader!@fluentui/public-docsite/src/pages/Controls/ButtonPage/docs/mac/ButtonUsage.md') as string,
      related,
      componentUrl,
    },
    cross: {
      overview: require('!raw-loader!@fluentui/public-docsite/src/pages/Controls/ButtonPage/docs/cross/ButtonOverview.md') as string,
      usage: require('!raw-loader!@fluentui/public-docsite/src/pages/Controls/ButtonPage/docs/cross/ButtonUsage.md') as string,
      related,
      componentUrl,
    },
  };
};

import { TFabricPlatformPageProps } from '../../../interfaces/Platforms';
import { DatePickerPageProps as ExternalProps } from '@fluentui/react-examples/lib/react-date-time/DatePicker/DatePicker.doc';

const related = require('!raw-loader!@fluentui/public-docsite/src/pages/Controls/DatePickerPage/docs/DatePickerRelated.md') as string;
const componentUrl =
  'https://github.com/microsoft/fluentui/tree/master/apps/public-docsite/src/pages/Controls/DatePickerPage';

export const DatePickerPageProps: TFabricPlatformPageProps = {
  web: {
    ...(ExternalProps as any),
    related,
  },
  ios: {
    title: 'Date & Time Picker',
    fileNamePrefix: 'DateTimePicker',
    overview: require('!raw-loader!@fluentui/public-docsite/src/pages/Controls/DatePickerPage/docs/ios/DateTimePickerOverview.md') as string,
    related,
    componentUrl,
  },
  android: {
    title: 'Date & Time Picker',
    fileNamePrefix: 'DateTimePicker',
    overview: require('!raw-loader!@fluentui/public-docsite/src/pages/Controls/DatePickerPage/docs/android/DateTimePickerOverview.md') as string,
    related,
    componentUrl,
  },
  mac: {
    title: 'Date Picker',
    fileNamePrefix: 'DatePicker',
    overview: require('!raw-loader!@fluentui/public-docsite/src/pages/Controls/DatePickerPage/docs/mac/DatePickerOverview.md') as string,
    usage: require('!raw-loader!@fluentui/public-docsite/src/pages/Controls/DatePickerPage/docs/mac/DatePickerUsage.md') as string,
    related,
    componentUrl,
  },
};

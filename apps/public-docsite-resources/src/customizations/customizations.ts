import { IExampleCardCustomizations, IAppCustomizations } from '@fluentui/react-docsite-components';
import { AzureCustomizationsLight, AzureCustomizationsDark } from '@fluentui/azure-themes';
import {
  TeamsCustomizations,
  WordCustomizations,
  DefaultCustomizations,
  DarkCustomizations,
} from '@fluentui/theme-samples';

const exampleCardCustomizations: IExampleCardCustomizations[] = [
  { title: 'Default', customizations: DefaultCustomizations },
  { title: 'Dark', customizations: DarkCustomizations },
  { title: 'Word', customizations: WordCustomizations },
  { title: 'Teams', customizations: TeamsCustomizations },
  { title: 'Azure', customizations: AzureCustomizationsLight },
  { title: 'Azure Dark', customizations: AzureCustomizationsDark },
];

export const AppCustomizations: IAppCustomizations = {
  exampleCardCustomizations,
};

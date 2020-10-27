import * as React from 'react';
// Temporary import file to experiment with next version of foundation.
import { composed } from '@fluentui/foundation-legacy/lib/next/composed';
import { useMenuButtonState as state } from './MenuButton.state';
import { MenuButtonStyles as styles, MenuButtonTokens as tokens } from './MenuButton.styles';
import { IMenuButtonProps } from './MenuButton.types';
import { MenuButtonSlots as slots, MenuButtonView as view } from './MenuButton.view';

export const MenuButton: React.FunctionComponent<IMenuButtonProps> = composed({
  displayName: 'MenuButton',
  slots,
  state,
  styles,
  tokens,
  view,
});

export default MenuButton;

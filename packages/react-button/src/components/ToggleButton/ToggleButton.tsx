import * as React from 'react';
import { ToggleButtonProps } from './ToggleButton.types';
import { useToggleButton } from './useToggleButton';
import { useInlineTokens } from '@fluentui/react-theme-provider';
import { useButtonClasses } from '../Button/useButtonClasses';
import { useToggleButtonClasses } from './useToggleButtonClasses';

/**
 * Define a styled ToggleButton, using the `useToggleButton` hook.
 * {@docCategory Button}
 */
export const ToggleButton = React.forwardRef<HTMLElement, ToggleButtonProps>((props, ref) => {
  const { render, state } = useToggleButton(props, ref);

  useButtonClasses(state);
  useToggleButtonClasses(state);
  useInlineTokens(state, '--button');

  return render(state);
});

ToggleButton.displayName = 'ToggleButton';

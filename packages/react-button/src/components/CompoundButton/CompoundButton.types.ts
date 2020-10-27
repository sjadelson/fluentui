import { ShorthandProps } from '@fluentui/react-compose/lib/next/index';
import { ButtonProps, ButtonTokens, ButtonVariants } from '../Button/Button.types';

/**
 * {@docCategory Button}
 */
export interface CompoundButtonProps extends ButtonProps {
  /**
   * Second line of text that describes the action this button takes.
   */
  secondaryContent?: ShorthandProps;

  /**
   * Container that wraps the children and secondaryContent slots.
   */
  contentContainer?: ShorthandProps;
}

/**
 * {@docCategory Button}
 */
export interface CompoundButtonState extends CompoundButtonProps {}

/**
 * {@docCategory Button}
 */
export type CompoundButtonTokens = ButtonTokens & {
  secondaryContentColor: string;
  secondaryContentFontSize: string;
  secondaryContentFontWeight: string;
  secondaryContentGap: string;
};

/**
 * {@docCategory Button}
 */
export type CompoundButtonVariants = ButtonVariants<CompoundButtonTokens>;

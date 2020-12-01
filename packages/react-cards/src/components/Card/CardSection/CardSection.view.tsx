/** @jsx withSlots */
import { withSlots, getSlots } from '@fluentui/foundation-legacy';
import { Stack } from '@fluentui/react/lib/Stack';
import { ICardSectionComponent, ICardSectionProps, ICardSectionSlots } from './CardSection.types';

export const CardSectionView: ICardSectionComponent['view'] = props => {
  const { children, ...rest } = props;
  // eslint-disable-next-line eqeqeq
  if (children == null) {
    return null;
  }

  const Slots = getSlots<ICardSectionProps, ICardSectionSlots>(props, {
    root: Stack,
  });

  return <Slots.root {...rest}>{children}</Slots.root>;
};

import * as React from 'react';
import { KeyCodes, getId, css } from '@fluentui/react/lib/Utilities';
import { IFloatingSuggestionItemProps } from '../../../FloatingSuggestionsComposite/FloatingSuggestionsItem/FloatingSuggestionsItem.types';
import { IBaseFloatingSuggestionsProps } from '../../../FloatingSuggestionsComposite';
import { EditingItemComponentProps } from '../EditableItem';
import { Autofill } from '@fluentui/react';

import * as styles from './DefaultEditingItem.scss';

export interface IDefaultEditingItemInnerProps<TItem> extends React.HTMLAttributes<any> {
  /**
   * The current item of the EditingItem
   */
  item: TItem;

  /**
   * Callback for when the edited item's new value has been selected.
   * Invoked indirectly by the picker mounted by onRenderFloatingPicker.
   */
  onEditingComplete: (oldItem: TItem, newItem: TItem) => void;

  /**
   * Callback for when the FloatingSuggestions is dismissed
   */
  onDismiss?: (ev?: React.MouseEvent<Element, MouseEvent> | undefined) => void;

  /**
   * Renders the floating suggestions for suggesting the result of the item edit.
   *
   * Not actually optional, since is what is needed to resolve the new item.
   */
  onRenderFloatingPicker?: React.ComponentType<EditingItemInnerFloatingPickerProps<TItem>>;

  /**
   * Callback for when the editing item removes the item from the well
   *
   * Called when the item is currently being edited and the text length goes to zero
   */
  onRemoveItem?: (item: TItem) => void;

  /**
   * Callback used by the EditingItem to populate the initial value of the editing item
   */
  getEditingItemText: (item: TItem) => string;

  onInputStringChanged: (value: string) => void;

  suggestions: IFloatingSuggestionItemProps<TItem>[];
}

export type EditingItemInnerFloatingPickerProps<T> = Pick<
  IBaseFloatingSuggestionsProps<T>,
  | 'onSuggestionSelected'
  | 'selectedSuggestionIndex'
  | 'suggestions'
  | 'targetElement'
  | 'onRemoveSuggestion'
  | 'onFloatingSuggestionsDismiss'
  | 'onKeyDown'
  | 'isSuggestionsVisible'
>;

/**
 * Wrapper around an item in a selection well that renders an item with a context menu for
 * replacing that item with another item.
 */
export const DefaultEditingItemInner = <TItem extends any>(
  props: IDefaultEditingItemInnerProps<TItem>,
): JSX.Element => {
  const [focusItemIndex, setFocusItemIndex] = React.useState<number>(-1);
  const [isSuggestionsVisible, setIsSuggestionsVisible] = React.useState(false);

  const itemId = getId();
  const input = React.useRef<Autofill>(null);

  // set focus to the input on load
  React.useEffect(() => {
    if (input.current) {
      input.current.focus();
    }
  }, []);

  const _onSuggestionSelected = (
    ev: React.MouseEvent<HTMLElement, MouseEvent>,
    itemProps: IFloatingSuggestionItemProps<TItem>,
  ): void => {
    setIsSuggestionsVisible(false);
    props.onEditingComplete(props.item, itemProps.item);
  };

  const _onRemoveItem = (
    ev: React.MouseEvent<HTMLElement, MouseEvent>,
    itemProps: IFloatingSuggestionItemProps<TItem>,
  ): void => {
    if (props.onRemoveItem) {
      props.onRemoveItem(itemProps.item);
    }
  };

  const _onInputChange = (value: string, composing?: boolean): void => {
    if (!composing) {
      if (value === '') {
        if (props.onRemoveItem) {
          props.onRemoveItem(props.item);
        }
      } else {
        if (props.onInputStringChanged) {
          props.onInputStringChanged(value);
        }
      }
    }
  };

  const _onInputClick = (ev: React.MouseEvent<HTMLInputElement | Autofill>) => {
    setIsSuggestionsVisible(true);
  };

  const _onInputFocus = (ev: React.FocusEvent<HTMLInputElement | Autofill>): void => {
    setIsSuggestionsVisible(true);
  };

  const _onInputKeyDown = (ev: React.KeyboardEvent<Autofill | HTMLElement>) => {
    const keyCode = ev.which;
    switch (keyCode) {
      case KeyCodes.enter:
      case KeyCodes.tab:
        if (!ev.shiftKey && !ev.ctrlKey && focusItemIndex >= 0) {
          ev.preventDefault();
          ev.stopPropagation();
          // Get the focused element and add it to selectedItemsList
          setIsSuggestionsVisible(false);
          props.onEditingComplete(props.item, props.suggestions[focusItemIndex].item);
        }
        break;
      case KeyCodes.up:
        ev.preventDefault();
        ev.stopPropagation();
        _selectPreviousSuggestion();
        break;
      case KeyCodes.down:
        ev.preventDefault();
        ev.stopPropagation();
        _selectNextSuggestion();
        break;
    }
  };

  const _selectNextSuggestion = (): void => {
    if (props.suggestions && props.suggestions.length > 0) {
      if (focusItemIndex === -1) {
        setFocusItemIndex(0);
      } else if (focusItemIndex < props.suggestions.length - 1) {
        setFocusItemIndex(focusItemIndex + 1);
      } else if (focusItemIndex === props.suggestions.length - 1) {
        setFocusItemIndex(0);
      }
    }
    if (props.suggestions.length > focusItemIndex + 1) {
      setFocusItemIndex(focusItemIndex + 1);
    }
  };

  const _selectPreviousSuggestion = (): void => {
    if (props.suggestions && props.suggestions.length > 0) {
      if (focusItemIndex === -1) {
        setFocusItemIndex(props.suggestions.length - 1);
      } else if (focusItemIndex > 0) {
        setFocusItemIndex(focusItemIndex - 1);
      } else if (focusItemIndex === 0) {
        setFocusItemIndex(props.suggestions.length - 1);
      }
    }
  };

  const _renderEditingSuggestions = (): JSX.Element => {
    const FloatingPicker = props.onRenderFloatingPicker;
    if (!FloatingPicker) {
      return <></>;
    }
    return (
      <FloatingPicker
        onSuggestionSelected={_onSuggestionSelected}
        targetElement={input.current?.inputElement}
        onRemoveSuggestion={_onRemoveItem}
        onFloatingSuggestionsDismiss={props.onDismiss}
        suggestions={props.suggestions}
        selectedSuggestionIndex={focusItemIndex}
        onKeyDown={_onInputKeyDown}
        isSuggestionsVisible={isSuggestionsVisible}
      />
    );
  };

  return (
    <span
      aria-labelledby={'editingItemPersona-' + itemId}
      className={css('ms-EditingItem', styles.editingContainer)}
      aria-owns={isSuggestionsVisible ? 'suggestion-list' : undefined}
      aria-expanded={isSuggestionsVisible}
      aria-haspopup="listbox"
      role="combobox"
    >
      <Autofill
        className={styles.editingInput}
        ref={input}
        defaultVisibleValue={props.getEditingItemText(props.item)}
        /* eslint-disable react/jsx-no-bind */
        onFocus={_onInputFocus}
        onClick={_onInputClick}
        onInputValueChange={_onInputChange}
        /* eslint-enable react/jsx-no-bind */
        aria-autocomplete="list"
        aria-activedescendant={
          isSuggestionsVisible && focusItemIndex >= 0 ? 'FloatingSuggestionsItemId-' + focusItemIndex : undefined
        }
        disabled={false}
        /* eslint-disable react/jsx-no-bind */
        onKeyDown={_onInputKeyDown}
        /* eslint-enable react/jsx-no-bind */
      />
      {_renderEditingSuggestions()}
    </span>
  );
};

type EditingItemProps<T> = Pick<
  IDefaultEditingItemInnerProps<T>,
  Exclude<keyof IDefaultEditingItemInnerProps<T>, keyof EditingItemComponentProps<T>>
>;

export const DefaultEditingItem = <T extends any>(outerProps: EditingItemProps<T>) => (
  innerProps: EditingItemComponentProps<T>,
) => <DefaultEditingItemInner {...outerProps} {...innerProps} />;

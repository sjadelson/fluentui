import * as React from 'react';
import { getStyles } from './UnifiedPicker.styles';
import { classNamesFunction, css, SelectionMode, Selection, KeyCodes } from '../../Utilities';
import { DragDropHelper, IDragDropContext } from '@fluentui/react/lib/DragDrop';
import { IUnifiedPickerStyleProps, IUnifiedPickerStyles } from './UnifiedPicker.styles';
import { FocusZoneDirection, FocusZone, SelectionZone, Autofill, IInputProps, IDragDropEvents } from '@fluentui/react';
import { IUnifiedPickerProps } from './UnifiedPicker.types';
import { useQueryString } from './hooks/useQueryString';
import { useFloatingSuggestionItems } from './hooks/useFloatingSuggestionItems';
import { useSelectedItems } from './hooks/useSelectedItems';
import { IFloatingSuggestionItemProps } from '../../FloatingSuggestionsComposite';
import { getTheme } from '@fluentui/react/lib/Styling';
import { mergeStyles } from '@fluentui/merge-styles';

export const UnifiedPicker = <T extends {}>(props: IUnifiedPickerProps<T>): JSX.Element => {
  const getClassNames = classNamesFunction<IUnifiedPickerStyleProps, IUnifiedPickerStyles>();
  const classNames = getClassNames(getStyles);

  const rootRef = React.createRef<HTMLDivElement>();
  const input = React.useRef<Autofill>(null);
  const { setQueryString, clearQueryString } = useQueryString('');
  const [selection, setSelection] = React.useState(new Selection({ onSelectionChanged: () => _onSelectionChanged() }));
  const [focusedItemIndices, setFocusedItemIndices] = React.useState(selection.getSelectedIndices() || []);
  const {
    suggestions,
    selectedSuggestionIndex,
    selectedFooterIndex,
    selectedHeaderIndex,
    pickerSuggestionsProps,
    isSuggestionsVisible,
  } = props.floatingSuggestionProps;
  const [draggedIndex, setDraggedIndex] = React.useState<number>(-1);
  const dragDropHelper = new DragDropHelper({
    selection: selection,
  });

  const {
    focusItemIndex,
    suggestionItems,
    footerItemIndex,
    footerItems,
    headerItemIndex,
    headerItems,
    isSuggestionsShown,
    showPicker,
    selectPreviousSuggestion,
    selectNextSuggestion,
  } = useFloatingSuggestionItems(
    suggestions,
    selectedSuggestionIndex,
    selectedFooterIndex,
    pickerSuggestionsProps?.footerItemsProps,
    selectedHeaderIndex,
    pickerSuggestionsProps?.headerItemsProps,
    isSuggestionsVisible,
  );

  const {
    selectedItems,
    addItems,
    dropItemsAt,
    removeItems,
    removeItemAt,
    removeSelectedItems,
    unselectAll,
    getSelectedItems,
    setSelectedItems,
  } = useSelectedItems(selection, props.selectedItemsListProps.selectedItems);

  const _onSelectionChanged = () => {
    showPicker(false);
    setSelection(selection);
    setFocusedItemIndices(selection.getSelectedIndices());
  };

  const {
    className,
    focusZoneProps,
    inputProps,
    onRenderSelectedItems,
    selectedItemsListProps,
    onRenderFloatingSuggestions,
    floatingSuggestionProps,
    headerComponent,
    onInputChange,
  } = props;

  const defaultDragDropEnabled = React.useMemo(
    () => (props.defaultDragDropEnabled !== undefined ? props.defaultDragDropEnabled : true),
    [props.defaultDragDropEnabled],
  );

  const autofillDragDropEnabled = React.useMemo(
    () => (props.autofillDragDropEnabled !== undefined ? props.autofillDragDropEnabled : defaultDragDropEnabled),
    [props.autofillDragDropEnabled, defaultDragDropEnabled],
  );

  React.useImperativeHandle(props.componentRef, () => ({
    clearInput: () => {
      if (input.current) {
        input.current.clear();
      }
    },
    focus: () => {
      if (input.current) {
        input.current.focus();
      }
    },
  }));

  // All of the drag drop functions are the default behavior. Users can override that by setting the dragDropEvents prop
  const theme = getTheme();
  const dragEnterClass = mergeStyles({
    backgroundColor: theme.palette.neutralLight,
  });

  const _onDragEnter = (item?: any, event?: DragEvent): string => {
    // return string is the css classes that will be added to the entering element.
    return dragEnterClass;
  };

  let insertIndex = -1;
  const _dropItemsAt = (newItems: T[]): void => {
    let indicesToRemove: number[] = [];
    // If we are moving items within the same picker, remove them from their old places as well
    if (draggedIndex > -1) {
      indicesToRemove = focusedItemIndices.includes(draggedIndex) ? [...focusedItemIndices] : [draggedIndex];
    }
    if (props.selectedItemsListProps.dropItemsAt) {
      props.selectedItemsListProps.dropItemsAt(insertIndex, newItems, indicesToRemove);
    }
    dropItemsAt(insertIndex, newItems, indicesToRemove);
    unselectAll();
    insertIndex = -1;
  };

  const _onDragOverAutofill = (event?: React.DragEvent<HTMLDivElement>) => {
    if (autofillDragDropEnabled) {
      event?.preventDefault();
    }
  };

  const _onDropAutoFill = (event?: React.DragEvent<HTMLDivElement>) => {
    event?.preventDefault();
    if (props.onDropAutoFill) {
      props.onDropAutoFill(event);
    } else {
      insertIndex = selectedItems.length;
      _onDropInner(event?.dataTransfer);
    }
  };

  const _canDrop = (dropContext?: IDragDropContext, dragContext?: IDragDropContext): boolean => {
    return defaultDragDropEnabled && !focusedItemIndices.includes(dropContext!.index);
  };

  const _onDropList = (item?: any, event?: DragEvent): void => {
    /* indexOf compares using strict equality
       if the item is something where properties can change frequently, then the
       itemsAreEqual prop should be overloaded
       Otherwise it's possible for the indexOf check to fail and return -1 */
    if (props.selectedItemsListProps.itemsAreEqual) {
      insertIndex = selectedItems.findIndex(currentItem =>
        props.selectedItemsListProps.itemsAreEqual
          ? props.selectedItemsListProps.itemsAreEqual(currentItem, item)
          : false,
      );
    } else {
      insertIndex = selectedItems.indexOf(item);
    }

    event?.preventDefault();
    _onDropInner(event?.dataTransfer !== null ? event?.dataTransfer : undefined);
  };

  const _onDropInner = (dataTransfer?: DataTransfer): void => {
    let isDropHandled = false;
    if (dataTransfer) {
      const data = dataTransfer.items;
      for (let i = 0; i < data.length; i++) {
        if (data[i].kind === 'string' && data[i].type === props.customClipboardType) {
          isDropHandled = true;
          data[i].getAsString((dropText: string) => {
            if (props.selectedItemsListProps.deserializeItemsFromDrop) {
              const newItems = props.selectedItemsListProps.deserializeItemsFromDrop(dropText);
              _dropItemsAt(newItems);
            }
          });
        }
      }
    }
    if (!isDropHandled && draggedIndex > -1) {
      const newItems = focusedItemIndices.includes(draggedIndex)
        ? (getSelectedItems() as T[])
        : [selectedItems[draggedIndex]];
      _dropItemsAt(newItems);
    }
  };

  const _onDragStart = (item?: any, itemIndex?: number, tempSelectedItems?: any[], event?: DragEvent): void => {
    /* eslint-disable-next-line eqeqeq */
    const draggedItemIndex = itemIndex != null ? itemIndex! : -1;
    setDraggedIndex(draggedItemIndex);
    if (event) {
      const dataList = event?.dataTransfer?.items;
      if (props.selectedItemsListProps.serializeItemsForDrag && props.customClipboardType) {
        const draggedItems = focusedItemIndices.includes(draggedItemIndex) ? [...getSelectedItems()] : [item];
        const dragText = props.selectedItemsListProps.serializeItemsForDrag(draggedItems);
        dataList?.add(dragText, props.customClipboardType);
      }
    }
  };

  const _onDragEnd = (item?: any, event?: DragEvent): void => {
    if (event) {
      // If we have a move event, and we still have selected items (indicating that we
      // haven't already moved items within the well) we should remove the item(s)
      if (event.dataTransfer?.dropEffect === 'move' && focusedItemIndices.length > 0) {
        const itemsToRemove = focusedItemIndices.includes(draggedIndex)
          ? (getSelectedItems() as T[])
          : [selectedItems[draggedIndex]];
        _onRemoveSelectedItems(itemsToRemove);
      }
      // Clear any remaining drag data
      const dataList = event?.dataTransfer?.items;
      dataList?.clear();
    }
    setDraggedIndex(-1);
  };

  const defaultDragDropEvents: IDragDropEvents = {
    canDrop: _canDrop,
    canDrag: () => defaultDragDropEnabled,
    onDragEnter: _onDragEnter,
    onDragLeave: () => undefined,
    onDrop: _onDropList,
    onDragStart: _onDragStart,
    onDragEnd: _onDragEnd,
  };

  const _onKeyDown = (ev: React.KeyboardEvent<HTMLDivElement>) => {
    // Allow the caller to handle the key down
    if (props.onKeyDown) {
      props.onKeyDown(ev);
    }

    // Handle delete of items via backspace
    if (ev.which === KeyCodes.backspace && selectedItems.length) {
      if (
        focusedItemIndices.length === 0 &&
        input &&
        input.current &&
        !input.current.isValueSelected &&
        input.current.inputElement === document.activeElement &&
        (input.current as Autofill).cursorLocation === 0
      ) {
        showPicker(false);
        ev.preventDefault();
        if (props.selectedItemsListProps.onItemsRemoved) {
          props.selectedItemsListProps.onItemsRemoved([selectedItems[selectedItems.length - 1]]);
        }
        removeItemAt(selectedItems.length - 1);
      } else if (focusedItemIndices.length > 0) {
        showPicker(false);
        ev.preventDefault();
        if (props.selectedItemsListProps.onItemsRemoved) {
          props.selectedItemsListProps.onItemsRemoved(getSelectedItems());
        }
        removeSelectedItems();
        input.current?.focus();
      }
    }
  };

  const _onInputKeyDown = (ev: React.KeyboardEvent<Autofill | HTMLElement>) => {
    if (isSuggestionsShown) {
      const keyCode = ev.which;
      switch (keyCode) {
        case KeyCodes.escape:
          showPicker(false);
          ev.preventDefault();
          ev.stopPropagation();
          break;
        case KeyCodes.enter:
        case KeyCodes.tab:
          if (!ev.shiftKey && !ev.ctrlKey && (focusItemIndex >= 0 || footerItemIndex >= 0 || headerItemIndex >= 0)) {
            ev.preventDefault();
            ev.stopPropagation();
            if (focusItemIndex >= 0) {
              // Get the focused element and add it to selectedItemsList
              showPicker(false);
              _onSuggestionSelected(ev, suggestionItems[focusItemIndex]);
            } else if (footerItemIndex >= 0) {
              // execute the footer action
              footerItems![footerItemIndex].onExecute!();
            } else if (headerItemIndex >= 0) {
              // execute the header action
              headerItems![headerItemIndex].onExecute!();
            }
          }
          break;
        case KeyCodes.up:
          ev.preventDefault();
          ev.stopPropagation();
          selectPreviousSuggestion();
          break;
        case KeyCodes.down:
          ev.preventDefault();
          ev.stopPropagation();
          selectNextSuggestion();
          break;
      }
    }
  };

  const _onCopy = (ev: React.ClipboardEvent<HTMLInputElement>) => {
    if (focusedItemIndices.length > 0 && props.selectedItemsListProps?.getItemCopyText) {
      const copyItems = selection.getSelection() as T[];
      const copyString = props.selectedItemsListProps.getItemCopyText(copyItems);
      ev.clipboardData.setData('text/plain', copyString);
      ev.preventDefault();
    }
  };
  const _onInputFocus = (ev: React.FocusEvent<HTMLInputElement | Autofill>): void => {
    unselectAll();
    if (props.inputProps && props.inputProps.onFocus) {
      props.inputProps.onFocus(ev as React.FocusEvent<HTMLInputElement>);
    }
  };
  const _onInputClick = (ev: React.MouseEvent<HTMLInputElement | Autofill>) => {
    unselectAll();
    showPicker(true);
    if (props.inputProps && props.inputProps.onClick) {
      props.inputProps.onClick(ev as React.MouseEvent<HTMLInputElement>);
    }
  };
  const _onInputChange = (value: string, composing?: boolean, resultItemsList?: T[]) => {
    if (!composing) {
      // update query string
      setQueryString(value);
      !isSuggestionsShown ? showPicker(true) : null;
      if (!resultItemsList) {
        resultItemsList = [];
      }
      if (onInputChange) {
        onInputChange(value, composing, resultItemsList);
        clearQueryString();
        if (resultItemsList && resultItemsList.length > 0) {
          addItems(resultItemsList);
          showPicker(false);
          // Clear the input
          if (input.current) {
            input.current.clear();
          }
        }
      }
    }
  };
  const _onPaste = (ev: React.ClipboardEvent<Autofill | HTMLInputElement>) => {
    if (props.onPaste) {
      const inputText = ev.clipboardData.getData('Text');
      ev.preventDefault();
      // Pass current selected items
      props.onPaste(inputText, selectedItems);
      setSelectedItems(selectedItems);
      selection.setItems(selectedItems);
    }
  };

  const _renderSelectedItemsList = (): JSX.Element => {
    return onRenderSelectedItems({
      ...selectedItemsListProps,
      selectedItems: selectedItems,
      focusedItemIndices: focusedItemIndices,
      onItemsRemoved: _onRemoveSelectedItems,
      dragDropHelper: dragDropHelper,
      dragDropEvents: props.dragDropEvents ? props.dragDropEvents : defaultDragDropEvents,
    });
  };
  const _canAddItems = () => true;
  const _onFloatingSuggestionsDismiss = (ev: React.MouseEvent): void => {
    if (props.floatingSuggestionProps.onFloatingSuggestionsDismiss) {
      props.floatingSuggestionProps.onFloatingSuggestionsDismiss();
    }
    showPicker(false);
  };
  const _onFloatingSuggestionRemoved = (ev: any, item: IFloatingSuggestionItemProps<T>) => {
    if (props.floatingSuggestionProps.onRemoveSuggestion) {
      props.floatingSuggestionProps.onRemoveSuggestion(ev, item);
    }
    // We want to keep showing the picker to show the user that the entry has been removed from the list.
    showPicker(true);
  };
  const _onSuggestionSelected = (ev: any, item: IFloatingSuggestionItemProps<T>) => {
    addItems([item.item]);
    if (props.floatingSuggestionProps.onSuggestionSelected) {
      props.floatingSuggestionProps.onSuggestionSelected(ev, item);
    }
    if (input.current) {
      input.current.clear();
    }
    showPicker(false);
  };
  const _onRemoveSelectedItems = (itemsToRemove: T[]) => {
    removeItems(itemsToRemove);
    if (props.selectedItemsListProps.onItemsRemoved) {
      props.selectedItemsListProps.onItemsRemoved(itemsToRemove);
    }
  };
  const _renderFloatingPicker = () =>
    onRenderFloatingSuggestions({
      ...floatingSuggestionProps,
      pickerWidth: props.floatingSuggestionProps.pickerWidth ? props.floatingSuggestionProps.pickerWidth : '300px',
      targetElement: input.current?.inputElement,
      isSuggestionsVisible: isSuggestionsShown,
      suggestions: suggestionItems,
      selectedSuggestionIndex: focusItemIndex,
      selectedFooterIndex: footerItemIndex,
      selectedHeaderIndex: headerItemIndex,
      pickerSuggestionsProps: pickerSuggestionsProps,
      onFloatingSuggestionsDismiss: _onFloatingSuggestionsDismiss,
      onSuggestionSelected: _onSuggestionSelected,
      onKeyDown: _onInputKeyDown,
      onRemoveSuggestion: _onFloatingSuggestionRemoved,
    });

  return (
    <div
      ref={rootRef}
      className={css('ms-BasePicker ms-BaseExtendedPicker', className ? className : '')}
      onKeyDown={_onKeyDown}
      onCopy={_onCopy}
    >
      <FocusZone
        direction={FocusZoneDirection.bidirectional}
        {...focusZoneProps}
        /* TODO: create mouse drag selection capability */
      >
        <SelectionZone
          selection={selection}
          selectionMode={SelectionMode.multiple}
          className={css('ms-UnifiedPicker-selectionZone', classNames.selectionZone)}
        >
          <div className={css('ms-BasePicker-text', classNames.pickerText)}>
            {headerComponent}
            {_renderSelectedItemsList()}
            {_canAddItems() && (
              <div
                aria-owns={isSuggestionsShown ? 'suggestion-list' : undefined}
                aria-expanded={isSuggestionsShown}
                aria-haspopup="listbox"
                role="combobox"
                className={css('ms-BasePicker-div', classNames.pickerDiv)}
                onDrop={_onDropAutoFill}
                onDragOver={_onDragOverAutofill}
              >
                <Autofill
                  {...(inputProps as IInputProps)}
                  className={css('ms-BasePicker-input', classNames.pickerInput)}
                  ref={input}
                  /* eslint-disable react/jsx-no-bind */
                  onFocus={_onInputFocus}
                  onClick={_onInputClick}
                  onInputValueChange={_onInputChange}
                  /* eslint-enable react/jsx-no-bind */
                  aria-autocomplete="list"
                  aria-activedescendant={
                    isSuggestionsShown && focusItemIndex >= 0
                      ? 'FloatingSuggestionsItemId-' + focusItemIndex
                      : undefined
                  }
                  disabled={false}
                  /* eslint-disable react/jsx-no-bind */
                  onPaste={_onPaste}
                  onKeyDown={_onInputKeyDown}
                  /* eslint-enable react/jsx-no-bind */
                />
              </div>
            )}
          </div>
        </SelectionZone>
      </FocusZone>
      {_renderFloatingPicker()}
    </div>
  );
};

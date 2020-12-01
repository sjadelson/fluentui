import * as React from 'react';
import { Selection } from '../../../Utilities';

export interface IUseSelectedItemsResponse<T> {
  selectedItems: T[];
  setSelectedItems: (items: T[]) => void;
  addItems: (items: T[]) => void;
  dropItemsAt: (insertIndex: number, itemsToAdd: T[], indicesToRemove: number[]) => void;
  removeItemAt: (index: number) => void;
  removeItem: (item: T) => void;
  replaceItem: (itemToReplace: T, itemsToReplaceWith: T[]) => void;
  removeItems: (itemsToRemove: T[]) => void;
  removeSelectedItems: () => void;
  getSelectedItems: () => T[];
  hasSelectedItems: () => boolean;
  unselectAll: () => void;
}

export const useSelectedItems = <T extends {}>(
  selection: Selection,
  selectedItems?: T[],
): IUseSelectedItemsResponse<T> => {
  const [items, setSelectedItems] = React.useState(selectedItems || []);

  React.useEffect(
    () => {
      if (selectedItems !== undefined) {
        selection.setItems(selectedItems);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps -- we want to do this once
    [],
  );

  React.useEffect(() => {
    setSelectedItems(selectedItems ? selectedItems : []);
  }, [selectedItems]);

  const addItems = (itemsToAdd: T[]): void => {
    const newItems: T[] = items.concat(itemsToAdd);
    setSelectedItems(newItems);
    selection.setItems(newItems);
  };

  const dropItemsAt = (insertIndex: number, itemsToAdd: T[], indicesToRemove: number[]): void => {
    const currentItems: T[] = [...items];
    const updatedItems: T[] = [];

    for (let i = 0; i < currentItems.length; i++) {
      const item = currentItems[i];
      // If this is the insert before index, insert the dragged items, then the current item
      if (i === insertIndex) {
        itemsToAdd.forEach(draggedItem => {
          updatedItems.push(draggedItem);
        });
      }
      if (!indicesToRemove.includes(i)) {
        // only insert items into the new list that are not being dragged
        updatedItems.push(item);
      }
    }
    // if the insert index is at the end, add them now
    if (insertIndex === currentItems.length) {
      itemsToAdd.forEach(draggedItem => {
        updatedItems.push(draggedItem);
      });
    }
    setSelectedItems(updatedItems);
    selection.setItems(updatedItems);
  };

  const removeItemAt = (index: number): void => {
    const currentItems: T[] = [...items];
    const updatedItems: T[] = currentItems.slice(0, index).concat(currentItems.slice(index + 1));
    setSelectedItems(updatedItems);
    selection.setItems(updatedItems);
  };

  const removeItem = (item: T): void => {
    const currentItems: T[] = [...items];
    const index: number = currentItems.indexOf(item);
    removeItemAt(index);
  };

  const replaceItem = (itemToReplace: T, itemsToReplaceWith: T[]): void => {
    const currentItems: T[] = [...items];
    const index: number = items.indexOf(itemToReplace);

    if (index > -1) {
      const updatedItems = currentItems
        .slice(0, index)
        .concat(itemsToReplaceWith)
        .concat(currentItems.slice(index + 1));
      setSelectedItems(updatedItems);
      selection.setItems(updatedItems);
    }
  };

  const removeItems = (itemsToRemove: any[]): void => {
    const currentItems: T[] = [...items];
    const updatedItems: T[] = currentItems;
    // Intentionally not using .filter here as we want to only remove a specific
    // item in case of duplicates of same item.
    itemsToRemove.forEach(item => {
      const index: number = updatedItems.indexOf(item);
      updatedItems.splice(index, 1);
    });
    setSelectedItems(updatedItems);
    selection.setItems(updatedItems);
  };

  const removeSelectedItems = (): void => {
    removeItems(getSelectedItems());
  };

  const getSelectedItems = (): T[] => {
    if (hasSelectedItems()) {
      return selection.getSelection() as T[];
    } else {
      return [];
    }
  };

  const hasSelectedItems = (): Boolean => {
    if (items.length && selection.getSelectedCount() > 0) {
      return true;
    } else {
      return false;
    }
  };

  const unselectAll = (): void => {
    if (hasSelectedItems()) {
      selection.setAllSelected(false);
    }
  };

  return {
    selectedItems: items,
    setSelectedItems: setSelectedItems,
    addItems: addItems,
    dropItemsAt: dropItemsAt,
    removeItemAt: removeItemAt,
    removeItem: removeItem,
    replaceItem: replaceItem,
    removeItems: removeItems,
    removeSelectedItems: removeSelectedItems,
    getSelectedItems: getSelectedItems,
    hasSelectedItems: hasSelectedItems,
    unselectAll: unselectAll,
  } as IUseSelectedItemsResponse<T>;
};

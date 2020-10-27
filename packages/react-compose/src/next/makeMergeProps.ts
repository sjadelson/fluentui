import * as React from 'react';
import { css } from '@fluentui/utilities';
import { GenericDictionary } from './types';

export type MergePropsOptions = {
  /**
   * A list of props to deep merge. By default, `style` will
   * always be deep merged so it's not required to be provided.
   */
  deepMerge?: string[];
};

/**
 * Helper which deep clones props, but respectively assigns JSX, object refs, and class names
 * appropriately.
 *
 * @param target - the target object to merge onto.
 * @param propSets - one or more prop sets to deep merge onto the target.
 */
export const makeMergeProps = <TState = GenericDictionary>(options: MergePropsOptions = {}) => {
  const deepMerge = [...(options.deepMerge || []), 'style'];

  const mergeProps = (target: GenericDictionary, ...propSets: (GenericDictionary | undefined)[]): TState => {
    for (const props of propSets) {
      if (props) {
        for (const propName of Object.keys(props)) {
          const propValue = props[propName];
          const propValueType = typeof propValue;

          if (propValue !== undefined) {
            if (propValue && propValueType === 'object') {
              if (Array.isArray(propValue)) {
                // for arrays, replace.
                target[propName] = propValue;
              } else {
                target[propName] = target[propName] || {};

                if (
                  typeof target[propName] !== 'object' ||
                  React.isValidElement(propValue) ||
                  (propValue && typeof propValue === 'object' && propValue.hasOwnProperty('current')) ||
                  deepMerge.indexOf(propName) === -1
                ) {
                  // if target is not an object, or value is JSX,  or a ref object, replace
                  target[propName] = propValue;
                } else {
                  // else deep merge.
                  mergeProps(target[propName], propValue);
                }
              }
            } else if (propName === 'className') {
              if (propValue) {
                // for classnames, append
                target[propName] = css(target[propName], propValue);
              }
            } else {
              target[propName] = propValue;
            }
          }
        }
      }
    }
    return target as TState;
  };

  return mergeProps;
};

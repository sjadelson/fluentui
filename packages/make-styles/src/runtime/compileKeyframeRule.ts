import { hyphenateProperty } from './utils/hyphenateProperty';
import { MakeStyles } from '../types';

/* eslint-disable guard-for-in */

function cssifyObject(style: MakeStyles) {
  let css = '';

  for (const property in style) {
    const value = style[property];

    if (typeof value !== 'string' && typeof value !== 'number') {
      continue;
    }

    // prevents the semicolon after
    // the last rule declaration
    if (css) {
      css += ';';
    }

    css += hyphenateProperty(property) + ':' + value;
  }

  return css;
}

export function compileKeyframeRule(frames: MakeStyles): string {
  let css: string = '';

  for (const percentage in frames) {
    css += `${percentage}{${cssifyObject(frames[percentage])}}`;
  }

  return css;
}

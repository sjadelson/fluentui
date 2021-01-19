import { css, ElementStyles } from '@microsoft/fast-element';
import { SystemColors } from '@microsoft/fast-web-utilities';
import { disabledCursor, display, focusVisible, forcedColorsStylesheetBehavior } from '@microsoft/fast-foundation';
import { heightNumber } from '../size';
import {
  accentFillActiveBehavior,
  accentFillHoverBehavior,
  accentFillRestBehavior,
  accentForegroundActiveBehavior,
  accentForegroundCutRestBehavior,
  accentForegroundHoverBehavior,
  accentForegroundRestBehavior,
  neutralFillActiveBehavior,
  neutralFillHoverBehavior,
  neutralFillRestBehavior,
  neutralFillStealthActiveBehavior,
  neutralFillStealthHoverBehavior,
  neutralFillStealthRestBehavior,
  neutralFocusBehavior,
  neutralFocusInnerAccentBehavior,
  neutralForegroundRestBehavior,
  neutralOutlineActiveBehavior,
  neutralOutlineHoverBehavior,
  neutralOutlineRestBehavior,
} from '../behaviors';

/**
 * @internal
 */
export const BaseButtonStyles: ElementStyles = css`
    ${display('inline-flex')} :host {
        font-family: var(--body-font);
        outline: none;
        font-size: var(--type-ramp-base-font-size);
        line-height: var(--type-ramp-base-line-height);
        height: calc(${heightNumber} * 1px);
        min-width: calc(${heightNumber} * 1px);
        background-color: ${neutralFillRestBehavior.var};
        color: ${neutralForegroundRestBehavior.var};
        border-radius: calc(var(--corner-radius) * 1px);
        fill: currentcolor;
        cursor: pointer;
    }

    .control {
        background: transparent;
        height: inherit;
        flex-grow: 1;
        box-sizing: border-box;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        padding: 0 calc((10 + (var(--design-unit) * 2 * var(--density))) * 1px);
        white-space: nowrap;
        outline: none;
        text-decoration: none;
        border: calc(var(--outline-width) * 1px) solid transparent;
        color: inherit;
        border-radius: inherit;
        fill: inherit;
        cursor: inherit;
        font-family: inherit;
    }

    .control, .end, .start {
        font: inherit;
    }

    .control.icon-only {
        padding: 0;
        line-height: 0;
    }

    :host(:hover) {
        background-color: ${neutralFillHoverBehavior.var};
    }

    :host(:active) {
        background-color: ${neutralFillActiveBehavior.var};
    }

    .control:${focusVisible} {
        border: calc(var(--outline-width) * 1px) solid ${neutralFocusBehavior.var};
        box-shadow: 0 0 0 calc((var(--focus-outline-width) - var(--outline-width)) * 1px) ${neutralFocusBehavior.var};
    }

    .control::-moz-focus-inner {
        border: 0;
    }

    :host(.disabled) {
        opacity: var(--disabled-opacity);
        background-color: ${neutralFillRestBehavior.var};
        cursor: ${disabledCursor};
    }

    .start,
    .end {
        display: flex;
    }

    ::slotted(svg) {
        ${
          /* Glyph size and margin-left is temporary -
            replace when adaptive typography is figured out */ ''
        } width: 16px;
        height: 16px;
    }

    .start {
        margin-inline-end: 11px;
    }

    .end {
        margin-inline-start: 11px;
    }
`.withBehaviors(
  neutralFillRestBehavior,
  neutralForegroundRestBehavior,
  neutralFillHoverBehavior,
  neutralFillActiveBehavior,
  forcedColorsStylesheetBehavior(
    css`
        :host {
          background-color: ${SystemColors.ButtonFace};
          border-color: ${SystemColors.ButtonText};
          color: ${SystemColors.ButtonText};
          fill: currentcolor;
        }

        :host(:hover) {
          forced-color-adjust: none;
          background-color: ${SystemColors.Highlight};
          color: ${SystemColors.HighlightText};
        }

        .control:${focusVisible},
        :host(.outline) .control:${focusVisible} {
          forced-color-adjust: none;
          background-color: ${SystemColors.Highlight};
          border-color: ${SystemColors.ButtonText};
          box-shadow: 0 0 0 calc((var(--focus-outline-width) - var(--outline-width)) * 1px) ${SystemColors.ButtonText};
          color: ${SystemColors.HighlightText};
        }

        .control:hover,
        :host(.outline) .control:hover {
          border-color: ${SystemColors.ButtonText};
        }

        :host(.disabled),
        :host(.disabled) .control {
            forced-color-adjust: none;
            background-color: ${SystemColors.ButtonFace};
            border-color: ${SystemColors.GrayText};
            color: ${SystemColors.GrayText};
            cursor: ${disabledCursor};
            opacity: 1;
        }

        :host([href]) {
          color: ${SystemColors.LinkText};
        }

        :host([href]) .control:hover,
        :host(.outline[href]) .control:hover
        :host(:hover[href]),
        :host([href]) .control:${focusVisible}{
          forced-color-adjust: none;
          background: ${SystemColors.ButtonFace};
          border-color: ${SystemColors.LinkText};
          box-shadow: 0 0 0 1px ${SystemColors.LinkText} inset;
          color: ${SystemColors.LinkText};
          fill: currentcolor;
        }
    `,
  ),
);

/**
 * @internal
 */
export const AccentButtonStyles = css`
    :host(.accent) {
        background: ${accentFillRestBehavior.var};
        color: ${accentForegroundCutRestBehavior.var};
    }

    :host(.accent:hover) {
        background: ${accentFillHoverBehavior.var};
    }

    :host(.accent:active) .control:active {
        background: ${accentFillActiveBehavior.var};
    }

    :host(.accent) .control:${focusVisible} {
        box-shadow: 0 0 0 calc(var(--focus-outline-width) * 1px) inset ${neutralFocusInnerAccentBehavior.var};
    }

    :host(.accent.disabled) {
        background: ${accentFillRestBehavior.var};
    }
`.withBehaviors(
  accentFillRestBehavior,
  accentForegroundCutRestBehavior,
  accentFillHoverBehavior,
  accentFillActiveBehavior,
  neutralFocusInnerAccentBehavior,
  forcedColorsStylesheetBehavior(
    css`
        :host(.accent) .control {
            forced-color-adjust: none;
            background: ${SystemColors.Highlight};
            color: ${SystemColors.HighlightText};
        }

        :host(.accent) .control:hover {
            background: ${SystemColors.HighlightText};
            border-color: ${SystemColors.Highlight};
            color: ${SystemColors.Highlight};
        }

        :host(.accent) .control:${focusVisible} {
            border-color: ${SystemColors.ButtonText};
            box-shadow: 0 0 0 2px ${SystemColors.HighlightText} inset;
        }

        :host(.accent.disabled) .control,
        :host(.accent.disabled) .control:hover {
            background: ${SystemColors.ButtonFace};
            border-color: ${SystemColors.GrayText};
            color: ${SystemColors.GrayText};
        }

        :host(.accent[href]) .control{
            background: ${SystemColors.LinkText};
            color: ${SystemColors.HighlightText};
        }

        :host(.accent[href]) .control:hover {
            background: ${SystemColors.ButtonFace};
            border-color: ${SystemColors.LinkText};
            box-shadow: none;
            color: ${SystemColors.LinkText};
            fill: currentcolor;
        }

        :host(.accent[href]) .control:${focusVisible} {
          border-color: ${SystemColors.LinkText};
          box-shadow: 0 0 0 2px ${SystemColors.HighlightText} inset;
      }
    `,
  ),
);

/**
 * @internal
 */
export const HypertextStyles = css`
    :host(.hypertext) {
        height: auto;
        font-size: inherit;
        line-height: inherit;
        background: transparent;
        min-width: 0;
    }

    :host(.hypertext) .control {
        display: inline;
        padding: 0;
        border: none;
        box-shadow: none;
        border-radius: 0;
        line-height: 1;
    }
    :host a.control:not(:link) {
        background-color: transparent;
        cursor: default;
    }
    :host(.hypertext) .control:link,
    :host(.hypertext) .control:visited {
        background: transparent;
        color: ${accentForegroundRestBehavior.var};
        border-bottom: calc(var(--outline-width) * 1px) solid ${accentForegroundRestBehavior.var};
    }
    :host(.hypertext) .control:hover {
        border-bottom-color: ${accentForegroundHoverBehavior.var};
    }
    :host(.hypertext) .control:active {
        border-bottom-color: ${accentForegroundActiveBehavior.var};
    }
    :host(.hypertext) .control:${focusVisible} {
        border-bottom: calc(var(--focus-outline-width) * 1px) solid ${neutralFocusBehavior.var};
    }
`.withBehaviors(
  accentForegroundRestBehavior,
  accentForegroundHoverBehavior,
  accentForegroundActiveBehavior,
  neutralFocusBehavior,
  forcedColorsStylesheetBehavior(
    css`
      :host(.hypertext) .control:${focusVisible} {
        color: ${SystemColors.LinkText};
        border-bottom-color: ${SystemColors.LinkText};
      }
    `,
  ),
);

/**
 * @internal
 */
export const LightweightButtonStyles = css`
    :host(.lightweight) {
        background: transparent;
        color: ${accentForegroundRestBehavior.var};
    }

    :host(.lightweight) .control {
        padding: 0;
        height: initial;
        border: none;
        box-shadow: none;
        border-radius: 0;
    }

    :host(.lightweight:hover) {
        color: ${accentForegroundHoverBehavior.var};
    }

    :host(.lightweight:active) {
        color: ${accentForegroundActiveBehavior.var};
    }

    :host(.lightweight) .content {
        position: relative;
    }

    :host(.lightweight) .content::before {
        content: "";
        display: block;
        height: calc(var(--outline-width) * 1px);
        position: absolute;
        top: calc(1em + 3px);
        width: 100%;
    }

    :host(.lightweight:hover) .content::before {
        background: ${accentForegroundHoverBehavior.var};
    }

    :host(.lightweight:active) .content::before {
        background: ${accentForegroundActiveBehavior.var};
    }

    :host(.lightweight) .control:${focusVisible} .content::before {
        background: ${neutralForegroundRestBehavior.var};
        height: calc(var(--focus-outline-width) * 1px);
    }

    :host(.lightweight.disabled) .content::before {
        background: transparent;
    }
`.withBehaviors(
  accentForegroundRestBehavior,
  accentForegroundHoverBehavior,
  accentForegroundActiveBehavior,
  accentForegroundHoverBehavior,
  neutralForegroundRestBehavior,
  forcedColorsStylesheetBehavior(
    css`
        :host(.lightweight) .control:hover,
        :host(.lightweight) .control:${focusVisible} {
            forced-color-adjust: none;
            background: ${SystemColors.ButtonFace};
            color: ${SystemColors.Highlight};
        }
        :host(.lightweight) .control:hover .content::before,
        :host(.lightweight) .control:${focusVisible} .content::before {
            background: ${SystemColors.Highlight};
        }

        :host(.lightweight.disabled) .control {
            forced-color-adjust: none;
            color: ${SystemColors.GrayText};
        }

        :host(.lightweight.disabled) .control:hover .content::before {
            background: none;
        }

        :host(.lightweight[href]) .control:hover,
        :host(.lightweight[href]) .control:${focusVisible} {
            background: ${SystemColors.ButtonFace};
            box-shadow: none;
            color: ${SystemColors.LinkText};
        }

        :host(.lightweight[href]) .control:hover .content::before,
        :host(.lightweight[href]) .control:${focusVisible} .content::before {
            background: ${SystemColors.LinkText};
        }
    `,
  ),
);

/**
 * @internal
 */
export const OutlineButtonStyles = css`
    :host(.outline) {
        background: transparent;
        border-color: ${neutralOutlineRestBehavior.var};
    }

    :host(.outline:hover) {
        border-color: ${neutralOutlineHoverBehavior.var};
    }

    :host(.outline:active) {
        border-color: ${neutralOutlineActiveBehavior.var};
    }

    :host(.outline) .control {
        border-color: inherit;
    }

    :host(.outline) .control:${focusVisible} {
        box-shadow: 0 0 0 calc((var(--focus-outline-width) - var(--outline-width)) * 1px) ${neutralFocusBehavior.var};
        border-color: ${neutralFocusBehavior.var};
    }

    :host(.outline.disabled) {
        border-color: ${neutralOutlineRestBehavior.var};
    }
`.withBehaviors(
  neutralOutlineRestBehavior,
  neutralOutlineHoverBehavior,
  neutralOutlineActiveBehavior,
  neutralFocusBehavior,
  forcedColorsStylesheetBehavior(
    css`
      :host(.outline.disabled) .control {
        border-color: ${SystemColors.GrayText};
      }
    `,
  ),
);

/**
 * @internal
 */
export const StealthButtonStyles = css`
  :host(.stealth) {
    background: ${neutralFillStealthRestBehavior.var};
  }

  :host(.stealth:hover) {
    background: ${neutralFillStealthHoverBehavior.var};
  }

  :host(.stealth:active) {
    background: ${neutralFillStealthActiveBehavior.var};
  }

  :host(.stealth.disabled) {
    background: ${neutralFillStealthRestBehavior.var};
  }
`.withBehaviors(
  neutralFillStealthRestBehavior,
  neutralFillStealthHoverBehavior,
  neutralFillStealthActiveBehavior,
  forcedColorsStylesheetBehavior(
    css`
        :host(.stealth) .control {
            forced-color-adjust: none;
            background-color: none;
            border-color: transparent;
            color: ${SystemColors.ButtonText};
            fill: currentcolor;
        }

        :host(.stealth:hover) .control {
            background-color: ${SystemColors.Highlight};
            border-color: ${SystemColors.Highlight};
            color: ${SystemColors.HighlightText};
            fill: currentcolor;
        }

        :host(.stealth:${focusVisible}) .control {
            box-shadow: 0 0 0 1px ${SystemColors.Highlight};
            color: ${SystemColors.HighlightText};
            fill: currentcolor;
        }

        :host(.stealth.disabled) {
          background-color: ${SystemColors.ButtonFace};
        }

        :host(.stealth.disabled) .control {
            background-color: ${SystemColors.ButtonFace};
            border-color: transparent;
            color: ${SystemColors.GrayText};
        }

        :host(.stealth[href]) .control {
            color: ${SystemColors.LinkText};
        }

        :host(.stealth:hover[href]) .control {
            background-color: ${SystemColors.LinkText};
            border-color: ${SystemColors.LinkText};
            color: ${SystemColors.HighlightText};
            fill: currentcolor;
        }

      :host(.stealth:${focusVisible}[href]) .control {
          box-shadow: 0 0 0 1px ${SystemColors.LinkText};
          color: ${SystemColors.LinkText};
          fill: currentcolor;
      }
    `,
  ),
);

# @fluentui/react version 8 release notes (draft)

## Breaking changes: specific components

### Button

The Button has been completely rewritten to be faster, smaller, and easier to customize. By default, Buttons now have no opinion about icons, menuing, or split button behavior, which has led to large bundle and performance hits for the most common cases in the past.

Please see the [`@fluentui/react-button` package README](https://github.com/microsoft/fluentui/blob/master/packages/react-button/README.md) for details about improvements and a migration guide.

If you would like to continue using the previous button components for now, update your imports to reference `@fluentui/react/lib/compat/Button`.

### Calendar

`Calendar` has been replaced with the version from the `@fluentui/react-date-time` package. This should be almost identical in visuals and functionality

- Converted styling from legacy SCSS to CSS-in-JS. Styling can now be customized using `ICalendarProps.styles`.
- Removed the following props (TODO: suggest alternatives)
  - `autoNavigateOnSelection`
  - `selectDateOnClick`
  - `shouldFocusOnMount`
  - `yearPickerHidden`

### ChoiceGroup

- Setting `checked` on individual options to indicate their checked state is no longer supported. Instead, use `defaultSelectedKey` or `selectedKey`.
- Moved `root` style to the actual root element and removed `applicationRole` style.
- Removed deprecated props and types:
  - `onChanged` from `IChoiceGroupProps` (use `onChange`)
  - `checked` from `IChoiceGroupOption`. (See above for alternative. Also note that this is still available via `IChoiceGroupOptionProps` for custom rendering purposes only, and will be set correctly by the parent `ChoiceGroup`.)
  - `applicationRole` from `IChoiceGroupStyles`
  - Type aliases `OnFocusCallback` and `OnChangeCallback`: use `IChoiceGroupOptionProps['onFocus']` and `IChoiceGroupOptionProps['onChange']`
- Only if manually rendering the `ChoiceGroupOption` component, the new prop `itemKey` is now required. (You can still use `key` when passing options via `IChoiceGroupProps.options`, which is by far the most common.)

### Coachmark

- Removed deprecated `isBeaconAnimating` and `isMeasured` style props

### DatePicker

`DatePicker` has been replaced with the version from the `@fluentui/react-date-time` package, which also uses the `Calendar` from that package. The only breaking changes are to `ICalendarProps` (see above).

### OverflowSet

- Contents of the `OverflowSet` are no longer wrapped in a `FocusZone`.
- Removed deprecated `focusZoneProps` and `doNotContainWithinFocusZone` from types.

### Pivot

- Removed deprecated and redundant props from v7, including: `initialSelectedKey` and `defaultSelectedIndex`. Use `selectedKey` or `defaultSelectedKey` to define the selected tab, and provide `itemKey` on pivot item children.
- `IPivotStyleProps` changes
  - Replaced `rootIsLarge` with `linkSize`.
  - Replaced `rootIsTabs` and `linkFormat`.
  - Removed deprecated prop `linkIsSelected`.

### Popup

- Updated signature of `onDismiss` to include the native `KeyboardEvent` as a possible type of the `ev` parameter: `onDismiss?: (ev?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement> | KeyboardEvent) => any`

### Rating

- The component now uses strict controlled behavior when the `rating` prop is provided. Use the new `defaultRating` prop to make the rating uncontrolled.
- Removed deprecated props `onChanged` (use `onChange`) and `ariaLabelId` (use `getAriaLabel`)
- `IRatingProps` now extends `React.HTMLAttributes` rather than `React.AllHTMLAttributes` (using the old interface was incorrect because it included some props which don't actually apply to a `div`)
- Passing `null` for `rating` is no longer supported. To determine whether the user has interacted with the rating yet, set `allowZeroStars: true` and check whether the rating is 0.
- Added `IRating.rating` property for accessing the current rating value via `componentRef`. (Use this instead if you were previously accessing `state.rating`.)
- Corrected type of `IRatingProp.onChange`'s `event` parameter to reflect how it's used internally. It should be `React.FormEvent<HTMLElement>`, not `React.FocusEvent<HTMLElement>`.

### SpinButton

- Simplified props to `ISpinButtonStyles` to include only the parts of the component to bring in line with other components. As a result, the following props have been removed (see below for migration tips):
  - `arrowButtonsContainerDisabled`
  - `inputDisabled`
  - `inputTextSelected`
  - `labelDisabled`
  - `spinButtonWrapperDisabled`
  - `spinButtonWrapperFocused`
  - `spinButtonWrapperHovered`
  - `spinButtonWrapperTopBottom`
- Replaced `getClassNames` legacy prop with `styles` prop to bring component consistent to other components and improve cachability of internal styles.

If you're using a removed `ISpinButtonStyles` prop, you can instead pass a style function which returns appropriate styles based on the current state of the component. For example, instead of setting `spinButtonWrapperFocused`, you can do this:

```tsx
<SpinButton styles={(props: ISpinButtonStyleProps) => {
  const { isFocused, theme } = props;
  return {
    spinButtonWrapper: isFocused && {
      outline: '5px solid ' + theme.palette.yellow,
    },
  };
}}>
```

### Shimmer

- Removed unused `componentRef` prop from `Shimmer` types as it doesn't use any public methods.

### SwatchColorPicker

- Removed deprecated props `positionInSet` (use `ariaPosInSet`) and `setSize` (use `ariaSetSize`).
- Added an `onChange` prop and deprecated `onColorChanged`.
- Deprecated `isControlled`. Provide `selectedId` for controlled behavior and `defaultSelectedId` for uncontrolled behavior.
- Selection state is now tracked internally based on `IColorCellProps.id`, not item index. Ensure that all color cells have a unique `id` property.

### TeachingBubble

- Removed unused `defaultProps` from TeachingBubbleContent.
- Removed `rootElementRef` from public API.

### TextField

- Moved MaskedTextField-specific props `mask`, `maskChar`, and `maskCharData` from the general `ITextFieldProps` to a new `IMaskedTextFieldProps`.

## Breaking changes: general

### Function component conversions

- The `ref` prop for such components no longer refers to a component class instance; instead, the ref is forwarded to the underlying DOM.
  - We will ensure all function components correctly return a reference to the root DOM element.
  - For components with an imperative API, you can still access that via `componentRef`.
  - See React's docs for [`useRef`](https://reactjs.org/docs/hooks-reference.html#useref) and [`forwardRef`](https://reactjs.org/docs/react-api.html#reactforwardref) for more on using refs with function components.
- The [deprecated `ReactDOM.findDOMNode` API](https://reactjs.org/docs/react-dom.html#finddomnode) can't be used to find root elements (this is a React limitation). Instead, use `ref` as described above.
- Class extension of most components is no longer supported.
  - Due to time constraints, not all components will be converted by the time of v8 release. However, they may be converted at any time in the future within a minor version.
  - Exception: Class extension of Pickers will continue to be supported for now since the current architecture relies on it. (This will change in a future major release, but not within v8.)
- Accessing `state` of converted components is no longer possible.
  - If you need a former state property which is not included in the relevant `IComponentName` interface, please file an issue and we can consider adding it.
- In your components which use the converted components, you may need to wrap certain test operations in `act` from `react-dom/test-utils`. [More details here.](https://reactjs.org/docs/test-utils.html#act)

### ThemeProvider

`ThemeProvider` is required to use if any button from `@fluentui/react/lib/Button` is used. We also deprecated `Fabric`, `Customizer` components in favor of using `ThemeProvider`.

Please see the [`@fluentui/react-theme-provider` package README](https://github.com/microsoft/fluentui/blob/master/packages/react-theme-provider/README.md) for details about usage and a migration guide.

### Keytips

Previously, `KeytipData` was built in different components which needed Keytip support. This added extra bundle size to our components. In version 8, we have removed `KeytipData` and `keytipProps` props from `Link`, `Toggle`, `Checkbox`, `ComboBox`, `Dropdown`, `SpinButton` and other non-compat `Button`s (the ones which are not exported from `lib/compat`).

Here is an example on how to migrate from this change:
Before:

```jsx
<Checkbox label="Checkbox" keytipProps={checkboxKeytips} />
```

After:

```jsx
import { useKeytipRef } from '@fluentui/react/lib/Keytips';

const checkboxRef = useKeytipRef({ keytipProps: checkboxKeytips });

<Checkbox label="Checkbox" ref={checkboxRef} />;
```

You can find more code examples on the public documentation site [here](https://developer.microsoft.com/en-us/fluentui#/controls/web/keytips).

#### Other call-outs

- If the component is disabled and you don't want to enable keytips in that case, make sure you are passing `disabled: true` to `keytipProps`. It's possible you weren't setting `disabled` previously and still worked because the value was populated within the component which uses `KeytipData`.
- If you have another `ref` that needs to be passed to a component apart from the `ref` returned by `useKeytipRef`, you can use `useMergedRefs` from `@fluentui/react-hooks` to merge multiple refs into one then pass it to the component.

### Component package moves and renames

In addition to the rename of `office-ui-fabric-react` to `@fluentui/react`, most components have been moved to either a new **internal use only** package `@fluentui/react-internal`, or to individual component packages. This means **deep path imports will no longer work.** We've added root-level export files for most things that were intended to be part of the public API, but if anything is missing, please file an issue.

Note that directly importing from the `@fluentui/react-internal` package (the root or any file within it) is **not supported**, and the structure of this package may change at any time. Importing from individual component packages or `@fluentui/react` top-level files is fine.

### Discontinued packages

- Discontinue `@fluentui/fluent-theme` package in favor of `@fluentui/theme` package; removed from `master`.

### Others

- `Button` and `Card` are new components that break from their previous implementation.
- `WindowProvider` is required for child windows/embeds.
- `FluentStyles` is removed from `experiments` package.
- Removed various files which were originally in `office-ui-fabric-react` and not intended to be part of the public API:
  - `office-ui-fabric-react/src/components/Theme/defaultTheme.ts` (use `@fluentui/theme`)
  - `office-ui-fabric-react/src/customizations/TeamsTheme.ts` (use `@fluentui/theme-samples`)
  - `office-ui-fabric-react/src/utilities/exampleData.ts` (use `@fluentui/example-data`)

## Minor changes

### Pivot

- Updated enums to string union type: `PivotLinkFormat`, `PivotLinkSize`. (#13370)

### FocusTrapZone

- `FocusTrapZone's` `FocusStack` now takes an ID instead of component object.

## New features

- Pivot supports displaying an overflow menu when there is not enough room to display all of the tabs. This can be enabled by setting `overflowBehavior="menu"` on the Pivot.

## Other notable changes

- `styles` prop backward compat solution.
- css variables and IE 11 solution.

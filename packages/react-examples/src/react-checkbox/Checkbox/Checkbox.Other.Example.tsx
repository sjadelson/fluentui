import * as React from 'react';
import { Checkbox, ICheckboxProps } from '@fluentui/react-checkbox';
import { Link } from '@fluentui/react/lib/Link';
import { Stack } from '@fluentui/react/lib/Stack';

// Optional extra props to pass through to the input element
const inputProps: ICheckboxProps['inputProps'] = {
  onFocus: () => console.log('Checkbox is focused'),
  onBlur: () => console.log('Checkbox is blurred'),
};
// Used to add spacing between example checkboxes
const stackTokens = { childrenGap: 10 };

export const CheckboxOtherExample: React.FunctionComponent = () => {
  // Only for the first checkbox, which is controlled
  const [isChecked, setIsChecked] = React.useState(true);
  const onChange = React.useCallback(
    (ev?: React.FormEvent<HTMLElement | HTMLInputElement>, checked?: boolean): void => {
      setIsChecked(!!checked);
    },
    [],
  );

  return (
    <Stack tokens={stackTokens}>
      <Checkbox label="Controlled checkbox" checked={isChecked} onChange={onChange} />

      <Checkbox label='Checkbox rendered with boxSide "end"' boxSide="end" />

      <Checkbox label="Checkbox with extra props for the input" inputProps={inputProps} />

      <Checkbox label="Checkbox with link inside the label" onRenderLabel={_renderLabelWithLink} />
    </Stack>
  );
};

function _renderLabelWithLink() {
  return (
    <span>
      Custom-rendered label with a link{' '}
      <Link href="https://www.microsoft.com" target="_blank">
        go to Microsoft home page
      </Link>
    </span>
  );
}

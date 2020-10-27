import * as React from 'react';
import { DefaultButton } from '@fluentui/react/lib/compat/Button';
import { DatePicker, IDatePicker } from '@fluentui/react-date-time';
import { mergeStyleSets } from '@fluentui/react/lib/Styling';

const styles = mergeStyleSets({
  root: { selectors: { '> *': { marginBottom: 15 } } },
  control: { maxWidth: 300, marginBottom: 15 },
});

export const DatePickerInputExample: React.FunctionComponent = () => {
  const [value, setValue] = React.useState<Date | undefined>();
  const datePickerRef = React.useRef<IDatePicker>(null);

  const onClick = React.useCallback((): void => {
    setValue(undefined);
  }, []);

  return (
    <div className={styles.root}>
      <div>
        Clicking the input field will open the DatePicker, and clicking the field again will dismiss the DatePicker and
        allow text input. When using keyboard navigation (tabbing into the field), text input is allowed by default, and
        pressing Enter will open the DatePicker.
      </div>
      <DatePicker
        label="Start date"
        allowTextInput
        ariaLabel="Select a date"
        value={value}
        onSelectDate={setValue as (date: Date | null | undefined) => void}
        componentRef={datePickerRef}
        className={styles.control}
      />
      <DefaultButton onClick={onClick} text="Clear" />
    </div>
  );
};

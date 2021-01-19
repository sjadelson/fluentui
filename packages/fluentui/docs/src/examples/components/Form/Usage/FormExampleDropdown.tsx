import * as React from 'react';
import { Form } from '@fluentui/react-northstar';

const labelId = 'choose-friend-label';

const FormExample = () => (
  <Form
    onSubmit={() => {
      alert('Form submitted');
    }}
  >
    <Form.Dropdown
      label={{ content: `Your best friend's name is:`, id: labelId }}
      items={['John Doe', 'Dohn Joe', 'John Joe', 'Dohn Doe']}
      aria-labelledby={labelId}
      search={true}
      placeholder="Choose a friend"
    />
    <Form.Button content="Submit" />
  </Form>
);

export default FormExample;

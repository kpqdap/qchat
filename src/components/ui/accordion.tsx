import * as Accordion from '@radix-ui/react-accordion';

export default () => (
<Accordion.Root type="multiple">
    <Accordion.Item value="unique-value">
      <Accordion.Header>
        <Accordion.Trigger />
      </Accordion.Header>
      <Accordion.Content />
    </Accordion.Item>
  </Accordion.Root>
);

// See https://www.radix-ui.com/primitives/docs/components/accordion for implementation configuration
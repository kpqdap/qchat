import * as ContextMenu from '@radix-ui/react-context-menu';
export default () => (
  <ContextMenu.Root>
    <ContextMenu.Trigger />
    <ContextMenu.Portal>
      <ContextMenu.Content>
        <ContextMenu.Label />
        <ContextMenu.Item />
        <ContextMenu.Group>
          <ContextMenu.Item />
        </ContextMenu.Group>
        <ContextMenu.CheckboxItem>
          <ContextMenu.ItemIndicator />
        </ContextMenu.CheckboxItem>
        <ContextMenu.RadioGroup>
        <ContextMenu.RadioItem value="example-value">
            <ContextMenu.ItemIndicator />
          </ContextMenu.RadioItem>
        </ContextMenu.RadioGroup>
        <ContextMenu.Sub>
          <ContextMenu.SubTrigger />
          <ContextMenu.Portal>
            <ContextMenu.SubContent />
          </ContextMenu.Portal>
        </ContextMenu.Sub>
        <ContextMenu.Separator />
      </ContextMenu.Content>
    </ContextMenu.Portal>
  </ContextMenu.Root>
);
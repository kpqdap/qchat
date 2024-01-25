import React, { forwardRef, ReactNode, Ref } from 'react';
import classNames from 'classnames';
import * as Accordion from '@radix-ui/react-accordion';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import Typography from "@/components/typography";

type AccordionItemProps = {
  children: ReactNode;
  className?: string;
  value: string;
};

const AccordionItem = forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ children, className, ...props }, forwardedRef) => (
    <Accordion.Item
      className={classNames(
        // Class names
      )}
      {...props}
      ref={forwardedRef}
    >
      {children}
    </Accordion.Item>
  )
);

AccordionItem.displayName = 'AccordionItem'; // Add display name

type AccordionTriggerProps = {
  children: ReactNode;
  className?: string;
};

const AccordionTrigger = forwardRef<HTMLDivElement, AccordionTriggerProps>(
  ({ children, className, ...props }, forwardedRef) => (
    <Accordion.Header className="flex">
      <Accordion.Trigger
        className={classNames(
          // Class names
        )}
        {...props}
        ref={forwardedRef as Ref<HTMLButtonElement>}
      >
        <Typography variant="h5">{children}</Typography>
        <ChevronDownIcon
          className="text-[var(--accent)] ease-custom-ease transition-transform duration-300 group-data-[state=open]:rotate-180"
          aria-hidden
        />
      </Accordion.Trigger>
    </Accordion.Header>
  )
);

AccordionTrigger.displayName = 'AccordionTrigger'; // Add display name

type AccordionContentProps = {
  children: ReactNode;
  className?: string;
};

const AccordionContent = forwardRef<HTMLDivElement, AccordionContentProps>(
  ({ children, className, ...props }, forwardedRef) => (
    <Accordion.Content
      className={classNames(
        // Class names
      )}
      {...props}
      ref={forwardedRef}
    >
      <div className="py-[15px] px-5">
        <Typography variant="p">{children}</Typography>
      </div>
    </Accordion.Content>
  )
);

AccordionContent.displayName = 'AccordionContent'; // Add display name

const QldAccordion = () => (
  <Accordion.Root
    className="bg-[var(--card)] w-[300px] rounded-[var(--radius)] shadow-[0_2px_10px] shadow-[var(--card-foreground)]/5"
    type="single"
    defaultValue="item-1"
    collapsible
  >
    {/* Accordion Items Here */}
  </Accordion.Root>
);

export default QldAccordion;

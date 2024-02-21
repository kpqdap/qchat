export const Paragraph = ({ children, className }: any) => {
  return <div className={String(className)} bg-altbackground text-primary>{children}</div>;
};

export const paragraph = {
  render: "Paragraph",
};

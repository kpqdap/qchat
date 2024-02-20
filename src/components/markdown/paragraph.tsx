export const Paragraph = ({ children, className }: any) => {
  return <div className={String(className)} bg-altBackground text-primary>{children}</div>;
};

export const paragraph = {
  render: "Paragraph",
};

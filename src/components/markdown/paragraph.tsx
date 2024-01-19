export const Paragraph = ({ children, className }: any) => {
  return <div className={String(className)}>{children}</div>;
};

export const paragraph = {
  render: "Paragraph",
};

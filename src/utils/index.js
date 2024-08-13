export const shortenAddress = (address) => {
  const start = address.slice(0, 6);
  const end = address.slice(-6);
  return `${start}...${end}`;
};

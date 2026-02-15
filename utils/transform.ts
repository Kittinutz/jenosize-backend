const transformTextToKebabCase = (text: string): string => {
  return text.split(' ').join('-').toLowerCase();
};

export { transformTextToKebabCase };

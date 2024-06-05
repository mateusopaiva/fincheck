export function currencyStringToNumber(value: string) {
  // const sanitizedString = value.replace(/\./g, '').replace(',', '.');
  const sanitizedString = value
  return Number(sanitizedString);
}

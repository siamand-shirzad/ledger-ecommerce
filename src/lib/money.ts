/**
 * The API stores price/unitPrice/totalPrice/lineTotal as plain integers.
 * This assumes "major units" (e.g. dollars) since the swagger gives no
 * currency/minor-unit hint. Adjust divisor + currency here if your
 * backend actually stores cents.
 */
export function formatMoney(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(amount)
}

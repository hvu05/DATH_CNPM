export const formatVNCurrency = new Intl.NumberFormat('vi-VN', {
    maximumFractionDigits: 1,
});

export const formatCurrencyCompactVN = (value: number): string => {
    if (value >= 1_000_000_000) {
        return `${formatVNCurrency.format(value / 1_000_000_000)} tỷ ₫`;
    } else if (value >= 1_000_000) {
        return `${formatVNCurrency.format(value / 1_000_000)} tr ₫`;
    } else if (value >= 1_000) {
        return `${formatVNCurrency.format(value / 1_000)} nghìn ₫`;
    } else {
        return `${formatVNCurrency.format(value)} ₫`;
    }
};

export const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
});

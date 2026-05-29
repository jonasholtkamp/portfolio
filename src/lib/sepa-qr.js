export const normalizeAmount = (value) => {
  const cleaned = value.trim().replace(',', '.');

  if (!cleaned) {
    return '';
  }

  const amount = Number(cleaned);

  if (!Number.isFinite(amount) || amount <= 0) {
    return '';
  }

  return `EUR${amount.toFixed(2)}`;
};

export const createSepaPayload = ({ iban, beneficiary, serviceCode, amountInput, reference }) => {
  const amount = normalizeAmount(amountInput);
  const remittanceText = reference.trim();

  return [
    'BCD',
    '002',
    '1',
    serviceCode,
    '',
    beneficiary,
    iban.replaceAll(' ', ''),
    amount,
    '',
    '',
    remittanceText,
    '',
  ].join('\n');
};

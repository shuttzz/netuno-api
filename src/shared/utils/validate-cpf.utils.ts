export const validateCpf = (cpf: string): boolean => {
  const cpfWhitouDots = cpf.replace(/\./g, '');
  const cpfWhitoutTrace = cpfWhitouDots.replace('-', '');

  let soma = 0;

  if (
    cpfWhitoutTrace === '00000000000' ||
    cpfWhitoutTrace === '11111111111' ||
    cpfWhitoutTrace === '22222222222' ||
    cpfWhitoutTrace === '33333333333' ||
    cpfWhitoutTrace === '44444444444' ||
    cpfWhitoutTrace === '55555555555' ||
    cpfWhitoutTrace === '66666666666' ||
    cpfWhitoutTrace === '77777777777' ||
    cpfWhitoutTrace === '88888888888' ||
    cpfWhitoutTrace === '99999999999' ||
    cpfWhitoutTrace.length !== 11
  ) {
    return false;
  }

  for (let i = 1; i <= 9; i++) {
    soma = soma + parseInt(cpfWhitoutTrace.substring(i - 1, i)) * (11 - i);
  }

  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) {
    resto = 0;
  }

  if (resto !== parseInt(cpfWhitoutTrace.substring(9, 10))) {
    return false;
  }

  soma = 0;
  for (let k = 1; k <= 10; k++) {
    soma = soma + parseInt(cpfWhitoutTrace.substring(k - 1, k)) * (12 - k);
  }

  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) {
    resto = 0;
  }

  if (resto !== parseInt(cpfWhitoutTrace.substring(10, 11))) {
    return false;
  }

  return true;
};

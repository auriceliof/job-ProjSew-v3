// Mascara para CPF -> 000.000.000-00
export function maskCPF(value: string): string {
  return value
    .replace(/\D/g, "") // remove tudo que não é número
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
    .slice(0, 14); // limita no tamanho do CPF
}

// Mascara para CNPJ -> 00.000.000/0000-00
export function maskCNPJ(value: string): string {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1/$2")
    .replace(/(\d{4})(\d{1,2})$/, "$1-$2")
    .slice(0, 18);
}

// Mascara para Telefone -> (00) 00000-0000
export function maskPhone(value: string): string {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .slice(0, 15);
}

// Mascara para CEP -> 00000-000
export function maskCEP(value: string): string {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .slice(0, 9);
}

// -- Função para formatar data e hora no formato Brazil "dd/mm/yyyy" -- /

// Converte "YYYY-MM-DD" (ou Date) para "dd/mm/yyyy" sem problemas de fuso.
export function formatDateBR(input: string | Date | null | undefined): string {
  if (!input) return "";

  // Se vier como string "YYYY-MM-DD" ou ISO, formata por string (sem new Date)
  if (typeof input === "string") {
    const s = input.slice(0, 10); // pega só a parte da data
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
    if (m) {
      const [, yyyy, mm, dd] = m;
      return `${dd}/${mm}/${yyyy}`;
    }
    // fallback: tentar Date apenas se não estiver no formato esperado
    const d = new Date(input);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleDateString("pt-BR", { timeZone: "UTC" }); // estável
  }

  // Se já for Date, monte yyyy-mm-dd local e formate
  const d = input as Date;
  if (isNaN(d.getTime())) return "";
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${dd}/${mm}/${yyyy}`;
}

// Helper para garantir "YYYY-MM-DD" sem fuso (de string ou Date)
export function toYMD(input: string | Date | null | undefined): string | "" {
  if (!input) return "";
  if (typeof input === "string") return input.slice(0, 10);
  const d = input as Date;
  if (isNaN(d.getTime())) return "";
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}


// -- Função para formatar o CPF "123.456.789-00" --//
export function formatCPF(cpfRaw?: string | null) {
  if (!cpfRaw ) return "nenhum";
  const digits = cpfRaw.replace(/\D/g, '');
  if (digits.length !== 11) return cpfRaw;
  return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

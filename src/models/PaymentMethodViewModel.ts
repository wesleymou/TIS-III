export type PaymentMethod = {
  id: number;
  name: string;
};

export function getAllPaymentMethods(): PaymentMethod[] {
  return [
    { id: 1, name: "Dinheiro" },
    { id: 2, name: "Crédito" },
    { id: 3, name: "Débito" },
    { id: 4, name: "Outros" }
  ];
}

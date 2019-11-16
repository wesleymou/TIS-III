export type StatusClasses = {
  [n: number]: {
    id: number;
    name: string;
    className: string;
  };
};

export function getAllSaleStatus(): StatusClasses {
  return {
    1: {
      id: 1,
      name: "Pendente",
      className: "badge badge-warning"
    },
    2: {
      id: 2,
      name: "Cancelada",
      className: "badge badge-secundary"
    },
    3: {
      id: 3,
      name: "Finalizada",
      className: "badge badge-success"
    },
    4: {
      id: 4,
      name: "Em atraso",
      className: "badge badge-danger"
    }
  };
}

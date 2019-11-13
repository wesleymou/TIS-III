export type StatusClasses = {
  [n: number]: {
    name: string,
    className: string
  }
};

export function getAllSaleStatus():StatusClasses{
return {
  1:{ 
     name: 'Pendente',
     className: 'badge badge-warning'
 },
   2: {
     name: 'Cancelada',
     className: 'badge badge-secundary'
   },
   3:{
     name: 'Finalizada',
     className: 'badge badge-success'
   },
   4: {
     name: 'Em atraso',
     className: 'badge badge-danger'
   }
 };
}
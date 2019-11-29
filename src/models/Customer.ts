export default class Customer {
  id: number = 0;
  fullName: string = '';
  nickname: string = '';
  phone: string = '';
  email: string = '';
  address: string = '';
  dateCreated?: Date;
  debit?: number = 0;
  overdueSince?: Date;
}

export function mapRowToCustomer(row: any): Customer {
  return {
    id: row['id'] || 0,
    fullName: row['fullname'] || '',
    nickname: row['nickname'] || '',
    address: row['address'] || '',
    phone: row['phone'] || '',
    email: row['email'] || '',
    dateCreated: row['date_created'],
    debit: row['debit'],
    overdueSince: row['overdue_since']
  }
}

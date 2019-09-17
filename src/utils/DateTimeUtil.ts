
// Referencia de formatação:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat

const timeOptions = {
  hour: '2-digit',
  minute: '2-digit',
};

const dateOptions = {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
}

const dateFormat = new Intl.DateTimeFormat('pt-br', { ...dateOptions });
const timeFormat = new Intl.DateTimeFormat('pt-br', { ...timeOptions });
const dateTimeFormat = new Intl.DateTimeFormat('pt-br', { ...dateOptions, ...timeOptions });

class DateTimeUtil {
  static formatDate(date: Date | undefined | null): string {
    return date ? dateFormat.format(date) : '';
  }

  static formatTime(date: Date | undefined | null): string {
    return date ? timeFormat.format(date) : '';
  }

  static formatDateTime(date: Date | undefined | null): string {
    return date ? dateTimeFormat.format(date) : '';
  }
}

export default DateTimeUtil;

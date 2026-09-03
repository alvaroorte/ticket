export const toDMYdateFormat = (date: string) => {
  const [year, month, day] = date.split('-');
  return `${day}/${month}/${year}`;
}

export const toYMDdateFormat = (date: string) => {
  const [day, month, year] = date.split('/');
  return `${year}-${month}-${day}`;
}

export function isDateDBFormatValid(date: string) {
  if (date) {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    return regex.test(date);
  } else {
    return '';
  }
}
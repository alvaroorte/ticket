export const toDMYdateFormat = (date: string) => {
  const [year, month, day] = date.split('-');
  return `${day}/${month}/${year}`;
}

export const toYMDdateFormat = (date: string) => {
  const [day, month, year] = date.split('/');
  return `${year}-${month}-${day}`;
}

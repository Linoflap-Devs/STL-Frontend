// Date Formatter
const formatDate = (date: string | null): string => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = `${d.getMonth() + 1}`.padStart(2, '0');
  const day = `${d.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Helper function to check if dates match (ignoring time)
const datesMatch = (dateString1: string, dateString2: string): boolean => {
  return formatDate(dateString1) === formatDate(dateString2);
}


/**
 * Format a date string into dd/mm/yyyy format.
 * @param {string} dateString - The date string to format (e.g., '2024-08-10').
 * @returns {string} - The formatted date string (e.g., '10/08/2024').
 */

// DD MONTH YYYY
export const formatFullDate = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const year = date.getFullYear();

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const month = monthNames[date.getMonth()];

  return `${day} ${month} ${year}`;
};

// DD/MM/YYYY
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export const getYear = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  return year.toString();
};

export const formatVoteAverage = (voteAverage) => {
  if (typeof voteAverage === 'number') {
    return voteAverage.toFixed(1);
  } else {
    return '0.0';
  }
};

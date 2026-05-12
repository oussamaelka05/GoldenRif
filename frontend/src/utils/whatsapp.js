export const waLink = (number, message = '') => {
  if (!number) return '#';
  const clean = number.replace(/[^\d]/g, '');
  const text = message ? `?text=${encodeURIComponent(message)}` : '';
  return `https://wa.me/${clean}${text}`;
};

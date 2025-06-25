
export const darkenColor = (color: string, amount: number): string => {
  // Remove the hash if it exists
  color = color.replace('#', '');

  const num = parseInt(color, 16);
  let r = (num >> 16);
  let g = ((num >> 8) & 0x00FF);
  let b = (num & 0x0000FF);

  // Darken each channel
  r = Math.round(r * (1 - amount));
  g = Math.round(g * (1 - amount));
  b = Math.round(b * (1 - amount));

  // Convert back to hex
  return "#" + (
    (r << 16) + 
    (g << 8) + 
    b
  ).toString(16).padStart(6, '0');
};

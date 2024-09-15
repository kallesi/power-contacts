export function getInitials(fullName:string) {
  const names = fullName.split(' ');
  if (names.length === 1) {
    return names[0][0].toUpperCase();
  }
  return (names[0][0] + names[names.length - 1][0]).toUpperCase();
}
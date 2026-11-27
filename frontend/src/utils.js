export function formatDate(isoDate) {
  return new Date(isoDate).toLocaleDateString('pt-PT');
}
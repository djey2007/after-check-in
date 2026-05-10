const cellSizeDegrees = 0.05;

export function getApproxLocationCell(latitude: number, longitude: number) {
  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude) ||
    latitude < -90 ||
    latitude > 90 ||
    longitude < -180 ||
    longitude > 180
  ) {
    return null;
  }

  const latCell = Math.floor((latitude + 90) / cellSizeDegrees);
  const lonCell = Math.floor((longitude + 180) / cellSizeDegrees);

  return `cell_${latCell}_${lonCell}`;
}

export function isApproxLocationCell(value: string) {
  return /^cell_\d{1,5}_\d{1,5}$/.test(value);
}

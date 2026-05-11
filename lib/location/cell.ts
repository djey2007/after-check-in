const cellSizeDegrees = 0.05;
export const approximateLocationRadiusKm = 3;

export type ApproxLocationCellBounds = {
  minLatitude: number;
  minLongitude: number;
  maxLatitude: number;
  maxLongitude: number;
};

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

export function getApproxLocationCellBounds(
  value: string
): ApproxLocationCellBounds | null {
  if (!isApproxLocationCell(value)) {
    return null;
  }

  const [, rawLatCell, rawLonCell] = value.split("_");
  const latCell = Number(rawLatCell);
  const lonCell = Number(rawLonCell);

  if (!Number.isInteger(latCell) || !Number.isInteger(lonCell)) {
    return null;
  }

  const minLatitude = latCell * cellSizeDegrees - 90;
  const minLongitude = lonCell * cellSizeDegrees - 180;

  return {
    minLatitude,
    minLongitude,
    maxLatitude: minLatitude + cellSizeDegrees,
    maxLongitude: minLongitude + cellSizeDegrees
  };
}

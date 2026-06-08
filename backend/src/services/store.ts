import type { ProcessedAdData } from "../types";

let adData: ProcessedAdData[] = [];

export const setData = (data: ProcessedAdData[]) => {
  adData = data;
};

export const getAllData = (): ProcessedAdData[] => {
  return adData;
};

export const getFilteredData = (
  filters: Record<string, any>,
): ProcessedAdData[] => {
  return adData.filter((item) => {
    return Object.entries(filters).every(([key, value]) => {
      if (!value) return true;
      return String(item[key as keyof ProcessedAdData]) === String(value);
    });
  });
};

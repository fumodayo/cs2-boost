export interface ILevelFarmingConfig {
  _id: string;
  unitPrice: number;
  createdAt: string;
  updatedAt: string;
}

export interface IPremierRateTier {
  start: number;
  end: number;
  rate: number;
}

export interface IPremierRegionRates {
  name: string;
  value: string;
  rates: IPremierRateTier[];
}

export interface IPremierRatesConfig {
  _id: string;
  unitPrice: number;
  regions: IPremierRegionRates[];
  createdAt: string;
  updatedAt: string;
}

export interface IWingmanRankRate {
  code: string;
  name: string;
  image: string;
  rate: number;
}

export interface IWingmanRegionRates {
  name: string;
  value: string;
  rates: IWingmanRankRate[];
}

export interface IWingmanRatesConfig {
  _id: string;
  unitPrice: number;
  regions: IWingmanRegionRates[];
  createdAt: string;
  updatedAt: string;
}

export interface IUpdatePremierConfigPayload {
  unitPrice: number;
}

export interface IUpdateRegionRatesPayload {
  rates: IPremierRateTier[];
}

export interface IUpdateWingmanConfigPayload {
  unitPrice: number;
}

export interface IUpdateWingmanRegionPayload {
  rates: IWingmanRankRate[];
}

export interface IUpdateLevelFarmingConfigPayload {
  unitPrice: number;
}

export interface IUpdateUnitPricePayload {
  unitPrice: number;
}

export * from './state'
export * from './nuxt'

export {}
declare global {
  interface Window {
    web3?: any;
    platform?: any;
  }
}

// OpenSea
export interface OpenSeaAssetDetails {
    tokenId: string;
    imageUrl: string;
    name: string;
    traits: Array<Trait>;
    owner: {
      address: string;
    },
    assetContract: {
      address: string;
      optionalValue?: string;
    },
    optionalValue?: string;
}
interface Trait {
  traitType: string;
  value: string;
  traitCount: number;
  optionalValue?: string;
}

// 3 Box
export interface Profile {
    name: string;
    image: Array<ImageInfo>;
  }

interface ImageInfo {
  contentUrl: Object;
}

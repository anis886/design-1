import { BrandCollection, VehicleModel } from './model-collection.models';

const IMG = 'assets/models/bmw';

const vehicle = (
  v: Omit<VehicleModel, 'brand' | 'thumbnail' | 'detailRoute' | 'galleryImages'> &
    Partial<Pick<VehicleModel, 'galleryImages'>>,
): VehicleModel => ({
  brand: 'BMW',
  thumbnail: `${IMG}/${v.slug}-thumb.png`,
  detailRoute: ['/cars', 'bmw', v.slug],
  galleryImages: [],
  ...v,
});

/**
 * BMW collection. Specs are intentionally null until verified figures are supplied —
 * the UI renders "—" for missing values (matches the reference).
 *
 * MISSING ASSETS: full showroom gallery photography (front ¾, rear ¾, side) exists only for the
 * M3 Competition. The other five models fall back to their explorer thumbnail.
 */
export const BMW_COLLECTION: BrandCollection = {
  slug: 'bmw',
  brand: 'BMW',
  categories: ['Coupe', 'Sedan', 'SUV'],
  defaultModelId: 'bmw-m3-competition',
  backRoute: ['/brands'],
  models: [
    vehicle({
      id: 'bmw-m2',
      slug: 'm2',
      name: 'BMW M2',
      bodyType: 'Coupe',
      fuelType: 'Petrol',
      specs: { power: null, acceleration: null },
      keywords: ['compact', 'two-door', 'rear-wheel drive', 'track', 'blue'],
    }),
    vehicle({
      id: 'bmw-m3-competition',
      slug: 'm3-competition',
      name: 'BMW M3 Competition',
      bodyType: 'Sedan',
      fuelType: 'Petrol',
      specs: { power: null, acceleration: null },
      keywords: ['four-door', 'saloon', 'family', 'performance', 'green'],
      galleryImages: [
        { view: 'front-three-quarter', src: `${IMG}/m3-competition-front.jpg`, alt: 'Green BMW M3 Competition, front three-quarter view in a glass-walled showroom', width: 948, height: 496 },
        { view: 'rear-three-quarter', src: `${IMG}/m3-competition-rear.jpg`, alt: 'Green BMW M3 Competition, rear three-quarter view', width: 320, height: 118 },
        { view: 'side-profile', src: `${IMG}/m3-competition-side.jpg`, alt: 'Green BMW M3 Competition, side profile', width: 314, height: 118 },
      ],
    }),
    vehicle({
      id: 'bmw-m4-competition',
      slug: 'm4-competition',
      name: 'BMW M4 Competition',
      bodyType: 'Coupe',
      fuelType: 'Petrol',
      specs: { power: null, acceleration: null },
      keywords: ['two-door', 'grand tourer', 'performance', 'yellow'],
    }),
    vehicle({
      id: 'bmw-m5',
      slug: 'm5',
      name: 'BMW M5',
      bodyType: 'Sedan',
      fuelType: 'Petrol',
      specs: { power: null, acceleration: null },
      keywords: ['executive', 'saloon', 'four-door', 'luxury', 'black'],
    }),
    vehicle({
      id: 'bmw-x5-m-competition',
      slug: 'x5-m-competition',
      name: 'BMW X5 M Competition',
      bodyType: 'SUV',
      fuelType: 'Petrol',
      specs: { power: null, acceleration: null },
      keywords: ['suv', 'all-wheel drive', 'family', 'utility', 'white'],
    }),
    vehicle({
      id: 'bmw-m4-convertible',
      slug: 'm4-convertible',
      name: 'BMW M4 Convertible',
      bodyType: 'Convertible',
      fuelType: 'Petrol',
      specs: { power: null, acceleration: null },
      keywords: ['cabriolet', 'open-top', 'soft top', 'roadster', 'red'],
    }),
  ],
};

export const BRAND_COLLECTIONS: Record<string, BrandCollection> = {
  [BMW_COLLECTION.slug]: BMW_COLLECTION,
};

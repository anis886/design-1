export type BodyType = 'Coupe' | 'Sedan' | 'SUV' | 'Convertible';
export type FuelType = 'Petrol' | 'Diesel' | 'Hybrid' | 'Electric';

export type GalleryView = 'front-three-quarter' | 'rear-three-quarter' | 'side-profile';

export interface VehicleImage {
  view: GalleryView;
  src: string;
  alt: string;
  width: number;
  height: number;
}

/** Only verified figures belong here; leave null rather than estimate. */
export interface VehicleSpecifications {
  /** Peak output in hp. */
  power: number | null;
  /** 0–100 km/h in seconds. */
  acceleration: number | null;
}

export interface VehicleModel {
  id: string;
  slug: string;
  brand: string;
  name: string;
  bodyType: BodyType;
  fuelType: FuelType;
  /** Transparent-background side thumbnail for the explorer list. */
  thumbnail: string;
  /** Front ¾, rear ¾, side profile — same car, same colour. Empty when photography is missing. */
  galleryImages: VehicleImage[];
  specs: VehicleSpecifications;
  keywords: string[];
  detailRoute: string[];
}

export interface BrandCollection {
  slug: string;
  brand: string;
  /** Category tabs shown above the list (in addition to "All"). */
  categories: BodyType[];
  defaultModelId: string;
  /** Fallback for the BACK control when there is no in-app history. */
  backRoute: string[];
  models: VehicleModel[];
}

export type SortOrder = 'default' | 'name-asc' | 'name-desc' | 'power-desc';

export const GALLERY_VIEWS: { view: GalleryView; label: string }[] = [
  { view: 'front-three-quarter', label: 'Front three-quarter' },
  { view: 'rear-three-quarter', label: 'Rear three-quarter' },
  { view: 'side-profile', label: 'Side profile' },
];

import { Injectable, computed, signal } from '@angular/core';
import { BodyType, BrandCollection, FuelType, GALLERY_VIEWS, SortOrder, VehicleModel } from './model-collection.models';

/** All UI state for one collection page. Provided per page instance. */
@Injectable()
export class ModelCollectionStore {
  private readonly _collection = signal<BrandCollection | null>(null);

  readonly query = signal('');
  readonly bodyTypes = signal<ReadonlySet<BodyType>>(new Set());
  readonly fuelTypes = signal<ReadonlySet<FuelType>>(new Set());
  readonly sort = signal<SortOrder>('default');
  readonly selectedId = signal<string | null>(null);
  readonly galleryIndex = signal(0);

  readonly collection = computed(() => this._collection());
  readonly models = computed(() => this._collection()?.models ?? []);
  readonly total = computed(() => this.models().length);

  /** Filter options derived from data, so nothing unsupported is offered. */
  readonly availableBodyTypes = computed(() => unique(this.models().map((m) => m.bodyType)));
  readonly availableFuelTypes = computed(() => unique(this.models().map((m) => m.fuelType)));
  readonly hasPowerData = computed(() => this.models().some((m) => m.specs.power !== null));
  readonly activeFilterCount = computed(() => this.bodyTypes().size + this.fuelTypes().size);

  readonly visible = computed<VehicleModel[]>(() => {
    const q = this.query().trim().toLowerCase();
    const bodies = this.bodyTypes();
    const fuels = this.fuelTypes();
    const list = this.models().filter((m) => {
      if (bodies.size && !bodies.has(m.bodyType)) return false;
      if (fuels.size && !fuels.has(m.fuelType)) return false;
      if (!q) return true;
      const hay = [m.name, m.bodyType, m.fuelType, ...m.keywords].join(' ').toLowerCase();
      return q.split(/\s+/).every((term) => hay.includes(term));
    });
    switch (this.sort()) {
      case 'name-asc':
        return [...list].sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc':
        return [...list].sort((a, b) => b.name.localeCompare(a.name));
      case 'power-desc':
        return [...list].sort((a, b) => (b.specs.power ?? -1) - (a.specs.power ?? -1));
      default:
        return list;
    }
  });

  readonly selected = computed<VehicleModel | null>(
    () => this.models().find((m) => m.id === this.selectedId()) ?? this.models()[0] ?? null,
  );
  /** Position in the full collection — stable "02 / 06" numbering. */
  readonly selectedNumber = computed(() => {
    const s = this.selected();
    return s ? this.models().indexOf(s) + 1 : 0;
  });
  private readonly visibleIndex = computed(() => {
    const s = this.selected();
    return s ? this.visible().indexOf(s) : -1;
  });
  readonly hasPrevious = computed(() => this.visibleIndex() > 0);
  readonly hasNext = computed(() => {
    const i = this.visibleIndex();
    return i < this.visible().length - 1 && this.visible().length > 0;
  });

  /** Gallery slots always render three views; missing photography yields null. */
  readonly gallery = computed(() => {
    const imgs = this.selected()?.galleryImages ?? [];
    return GALLERY_VIEWS.map((g) => ({ ...g, image: imgs.find((i) => i.view === g.view) ?? null }));
  });
  readonly activeImage = computed(() => this.gallery()[this.galleryIndex()]?.image ?? null);

  numberOf(model: VehicleModel): number {
    return this.models().indexOf(model) + 1;
  }

  load(collection: BrandCollection): void {
    this._collection.set(collection);
    this.query.set('');
    this.bodyTypes.set(new Set());
    this.fuelTypes.set(new Set());
    this.sort.set('default');
    this.select(collection.defaultModelId);
  }

  select(id: string): void {
    if (id === this.selectedId()) return;
    this.selectedId.set(id);
    this.galleryIndex.set(0);
  }

  selectGallery(index: number): void {
    if (this.gallery()[index]?.image) this.galleryIndex.set(index);
  }

  previous(): void {
    if (this.hasPrevious()) this.select(this.visible()[this.visibleIndex() - 1].id);
    else this.ensureVisibleSelection();
  }

  next(): void {
    if (this.visibleIndex() === -1) return this.ensureVisibleSelection();
    if (this.hasNext()) this.select(this.visible()[this.visibleIndex() + 1].id);
  }

  setQuery(q: string): void {
    this.query.set(q);
    this.ensureVisibleSelection();
  }

  /** Category tabs: "All" clears, a tab selects exactly that body type. */
  setCategory(body: BodyType | null): void {
    this.bodyTypes.set(body ? new Set([body]) : new Set());
    this.ensureVisibleSelection();
  }

  toggleBodyType(body: BodyType): void {
    this.bodyTypes.set(toggled(this.bodyTypes(), body));
    this.ensureVisibleSelection();
  }

  toggleFuelType(fuel: FuelType): void {
    this.fuelTypes.set(toggled(this.fuelTypes(), fuel));
    this.ensureVisibleSelection();
  }

  clearFilters(): void {
    this.bodyTypes.set(new Set());
    this.fuelTypes.set(new Set());
    this.ensureVisibleSelection();
  }

  setSort(order: SortOrder): void {
    this.sort.set(order);
  }

  /** Keep the preview in sync with the list: if the selected model is filtered out, jump to the first match. */
  private ensureVisibleSelection(): void {
    const vis = this.visible();
    const sel = this.selected();
    if (vis.length && (!sel || !vis.includes(sel))) this.select(vis[0].id);
  }
}

function unique<T>(xs: T[]): T[] {
  return [...new Set(xs)];
}

function toggled<T>(set: ReadonlySet<T>, v: T): Set<T> {
  const next = new Set(set);
  if (next.has(v)) next.delete(v);
  else next.add(v);
  return next;
}

import { ChangeDetectionStrategy, Component, computed, effect, inject, input, untracked } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { TopNavComponent } from '../layout/top-nav.component';
import { BRAND_COLLECTIONS } from './model-collection.data';
import { ModelCollectionStore } from './model-collection.store';
import { ModelSearchComponent } from './components/model-search.component';
import { ModelFilterComponent } from './components/model-filter.component';
import { ModelSortComponent } from './components/model-sort.component';
import { ModelSidebarComponent } from './components/model-sidebar.component';
import { ModelGalleryComponent } from './components/model-gallery.component';
import { ModelInformationComponent } from './components/model-information.component';
import { ModelNavigationComponent } from './components/model-navigation.component';

@Component({
  selector: 'rg-model-collection',
  imports: [
    TopNavComponent,
    ModelSearchComponent,
    ModelFilterComponent,
    ModelSortComponent,
    ModelSidebarComponent,
    ModelGalleryComponent,
    ModelInformationComponent,
    ModelNavigationComponent,
  ],
  providers: [ModelCollectionStore],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './model-collection.component.html',
  styleUrl: './model-collection.component.scss',
})
export class ModelCollectionComponent {
  /** Bound from the `:brand` route param. */
  readonly brand = input<string>('bmw');

  protected readonly store = inject(ModelCollectionStore);
  private readonly router = inject(Router);
  private readonly title = inject(Title);

  protected readonly backRoute = computed(() => this.store.collection()?.backRoute ?? ['/brands']);

  constructor() {
    // Only the route param drives this effect; store reads inside load() must not be tracked.
    effect(() => {
      const collection = BRAND_COLLECTIONS[this.brand().toLowerCase()];
      untracked(() => {
        if (!collection) {
          this.router.navigate(['/brands']);
          return;
        }
        this.store.load(collection);
        this.title.setTitle(`${collection.brand} Model Collection · RevGate`);
      });
    });
  }
}

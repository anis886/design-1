import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ModelCollectionStore } from '../model-collection.store';
import { ModelListItemComponent } from './model-list-item.component';
import { BodyType } from '../model-collection.models';

@Component({
  selector: 'rg-model-sidebar',
  imports: [ModelListItemComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './model-sidebar.component.scss',
  template: `
    <h2 class="eyebrow" id="explore-heading">Explore {{ store.total() }} models</h2>

    <div class="tabs" role="group" aria-label="Filter by body type">
      <button type="button" class="tab" [class.on]="activeCategory() === null"
              [attr.aria-pressed]="activeCategory() === null" (click)="store.setCategory(null)">All</button>
      @for (c of store.collection()?.categories ?? []; track c) {
        <button type="button" class="tab" [class.on]="activeCategory() === c"
                [attr.aria-pressed]="activeCategory() === c" (click)="store.setCategory(c)">{{ c }}</button>
      }
    </div>

    <p class="visually-hidden" aria-live="polite">{{ store.visible().length }} models shown</p>

    @if (store.visible().length) {
      <ul class="list" aria-labelledby="explore-heading">
        @for (m of store.visible(); track m.id) {
          <li>
            <rg-model-list-item [model]="m" [index]="store.numberOf(m)"
                                [active]="m.id === store.selected()?.id" (pick)="store.select($event)" />
          </li>
        }
      </ul>
    } @else {
      <div class="empty">
        <p>No models match your search.</p>
        <button type="button" (click)="reset()">Reset search and filters</button>
      </div>
    }
  `,
})
export class ModelSidebarComponent {
  protected readonly store = inject(ModelCollectionStore);

  /** A tab is "on" when exactly that body type is filtered (keeps tabs and the Filter dropdown in sync). */
  protected readonly activeCategory = computed<BodyType | null | undefined>(() => {
    const set = this.store.bodyTypes();
    if (set.size === 0) return null;
    return set.size === 1 ? [...set][0] : undefined;
  });

  protected reset(): void {
    this.store.clearFilters();
    this.store.setQuery('');
  }
}

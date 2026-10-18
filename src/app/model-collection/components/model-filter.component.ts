import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { IconComponent } from '../../shared/icon.component';
import { DropdownDirective } from '../../shared/dropdown.directive';
import { ModelCollectionStore } from '../model-collection.store';

@Component({
  selector: 'rg-model-filter',
  imports: [IconComponent],
  hostDirectives: [DropdownDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './toolbar-controls.scss',
  host: { class: 'dropdown' },
  template: `
    <button type="button" class="control" data-trigger
            [attr.aria-expanded]="dd.open()" aria-haspopup="true" aria-controls="filter-panel"
            (click)="dd.toggle()">
      <rg-icon name="filter" [size]="18" [stroke]="1.7" />
      <span>Filter</span>
      @if (store.activeFilterCount()) { <span class="badge">{{ store.activeFilterCount() }}</span> }
      <rg-icon class="chev" name="chevron-down" [size]="18" [stroke]="1.8" />
    </button>
    <div id="filter-panel" class="panel" role="group" aria-label="Filter models" [class.open]="dd.open()">
      <fieldset>
        <legend>Body type</legend>
        @for (b of store.availableBodyTypes(); track b) {
          <label class="opt">
            <input type="checkbox" [checked]="store.bodyTypes().has(b)" (change)="store.toggleBodyType(b)" />
            <span>{{ b }}</span>
          </label>
        }
      </fieldset>
      <fieldset>
        <legend>Fuel type</legend>
        @for (f of store.availableFuelTypes(); track f) {
          <label class="opt">
            <input type="checkbox" [checked]="store.fuelTypes().has(f)" (change)="store.toggleFuelType(f)" />
            <span>{{ f }}</span>
          </label>
        }
      </fieldset>
      <button type="button" class="reset" [disabled]="!store.activeFilterCount()" (click)="store.clearFilters()">
        Clear filters
      </button>
    </div>
  `,
})
export class ModelFilterComponent {
  protected readonly store = inject(ModelCollectionStore);
  protected readonly dd = inject(DropdownDirective);
}

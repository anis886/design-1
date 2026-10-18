import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { IconComponent } from '../../shared/icon.component';
import { DropdownDirective } from '../../shared/dropdown.directive';
import { ModelCollectionStore } from '../model-collection.store';
import { SortOrder } from '../model-collection.models';

@Component({
  selector: 'rg-model-sort',
  imports: [IconComponent],
  hostDirectives: [DropdownDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './toolbar-controls.scss',
  host: { class: 'dropdown' },
  template: `
    <button type="button" class="control" data-trigger
            [attr.aria-expanded]="dd.open()" aria-haspopup="listbox" aria-controls="sort-panel"
            (click)="dd.toggle()">
      <rg-icon name="sort" [size]="20" [stroke]="1.8" />
      <span>Sort</span>
      <rg-icon class="chev" name="chevron-down" [size]="18" [stroke]="1.8" />
    </button>
    <ul id="sort-panel" class="panel panel--end" role="listbox" aria-label="Sort models" [class.open]="dd.open()">
      @for (o of options(); track o.value) {
        <li role="option" tabindex="0" class="opt opt--sort"
            [attr.aria-selected]="store.sort() === o.value"
            (click)="choose(o.value)" (keydown.enter)="choose(o.value)" (keydown.space)="$event.preventDefault(); choose(o.value)">
          <span>{{ o.label }}</span>
          @if (store.sort() === o.value) { <rg-icon name="check" [size]="16" [stroke]="2" /> }
        </li>
      }
    </ul>
  `,
})
export class ModelSortComponent {
  protected readonly store = inject(ModelCollectionStore);
  protected readonly dd = inject(DropdownDirective);

  protected readonly options = computed(() => {
    const opts: { value: SortOrder; label: string }[] = [
      { value: 'default', label: 'Default order' },
      { value: 'name-asc', label: 'Name A–Z' },
      { value: 'name-desc', label: 'Name Z–A' },
    ];
    if (this.store.hasPowerData()) opts.push({ value: 'power-desc', label: 'Power: High to Low' });
    return opts;
  });

  protected choose(v: SortOrder): void {
    this.store.setSort(v);
    this.dd.close(true);
  }
}

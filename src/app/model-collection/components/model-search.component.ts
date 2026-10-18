import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { IconComponent } from '../../shared/icon.component';

@Component({
  selector: 'rg-model-search',
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './toolbar-controls.scss',
  host: { class: 'search' },
  template: `
    <label class="search-field">
      <span class="visually-hidden">Search models</span>
      <rg-icon name="search" [size]="20" [stroke]="1.8" />
      <input
        type="search"
        [value]="value()"
        (input)="changed.emit($any($event.target).value)"
        placeholder="Search models, body types or keywords…"
        autocomplete="off"
      />
      @if (value()) {
        <button type="button" class="clear" (click)="changed.emit('')" aria-label="Clear search">
          <rg-icon name="x" [size]="16" />
        </button>
      }
    </label>
  `,
})
export class ModelSearchComponent {
  readonly value = input('');
  readonly changed = output<string>();
}

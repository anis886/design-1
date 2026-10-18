import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { IconComponent } from '../../shared/icon.component';
import { VehicleModel } from '../model-collection.models';

@Component({
  selector: 'rg-model-list-item',
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './model-list-item.component.scss',
  template: `
    <button type="button" class="row" [class.active]="active()" [attr.aria-current]="active() ? 'true' : null"
            [attr.aria-label]="model().name + ', ' + model().bodyType" (click)="pick.emit(model().id)">
      <span class="idx">{{ indexLabel() }}</span>
      <span class="thumb">
        <img [src]="model().thumbnail" alt="" width="124" height="56" loading="lazy" decoding="async" />
      </span>
      <span class="text">
        <span class="name">{{ model().name }}</span>
        <span class="body">{{ model().bodyType }}</span>
      </span>
      <rg-icon class="arrow" name="arrow-right" [size]="20" [stroke]="1.6" />
    </button>
  `,
})
export class ModelListItemComponent {
  readonly model = input.required<VehicleModel>();
  readonly index = input.required<number>();
  readonly active = input(false);
  readonly pick = output<string>();
  protected readonly indexLabel = computed(() => String(this.index()).padStart(2, '0'));
}

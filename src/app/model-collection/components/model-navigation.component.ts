import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { IconComponent } from '../../shared/icon.component';
import { ModelCollectionStore } from '../model-collection.store';

@Component({
  selector: 'rg-model-navigation',
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { role: 'navigation', 'aria-label': 'Model navigation' },
  styles: `
    @use 'tokens' as *;
    :host { display: flex; align-items: center; gap: 38px; height: 72px; border-top: 1px solid $c-line; }
    .step { @include reset-button; @include focus-ring; display: inline-flex; align-items: center; gap: 22px;
      font-size: $fs-body; font-weight: 500; color: $c-ink; white-space: nowrap; transition: opacity $dur $ease; }
    .step rg-icon { transition: transform $dur $ease; }
    .prev:hover:not(:disabled) rg-icon { transform: translateX(-3px); }
    .next:hover:not(:disabled) rg-icon { transform: translateX(3px); }
    .step:disabled { opacity: .35; cursor: default; }
    .rule { flex: 1; height: 1px; background: $c-line; }
    @media (max-width: $bp-mobile) {
      :host { gap: 16px; height: 64px; }
      .step { gap: 10px; font-size: 15px; }
    }
  `,
  template: `
    <button type="button" class="step prev" [disabled]="!store.hasPrevious()" (click)="store.previous()">
      <rg-icon name="arrow-left" [size]="20" [stroke]="1.6" />
      <span>Previous model</span>
    </button>
    <span class="rule" aria-hidden="true"></span>
    <button type="button" class="step next" [disabled]="!store.hasNext()" (click)="store.next()">
      <span>Next model</span>
      <rg-icon name="arrow-right" [size]="20" [stroke]="1.6" />
    </button>
  `,
})
export class ModelNavigationComponent {
  protected readonly store = inject(ModelCollectionStore);
}

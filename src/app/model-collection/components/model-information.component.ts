import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../shared/icon.component';
import { CompareService } from '../../shared/compare.service';
import { ModelCollectionStore } from '../model-collection.store';

@Component({
  selector: 'rg-model-information',
  imports: [IconComponent, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './model-information.component.scss',
  template: `
    @if (store.selected(); as m) {
      <div class="info">
        @for (k of [m.id]; track k) {
          <div class="identity">
            <h2 class="title">{{ m.name }}</h2>
            <p class="meta">{{ m.bodyType }} <span aria-hidden="true">/</span><span class="visually-hidden">,</span> {{ m.fuelType }}</p>
          </div>
        }

        <dl class="specs">
          <div>
            <dt>Power</dt>
            <dd>
              @if (m.specs.power !== null) { {{ m.specs.power }} hp }
              @else { <span class="dash" aria-label="Not available">—</span> }
            </dd>
          </div>
          <div>
            <dt>0–100 km/h</dt>
            <dd>
              @if (m.specs.acceleration !== null) { {{ m.specs.acceleration }} s }
              @else { <span class="dash" aria-label="Not available">—</span> }
            </dd>
          </div>
        </dl>

        <div class="actions">
          <button type="button" class="btn btn--ghost" [class.on]="inCompare()"
                  [attr.aria-pressed]="inCompare()" [disabled]="!inCompare() && compare.isFull()"
                  (click)="compare.toggle(m.id)">
            <rg-icon [name]="inCompare() ? 'check' : 'scale'" [size]="20" [stroke]="1.6" />
            <span>{{ inCompare() ? 'Comparing' : 'Compare' }}</span>
          </button>
          <a class="btn btn--solid" [routerLink]="m.detailRoute">
            <span>View model</span>
            <rg-icon name="arrow-up-right" [size]="18" [stroke]="1.8" />
          </a>
          @if (compare.count() > 1) {
            <a class="compare-link" routerLink="/compare">View comparison ({{ compare.count() }})</a>
          }
        </div>
      </div>
    }
  `,
})
export class ModelInformationComponent {
  protected readonly store = inject(ModelCollectionStore);
  protected readonly compare = inject(CompareService);
  protected readonly inCompare = computed(() => {
    const id = this.store.selected()?.id;
    return !!id && this.compare.ids().includes(id);
  });
}

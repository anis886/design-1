import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TopNavComponent } from '../layout/top-nav.component';
import { BRAND_COLLECTIONS } from '../model-collection/model-collection.data';
import { VehicleModel } from '../model-collection/model-collection.models';
import { CompareService } from '../shared/compare.service';

const ALL_MODELS: VehicleModel[] = Object.values(BRAND_COLLECTIONS).flatMap((c) => c.models);

const PAGE_STYLES = `
  @use 'tokens' as *;
  main { max-width: 1600px; margin: 0 auto; padding: 32px $page-gutter 64px; }
  .eyebrow { @include eyebrow; margin: 0 0 10px; }
  h1 { margin: 0 0 32px; font-size: 44px; font-weight: 700; letter-spacing: -.04em; color: $c-ink; }
  a { color: $c-ink; }
  .muted { color: $c-muted; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 1px; background: $c-line; border: 1px solid $c-line; }
  .cell { background: $c-white; padding: 24px; display: flex; flex-direction: column; gap: 10px; text-decoration: none; }
  .cell img { width: 160px; height: auto; }
  .cell strong { font-size: 18px; }
  table { width: 100%; border-collapse: collapse; font-size: 15px; }
  th, td { text-align: left; padding: 14px 12px; border-bottom: 1px solid $c-line; vertical-align: middle; }
  th { font-weight: 500; color: $c-muted; }
  .btn { display: inline-flex; height: 46px; align-items: center; padding: 0 24px; background: $c-ink; color: $c-white; text-decoration: none; border-radius: $radius; border: 0; font: inherit; cursor: pointer; }
  @media (max-width: $bp-mobile) { main { padding: 24px 16px 48px; } h1 { font-size: 32px; } }
`;

/** Fallback for BACK — the brand index. */
@Component({
  selector: 'rg-brands',
  imports: [TopNavComponent, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: PAGE_STYLES,
  template: `
    <rg-top-nav [fallback]="['/brands']" />
    <main>
      <p class="eyebrow">Brands</p>
      <h1>Choose a collection.</h1>
      <div class="grid">
        @for (c of collections; track c.slug) {
          <a class="cell" [routerLink]="['/brands', c.slug]">
            <strong>{{ c.brand }}</strong>
            <span class="muted">{{ c.models.length }} models</span>
          </a>
        }
      </div>
    </main>
  `,
})
export class BrandsPageComponent {
  protected readonly collections = Object.values(BRAND_COLLECTIONS);
}

/** Reusable, brand-agnostic detail route: /cars/:brand/:slug */
@Component({
  selector: 'rg-car-detail',
  imports: [TopNavComponent, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: PAGE_STYLES,
  template: `
    <rg-top-nav [fallback]="['/brands', brand()]" />
    <main>
      @if (model(); as m) {
        <p class="eyebrow">{{ m.brand }} · {{ m.bodyType }}</p>
        <h1>{{ m.name }}</h1>
        <img [src]="m.galleryImages[0]?.src ?? m.thumbnail" [alt]="m.name" style="max-width:960px;width:100%;height:auto" />
        <p class="muted">Model detail page — content to be supplied.</p>
      } @else {
        <h1>Model not found.</h1>
        <a [routerLink]="['/brands']">Browse collections</a>
      }
    </main>
  `,
})
export class CarDetailPageComponent {
  readonly brand = input('');
  readonly slug = input('');
  protected readonly model = computed(() =>
    ALL_MODELS.find((m) => m.brand.toLowerCase() === this.brand().toLowerCase() && m.slug === this.slug()),
  );
}

@Component({
  selector: 'rg-compare',
  imports: [TopNavComponent, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: PAGE_STYLES,
  template: `
    <rg-top-nav [fallback]="['/brands']" />
    <main>
      <p class="eyebrow">Compare</p>
      <h1>Side by side.</h1>
      @if (models().length) {
        <table>
          <thead><tr><th>Model</th><th>Body</th><th>Fuel</th><th>Power</th><th>0–100 km/h</th><th></th></tr></thead>
          <tbody>
            @for (m of models(); track m.id) {
              <tr>
                <td><a [routerLink]="m.detailRoute">{{ m.name }}</a></td>
                <td>{{ m.bodyType }}</td>
                <td>{{ m.fuelType }}</td>
                <td>{{ m.specs.power !== null ? m.specs.power + ' hp' : '—' }}</td>
                <td>{{ m.specs.acceleration !== null ? m.specs.acceleration + ' s' : '—' }}</td>
                <td><button type="button" class="btn" (click)="compare.toggle(m.id)">Remove</button></td>
              </tr>
            }
          </tbody>
        </table>
      } @else {
        <p class="muted">No models selected yet. Use “Compare” on a model to add it.</p>
      }
    </main>
  `,
})
export class ComparePageComponent {
  protected readonly compare = inject(CompareService);
  protected readonly models = computed(() =>
    this.compare.ids().map((id) => ALL_MODELS.find((m) => m.id === id)).filter((m): m is VehicleModel => !!m),
  );
}

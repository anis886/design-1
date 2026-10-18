import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ModelCollectionStore } from '../model-collection.store';

@Component({
  selector: 'rg-model-gallery',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './model-gallery.component.scss',
  template: `
    @let model = store.selected();
    <figure class="stage" [attr.aria-label]="model?.name + ' preview'">
      @for (img of current(); track img.key) {
        @if (img.src) {
          @if (img.contain) {
            <!-- wide shots: show the whole car over a soft fill of the same frame, never crop bumpers -->
            <img class="hero hero--fill" [src]="img.src" alt="" aria-hidden="true" />
          }
          <img class="hero" [class.hero--contain]="img.contain" [src]="img.src" [alt]="img.alt"
               [width]="img.width" [height]="img.height" fetchpriority="high" decoding="async" />
        } @else {
          <div class="hero hero--pending">
            <img [src]="model?.thumbnail" alt="{{ model?.name }}" width="124" height="56" />
            <span>Showroom photography coming soon</span>
          </div>
        }
      }
      <span class="counter" aria-live="polite">
        <span class="visually-hidden">Model </span>{{ pad(store.selectedNumber()) }} / {{ pad(store.total()) }}
      </span>
    </figure>

    <div class="thumbs" role="group" aria-label="Gallery views">
      @for (g of store.gallery(); track g.view; let i = $index) {
        <button type="button" class="thumb" [class.on]="i === store.galleryIndex()"
                [attr.aria-pressed]="i === store.galleryIndex()" [disabled]="!g.image"
                [attr.aria-label]="g.label + (g.image ? '' : ' — image not available')"
                (click)="store.selectGallery(i)">
          @if (g.image) {
            <img [src]="g.image.src" alt="" loading="lazy" decoding="async" />
          } @else {
            <span class="thumb-pending">{{ g.label }}</span>
          }
        </button>
      }
    </div>
  `,
})
export class ModelGalleryComponent {
  protected readonly store = inject(ModelCollectionStore);

  /** Single-item list keyed by model+view, so a change re-mounts the image and replays the fade. */
  protected readonly current = computed(() => {
    const m = this.store.selected();
    const img = this.store.activeImage();
    return [
      {
        key: `${m?.id}:${this.store.galleryIndex()}`,
        src: img?.src ?? null,
        alt: img?.alt ?? '',
        width: img?.width ?? 948,
        height: img?.height ?? 496,
        // the stage is 948:496; anything notably wider would lose its ends under object-fit: cover
        contain: !!img && img.width / img.height > (948 / 496) * 1.15,
      },
    ];
  });

  protected pad(n: number): string {
    return String(n).padStart(2, '0');
  }
}

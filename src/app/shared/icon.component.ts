import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/** Lucide-derived stroke icons, inlined so the app ships no icon dependency. */
const PATHS = {
  menu: ['M4 6h16', 'M4 12h16', 'M4 18h16'],
  'arrow-left': ['M19 12H5', 'M12 19l-7-7 7-7'],
  'arrow-right': ['M5 12h14', 'M12 5l7 7-7 7'],
  'arrow-up-right': ['M7 17L17 7', 'M8 7h9v9'],
  search: ['M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14z', 'M20 20l-4-4'],
  filter: ['M22 3H2l8 9.46V19l4 2v-8.54L22 3z'],
  sort: ['M3 6h18', 'M3 12h12', 'M3 18h7'],
  'chevron-down': ['M6 9l6 6 6-6'],
  check: ['M20 6L9 17l-5-5'],
  scale: [
    'M16 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1z',
    'M2 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1z',
    'M7 21h10',
    'M12 3v18',
    'M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2',
  ],
  x: ['M18 6L6 18', 'M6 6l12 12'],
} as const;

export type IconName = keyof typeof PATHS;

@Component({
  selector: 'rg-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'aria-hidden': 'true', '[style.width.px]': 'size()', '[style.height.px]': 'size()' },
  styles: [':host{display:inline-flex;flex:none} svg{width:100%;height:100%}'],
  template: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" [attr.stroke-width]="stroke()"
         stroke-linecap="round" stroke-linejoin="round">
      @for (d of paths(); track $index) { <path [attr.d]="d" /> }
    </svg>
  `,
})
export class IconComponent {
  readonly name = input.required<IconName>();
  readonly size = input(20);
  readonly stroke = input(1.6);
  protected readonly paths = computed(() => PATHS[this.name()]);
}

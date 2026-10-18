import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { Location } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { IconComponent } from '../shared/icon.component';

@Component({
  selector: 'rg-top-nav',
  imports: [IconComponent, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './top-nav.component.scss',
  template: `
    <nav class="bar" aria-label="Primary">
      <div class="left">
        <button type="button" class="icon-btn" aria-label="Open menu">
          <rg-icon name="menu" [size]="24" [stroke]="1.8" />
        </button>
        <a class="logo" routerLink="/brands" aria-label="RevGate home">REVGATE</a>
      </div>
      <button type="button" class="back" (click)="back()">
        <rg-icon name="arrow-left" [size]="20" [stroke]="1.8" />
        <span>BACK</span>
      </button>
    </nav>
  `,
})
export class TopNavComponent {
  /** Where BACK goes when the page was opened directly (no in-app history). */
  readonly fallback = input<string[]>(['/brands']);

  private readonly location = inject(Location);
  private readonly router = inject(Router);

  back(): void {
    const state = this.location.getState() as { navigationId?: number } | null;
    if (state?.navigationId && state.navigationId > 1) this.location.back();
    else this.router.navigate(this.fallback());
  }
}

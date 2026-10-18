import { Directive, ElementRef, inject, signal } from '@angular/core';

/** Shared open/close behaviour for toolbar dropdowns: outside click and Escape close. */
@Directive({
  selector: '[rgDropdown]',
  exportAs: 'rgDropdown',
  host: {
    '(document:click)': 'onDocClick($event)',
    '(keydown.escape)': 'close(true)',
  },
})
export class DropdownDirective {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  readonly open = signal(false);

  toggle(): void {
    this.open.update((o) => !o);
  }

  close(refocus = false): void {
    if (!this.open()) return;
    this.open.set(false);
    if (refocus) this.host.nativeElement.querySelector<HTMLElement>('[data-trigger]')?.focus();
  }

  protected onDocClick(e: Event): void {
    if (!this.host.nativeElement.contains(e.target as Node)) this.close();
  }
}

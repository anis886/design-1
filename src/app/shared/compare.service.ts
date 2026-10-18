import { Injectable, computed, effect, signal } from '@angular/core';

const KEY = 'revgate.compare';
export const COMPARE_LIMIT = 3;

/** App-wide comparison selection, kept per browser tab. */
@Injectable({ providedIn: 'root' })
export class CompareService {
  private readonly _ids = signal<string[]>(read());
  readonly ids = this._ids.asReadonly();
  readonly count = computed(() => this._ids().length);
  readonly isFull = computed(() => this._ids().length >= COMPARE_LIMIT);

  constructor() {
    effect(() => {
      try {
        sessionStorage.setItem(KEY, JSON.stringify(this._ids()));
      } catch {
        /* storage unavailable — selection still works in memory */
      }
    });
  }

  has(id: string): boolean {
    return this._ids().includes(id);
  }

  toggle(id: string): void {
    this._ids.update((ids) =>
      ids.includes(id) ? ids.filter((x) => x !== id) : ids.length >= COMPARE_LIMIT ? ids : [...ids, id],
    );
  }

  clear(): void {
    this._ids.set([]);
  }
}

function read(): string[] {
  try {
    const v = JSON.parse(sessionStorage.getItem(KEY) ?? '[]');
    return Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

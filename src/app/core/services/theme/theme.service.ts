import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ThemeMode = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly storageKey = 'theme';
  private readonly defaultTheme: ThemeMode = 'light';
  private theme$ = new BehaviorSubject<ThemeMode>(this.defaultTheme);

  initTheme(): void {
    const saved = localStorage.getItem(this.storageKey) as ThemeMode | null;
    if (saved === 'light' || saved === 'dark') {
      this.applyTheme(saved);
      return;
    }
    // Si no hay preferencia guardada, respetar el sistema
    const prefersDark =
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.applyTheme(prefersDark ? 'dark' : this.defaultTheme);
  }

  getThemeObservable() {
    return this.theme$.asObservable();
  }

  getTheme(): ThemeMode {
    return this.theme$.getValue();
  }

  setTheme(mode: ThemeMode): void {
    this.applyTheme(mode);
  }

  toggleTheme(): void {
    const next: ThemeMode = this.getTheme() === 'dark' ? 'light' : 'dark';
    this.applyTheme(next);
  }

  private applyTheme(mode: ThemeMode): void {
    localStorage.setItem(this.storageKey, mode);
    this.theme$.next(mode);
    // Use Bootstrap 5.3 theming
    document.documentElement.setAttribute('data-bs-theme', mode);
  }
}

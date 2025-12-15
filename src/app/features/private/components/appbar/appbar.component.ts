import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import {
  Firestore,
  collection,
  collectionData,
  query,
  where,
} from '@angular/fire/firestore';
import {
  ThemeService,
  ThemeMode,
} from 'src/app/core/services/theme/theme.service';

@Component({
  selector: 'app-appbar',
  templateUrl: './appbar.component.html',
  styleUrls: ['./appbar.component.scss'],
})
export class AppbarComponent {
  @Output() menuClick = new EventEmitter<void>();

  companyName: string = '';
  username: string = '';
  empresaID: string = '';
  isLoadingCompany = true;
  currentTheme: ThemeMode = 'light';

  //private authService: AuthService
  constructor(
    private authService: AuthService,
    private firestore: Firestore,
    private themeService: ThemeService
  ) {}
  // Método que se ejecuta cuando se hace clic en el botón
  toggleSidebar(): void {
    this.menuClick.emit();
  }

  logout() {
    this.authService.logout();
  }

  ngOnInit(): void {
    this.username =
      localStorage.getItem('username') || localStorage.getItem('nombre') || '';
    this.empresaID = localStorage.getItem('empresaId') || '';

    if (!this.empresaID) {
      this.isLoadingCompany = false;
      return;
    }

    const coleccionRef = collection(this.firestore, 'configuracionEmpresa');
    const q = query(coleccionRef, where('rnc', '==', this.empresaID));

    collectionData(q, { idField: 'id' }).subscribe((data: any[]) => {
      const empresa = data && data.length > 0 ? data[0] : null;
      this.companyName = empresa?.nombreEmpresa || '';
      this.isLoadingCompany = false;
    });

    this.themeService.getThemeObservable().subscribe((mode) => {
      this.currentTheme = mode;
    });
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}

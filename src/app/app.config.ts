import { ApplicationConfig, provideZoneChangeDetection, provideBrowserGlobalErrorListeners, importProvidersFrom } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { LucideAngularModule, Map, Search, Plus, Minus, Settings, Star, ArrowUp, ArrowDown, Trash2, Undo, Redo, Download, Check, Filter, List, Sun, LogOut } from 'lucide-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(),
    provideRouter(routes),
    importProvidersFrom(LucideAngularModule.pick({ Map, Search, Plus, Minus, Settings, Star, ArrowUp, ArrowDown, Trash2, Undo, Redo, Download, Check, Filter, List, Sun, LogOut }))
  ]
};

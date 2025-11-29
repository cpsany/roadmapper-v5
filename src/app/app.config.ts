import { ApplicationConfig, provideZoneChangeDetection, provideBrowserGlobalErrorListeners, importProvidersFrom } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { LucideAngularModule, Map, Search, Plus, Minus, Settings, Star, ArrowUp, ArrowDown, Trash2, Undo, Redo, Download, Check, Filter, List, Sun } from 'lucide-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(),
    importProvidersFrom(LucideAngularModule.pick({ Map, Search, Plus, Minus, Settings, Star, ArrowUp, ArrowDown, Trash2, Undo, Redo, Download, Check, Filter, List, Sun }))
  ]
};

import { ApplicationConfig, provideZonelessChangeDetection, provideBrowserGlobalErrorListeners, importProvidersFrom } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { LucideAngularModule, Map, Search, Plus, Minus, Settings, Star, ArrowUp, ArrowDown, Trash2, Undo, Redo, Download, Check, Filter, List, Sun } from 'lucide-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(),
    importProvidersFrom(LucideAngularModule.pick({ Map, Search, Plus, Minus, Settings, Star, ArrowUp, ArrowDown, Trash2, Undo, Redo, Download, Check, Filter, List, Sun }))
  ]
};

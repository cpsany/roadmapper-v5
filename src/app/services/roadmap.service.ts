import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Roadmap, Lane, TimelineItem, Resource, RoadmapSettings, LaneCategory, Sprint } from '../models/roadmap.model';
import { addDays, addWeeks, parseISO } from 'date-fns';
import { interval, switchMap, catchError, of, filter, tap, Subject, debounceTime } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({
    providedIn: 'root'
})
export class RoadmapService {
    private http = inject(HttpClient);
    private authService = inject(AuthService);

    // State Signals
    private roadmapSignal = signal<Roadmap>(this.getDefaultData());

    // Save Trigger
    private saveSubject = new Subject<Roadmap>();

    // Computed Signals
    readonly roadmap = computed(() => this.roadmapSignal());
    readonly lanes = computed(() => this.roadmapSignal().lanes.sort((a, b) => a.order - b.order));
    readonly settings = computed(() => this.roadmapSignal().settings);
    readonly resources = computed(() => this.roadmapSignal().resources);

    // Generate Sprints dynamically based on settings
    readonly sprints = computed(() => {
        const settings = this.settings();
        const sprints: Sprint[] = [];
        let currentStart = parseISO(settings.sprintStartDate);
        let sprintNum = settings.sprintStartNumber;

        for (let i = 0; i < settings.numberOfSprints; i++) {
            const currentEnd = addDays(addWeeks(currentStart, settings.sprintDurationWeeks), -1);

            let quarter = '';
            if (settings.showQuarterMarkers) {
                if (sprintNum === 199) quarter = 'Q1';
                if (sprintNum === 203) quarter = 'Q2';
                if (sprintNum === 207) quarter = 'Q3';
            }

            sprints.push({
                number: sprintNum,
                start: currentStart.toISOString(),
                end: currentEnd.toISOString(),
                quarter
            });

            currentStart = addDays(currentEnd, 1);
            sprintNum++;
        }
        return sprints;
    });

    constructor() {
        // Load initial data from API
        this.loadData();

        // Polling for updates (every 10 seconds)
        interval(10000).pipe(
            takeUntilDestroyed(),
            switchMap(() => {
                const projectId = this.authService.projectId;
                if (!projectId) return of(null);
                return this.http.get<Roadmap>(`/api/roadmap?projectId=${projectId}`).pipe(
                    catchError(err => {
                        console.error('Polling error', err);
                        return of(null);
                    })
                );
            }),
            filter(data => !!data),
            tap(data => {
                if (data) {
                    // Only update if updatedAt is newer
                    const current = this.roadmapSignal();
                    if (new Date(data.updatedAt) > new Date(current.updatedAt)) {
                        console.log('Received update from server');
                        this.roadmapSignal.set(data);
                    }
                }
            })
        ).subscribe();

        // Debounced Save
        this.saveSubject.pipe(
            takeUntilDestroyed(),
            debounceTime(1000), // Wait 1s after last change
            switchMap(data => {
                const projectId = this.authService.projectId;
                if (!projectId) return of(null);
                return this.http.post(`/api/roadmap?projectId=${projectId}`, data).pipe(
                    catchError(err => {
                        console.error('Save error', err);
                        return of(null);
                    })
                );
            })
        ).subscribe();

        // Auto-save effect (triggers saveSubject)
        effect(() => {
            const data = this.roadmapSignal();
            this.saveSubject.next(data);
        });
    }

    private loadData() {
        const projectId = this.authService.projectId;
        if (!projectId) return;

        this.http.get<Roadmap>(`/api/roadmap?projectId=${projectId}`).pipe(
            catchError(err => {
                console.error('Load error', err);
                return of(null);
            })
        ).subscribe(data => {
            if (data) {
                this.roadmapSignal.set(data);
            }
        });
    }

    private getDefaultData(): Roadmap {
        // Default Categories
        const categories: LaneCategory[] = [
            { id: 'smart-img', name: 'Smart Image', color: '#3fb950', bgColor: 'rgba(63, 185, 80, 0.15)', order: 1 },
            { id: 'ai-related', name: 'AI / ML', color: '#58a6ff', bgColor: 'rgba(88, 166, 255, 0.15)', order: 2 },
            { id: 'one-off', name: 'One-off', color: '#f78166', bgColor: 'rgba(247, 129, 102, 0.15)', order: 3 },
            { id: 'ongoing', name: 'Ongoing', color: '#a371f7', bgColor: 'rgba(163, 113, 247, 0.15)', order: 4 },
        ];

        // Default Settings
        const settings: RoadmapSettings = {
            sprintPrefix: 'S-',
            sprintStartNumber: 199,
            sprintDurationWeeks: 3,
            sprintStartDate: '2026-01-12T00:00:00.000Z',
            numberOfSprints: 12,
            showQuarterMarkers: true,
            showResourceTotals: true,
            theme: 'dark',
            categories
        };

        const lanes: Lane[] = [];

        return {
            id: crypto.randomUUID(),
            title: 'Vision 2026 Roadmap',
            description: 'Varsity Yearbook — eDesign Platform Evolution',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            settings,
            lanes,
            resources: []
        };
    }

    // Actions
    updateRoadmapTitle(title: string) {
        this.roadmapSignal.update(r => ({ ...r, title, updatedAt: new Date().toISOString() }));
    }

    addLane(name: string, categoryName?: string, categoryId?: string, description?: string) {
        console.log('RoadmapService: addLane called with', name);
        const currentLanes = this.lanes();
        const newLane: Lane = {
            id: crypto.randomUUID(),
            name: name,
            category: categoryName,
            categoryId: categoryId,
            description: description,
            order: currentLanes.length + 1,
            items: []
        };
        this.roadmapSignal.update(r => ({
            ...r,
            lanes: [...r.lanes, newLane],
            updatedAt: new Date().toISOString()
        }));
    }

    updateLane(laneId: string, updates: Partial<Lane>) {
        this.roadmapSignal.update(r => ({
            ...r,
            lanes: r.lanes.map(l => l.id === laneId ? { ...l, ...updates } : l),
            updatedAt: new Date().toISOString()
        }));
    }

    updateSettings(settings: RoadmapSettings) {
        this.roadmapSignal.update(r => ({
            ...r,
            settings: settings,
            updatedAt: new Date().toISOString()
        }));
    }

    deleteLane(laneId: string) {
        this.roadmapSignal.update(r => ({
            ...r,
            lanes: r.lanes.filter(l => l.id !== laneId),
            updatedAt: new Date().toISOString()
        }));
    }

    moveLane(laneId: string, direction: number) {
        this.roadmapSignal.update(r => {
            const lanes = [...r.lanes].sort((a, b) => a.order - b.order);
            const index = lanes.findIndex(l => l.id === laneId);
            if (index === -1) return r;

            const newIndex = index + direction;
            if (newIndex < 0 || newIndex >= lanes.length) return r;

            // Swap orders
            const tempOrder = lanes[index].order;
            lanes[index].order = lanes[newIndex].order;
            lanes[newIndex].order = tempOrder;

            return {
                ...r,
                lanes: lanes,
                updatedAt: new Date().toISOString()
            };
        });
    }

    addItem(laneId: string, sprintIndex: number = 0) {
        const sprints = this.sprints();
        const sprint = sprints[sprintIndex] || sprints[0];
        if (!sprint) return;

        const startDate = new Date(sprint.start);
        const endDate = new Date(sprint.end);

        // Determine type from lane category
        const lane = this.lanes().find(l => l.id === laneId);
        const categoryId = lane?.categoryId || 'smart-img';
        const type = this.mapCategoryToType(categoryId);

        this.addItemToLane(laneId, {
            title: 'New Task',
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            resourceIds: [],
            dependencyIds: [],
            operationalCost: 0,
            type: type
        });
    }

    private mapCategoryToType(categoryId: string): 'smart-img' | 'ai-related' | 'one-off' | 'ongoing' | 'revenue' {
        const map: { [key: string]: string } = {
            'Smart Image': 'smart-img',
            'AI / ML': 'ai-related',
            'One-off': 'one-off',
            'Ongoing': 'ongoing'
        };
        return (map[categoryId] || categoryId || 'smart-img') as any;
    }

    addItemToLane(laneId: string, item: Omit<TimelineItem, 'id'>) {
        const newItem: TimelineItem = {
            ...item,
            id: crypto.randomUUID()
        };

        this.roadmapSignal.update(r => ({
            ...r,
            lanes: r.lanes.map(l => {
                if (l.id === laneId) {
                    return { ...l, items: [...l.items, newItem] };
                }
                return l;
            }),
            updatedAt: new Date().toISOString()
        }));
    }

    updateItem(laneId: string, itemId: string, updates: Partial<TimelineItem>) {
        this.roadmapSignal.update(r => ({
            ...r,
            lanes: r.lanes.map(l => {
                if (l.id === laneId) {
                    return {
                        ...l,
                        items: l.items.map(i => i.id === itemId ? { ...i, ...updates } : i)
                    };
                }
                return l;
            }),
            updatedAt: new Date().toISOString()
        }));
    }

    deleteItem(laneId: string, itemId: string) {
        console.log('RoadmapService: Deleting item', itemId, 'from lane', laneId);
        this.roadmapSignal.update(r => {
            const updatedLanes = r.lanes.map(l => {
                if (l.id === laneId) {
                    const originalCount = l.items.length;
                    const newItems = l.items.filter(i => i.id !== itemId);
                    console.log(`Lane ${l.id}: items count ${originalCount} -> ${newItems.length}`);
                    return {
                        ...l,
                        items: newItems
                    };
                }
                return l;
            });
            return {
                ...r,
                lanes: updatedLanes,
                updatedAt: new Date().toISOString()
            };
        });
    }

    addResource(resource: Omit<Resource, 'id'>) {
        const newRes: Resource = {
            ...resource,
            id: crypto.randomUUID()
        };
        this.roadmapSignal.update(r => ({
            ...r,
            resources: [...r.resources, newRes],
            updatedAt: new Date().toISOString()
        }));
    }

    deleteResource(id: string) {
        this.roadmapSignal.update(r => ({
            ...r,
            resources: r.resources.filter(res => res.id !== id),
            updatedAt: new Date().toISOString()
        }));
    }
}

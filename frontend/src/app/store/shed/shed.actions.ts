import { createActionGroup, props } from '@ngrx/store';
import { Resource, CreateResourceRequest, UpdateResourceRequest, ReserveResourceRequest } from '../../core/models/resource.model';
import { PaginatedResponse, PaginationParams } from '../../core/models/paginated-response.model';

export const ShedActions = createActionGroup({
  source: 'Shed',
  events: {
    'Load Resources': props<{ params: PaginationParams }>(),
    'Load Resources Success': props<{ response: PaginatedResponse<Resource> }>(),
    'Load Resources Failure': props<{ error: string }>(),

    'Create Resource': props<{ request: CreateResourceRequest }>(),
    'Create Resource Success': props<{ resource: Resource }>(),
    'Create Resource Failure': props<{ error: string }>(),

    'Update Resource': props<{ id: string; request: UpdateResourceRequest }>(),
    'Update Resource Success': props<{ resource: Resource }>(),
    'Update Resource Failure': props<{ error: string }>(),

    'Delete Resource': props<{ id: string }>(),
    'Delete Resource Success': props<{ id: string }>(),
    'Delete Resource Failure': props<{ error: string }>(),

    'Reserve Resource': props<{ id: string; request: ReserveResourceRequest }>(),
    'Reserve Resource Success': props<{ id: string }>(),
    'Reserve Resource Failure': props<{ error: string }>(),

    'Return Resource': props<{ id: string }>(),
    'Return Resource Success': props<{ id: string }>(),
    'Return Resource Failure': props<{ error: string }>(),
  },
});

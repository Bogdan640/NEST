import { Resource } from '../../core/models/resource.model';

export interface ShedState {
  resources: Resource[];
  totalCount: number;
  isLoading: boolean;
  error: string | null;
}

export const initialShedState: ShedState = {
  resources: [],
  totalCount: 0,
  isLoading: false,
  error: null,
};

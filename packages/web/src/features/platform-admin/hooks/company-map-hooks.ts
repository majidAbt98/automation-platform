import {
  CreateDepartmentProcessRequest,
  CreateDepartmentRequest,
  UpdateDepartmentProcessRequest,
  UpdateDepartmentRequest,
} from '@activepieces/shared';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { companyMapApi } from '../api/company-map-api';

export const companyMapKeys = {
  departments: ['company-map-departments'] as const,
  processes: (params?: { departmentId?: string; status?: string }) =>
    ['company-map-processes', params] as const,
  stats: ['company-map-stats'] as const,
};

export const companyMapQueries = {
  useDepartments: () =>
    useQuery({
      queryKey: companyMapKeys.departments,
      queryFn: () => companyMapApi.listDepartments(),
    }),

  useProcesses: (params?: { departmentId?: string; status?: string }) =>
    useQuery({
      queryKey: companyMapKeys.processes(params),
      queryFn: () => companyMapApi.listProcesses(params),
    }),

  useCompanyMapStats: () =>
    useQuery({
      queryKey: companyMapKeys.stats,
      queryFn: () => companyMapApi.getStats(),
    }),
};

export const companyMapMutations = {
  useCreateDepartment: ({ onSuccess }: { onSuccess?: () => void } = {}) => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (request: CreateDepartmentRequest) =>
        companyMapApi.createDepartment(request),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: companyMapKeys.departments });
        queryClient.invalidateQueries({ queryKey: companyMapKeys.stats });
        onSuccess?.();
      },
    });
  },

  useUpdateDepartment: ({ onSuccess }: { onSuccess?: () => void } = {}) => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({ id, request }: { id: string; request: UpdateDepartmentRequest }) =>
        companyMapApi.updateDepartment(id, request),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: companyMapKeys.departments });
        onSuccess?.();
      },
    });
  },

  useDeleteDepartment: () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (id: string) => companyMapApi.deleteDepartment(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: companyMapKeys.departments });
        queryClient.invalidateQueries({ queryKey: companyMapKeys.stats });
      },
    });
  },

  useCreateProcess: ({ onSuccess }: { onSuccess?: () => void } = {}) => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (request: CreateDepartmentProcessRequest) =>
        companyMapApi.createProcess(request),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['company-map-processes'] });
        queryClient.invalidateQueries({ queryKey: companyMapKeys.departments });
        queryClient.invalidateQueries({ queryKey: companyMapKeys.stats });
        onSuccess?.();
      },
    });
  },

  useUpdateProcess: ({ onSuccess }: { onSuccess?: () => void } = {}) => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({ id, request }: { id: string; request: UpdateDepartmentProcessRequest }) =>
        companyMapApi.updateProcess(id, request),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['company-map-processes'] });
        queryClient.invalidateQueries({ queryKey: companyMapKeys.stats });
        onSuccess?.();
      },
    });
  },

  useDeleteProcess: () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (id: string) => companyMapApi.deleteProcess(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['company-map-processes'] });
        queryClient.invalidateQueries({ queryKey: companyMapKeys.departments });
        queryClient.invalidateQueries({ queryKey: companyMapKeys.stats });
      },
    });
  },
};

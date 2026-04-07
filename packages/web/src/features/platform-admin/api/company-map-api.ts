import {
  CompanyMapStats,
  CreateDepartmentProcessRequest,
  CreateDepartmentRequest,
  DepartmentProcess,
  DepartmentWithChildren,
  UpdateDepartmentProcessRequest,
  UpdateDepartmentRequest,
} from '@activepieces/shared';

import { api } from '@/lib/api';

export const companyMapApi = {
  listDepartments() {
    return api.get<DepartmentWithChildren[]>('/v1/company-map/departments');
  },
  createDepartment(request: CreateDepartmentRequest) {
    return api.post<DepartmentWithChildren>('/v1/company-map/departments', request);
  },
  updateDepartment(id: string, request: UpdateDepartmentRequest) {
    return api.put<DepartmentWithChildren>(`/v1/company-map/departments/${id}`, request);
  },
  deleteDepartment(id: string) {
    return api.delete<void>(`/v1/company-map/departments/${id}`);
  },
  listProcesses(params?: { departmentId?: string; status?: string }) {
    return api.get<DepartmentProcess[]>('/v1/company-map/processes', params);
  },
  createProcess(request: CreateDepartmentProcessRequest) {
    return api.post<DepartmentProcess>('/v1/company-map/processes', request);
  },
  updateProcess(id: string, request: UpdateDepartmentProcessRequest) {
    return api.put<DepartmentProcess>(`/v1/company-map/processes/${id}`, request);
  },
  deleteProcess(id: string) {
    return api.delete<void>(`/v1/company-map/processes/${id}`);
  },
  getStats() {
    return api.get<CompanyMapStats>('/v1/company-map/processes/stats');
  },
};

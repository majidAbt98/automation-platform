import {
  DepartmentWithChildren,
  ProcessPriority,
  ProcessStatus,
} from '@activepieces/shared';
import { t } from 'i18next';
import { Filter, Plus } from 'lucide-react';
import { useState } from 'react';

import { DashboardPageHeader } from '@/app/components/dashboard-page-header';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import {
  companyMapQueries,
} from '@/features/platform-admin/hooks/company-map-hooks';

import { AddProcessDialog } from './components/add-process-dialog';
import { ProcessCard } from './components/process-card';

const ALL_VALUE = '__all__';

export function ProcessesPage() {
  const locale = document.documentElement.lang || 'en';
  const [statusFilter, setStatusFilter] = useState<ProcessStatus | typeof ALL_VALUE>(ALL_VALUE);
  const [departmentFilter, setDepartmentFilter] = useState<string | typeof ALL_VALUE>(ALL_VALUE);
  const [addProcessOpen, setAddProcessOpen] = useState(false);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>('');

  const { data: departments = [], isLoading: isDepartmentsLoading } =
    companyMapQueries.useDepartments();

  const processParams = {
    departmentId: departmentFilter !== ALL_VALUE ? departmentFilter : undefined,
    status: statusFilter !== ALL_VALUE ? statusFilter : undefined,
  };

  const { data: processes = [], isLoading: isProcessesLoading } =
    companyMapQueries.useProcesses(processParams);

  const isLoading = isDepartmentsLoading || isProcessesLoading;

  const flatDepartments = (
    depts: DepartmentWithChildren[],
  ): DepartmentWithChildren[] => {
    return depts.reduce<DepartmentWithChildren[]>((acc, dept) => {
      acc.push(dept);
      if (dept.children) {
        acc.push(...flatDepartments(dept.children));
      }
      return acc;
    }, []);
  };

  const allDepartments = flatDepartments(departments);
  const isFa = locale === 'fa';

  return (
    <div className="flex flex-col w-full">
      <DashboardPageHeader
        title={t('Processes')}
        description={t('All automation processes across departments')}
      >
        <Button
          size="sm"
          onClick={() => {
            setSelectedDepartmentId(allDepartments[0]?.id ?? '');
            setAddProcessOpen(true);
          }}
          disabled={allDepartments.length === 0}
        >
          <Plus className="size-4 mr-1" />
          {t('Add Process')}
        </Button>
      </DashboardPageHeader>

      <div className="flex flex-col gap-4 p-6">
        {/* Filters */}
        <div className="flex items-center gap-3 flex-wrap">
          <Filter className="size-4 text-muted-foreground" />
          <Select
            value={statusFilter}
            onValueChange={(v) => setStatusFilter(v as ProcessStatus | typeof ALL_VALUE)}
          >
            <SelectTrigger className="w-44">
              <SelectValue placeholder={t('All statuses')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_VALUE}>{t('All statuses')}</SelectItem>
              {Object.values(ProcessStatus).map((status) => (
                <SelectItem key={status} value={status}>
                  {t(status.replace(/_/g, ' '))}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={departmentFilter}
            onValueChange={(v) => setDepartmentFilter(v)}
          >
            <SelectTrigger className="w-52">
              <SelectValue placeholder={t('All departments')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_VALUE}>{t('All departments')}</SelectItem>
              {allDepartments.map((dept) => (
                <SelectItem key={dept.id} value={dept.id}>
                  {isFa ? dept.nameFA : dept.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {(statusFilter !== ALL_VALUE || departmentFilter !== ALL_VALUE) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setStatusFilter(ALL_VALUE);
                setDepartmentFilter(ALL_VALUE);
              }}
            >
              {t('Clear filters')}
            </Button>
          )}
        </div>

        {/* Process Count */}
        {!isLoading && (
          <p className="text-sm text-muted-foreground">
            {t('{{count}} processes found', { count: processes.length })}
          </p>
        )}

        {/* Process List */}
        {isLoading && (
          <div className="flex flex-col gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        )}

        {!isLoading && processes.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <p className="text-sm text-muted-foreground">
              {t('No processes found')}
            </p>
            {statusFilter !== ALL_VALUE || departmentFilter !== ALL_VALUE ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setStatusFilter(ALL_VALUE);
                  setDepartmentFilter(ALL_VALUE);
                }}
              >
                {t('Clear filters')}
              </Button>
            ) : null}
          </div>
        )}

        {!isLoading && processes.length > 0 && (
          <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
            {processes.map((process) => (
              <ProcessCard key={process.id} process={process} locale={locale} />
            ))}
          </div>
        )}
      </div>

      {selectedDepartmentId && (
        <AddProcessDialog
          open={addProcessOpen}
          onOpenChange={setAddProcessOpen}
          departmentId={selectedDepartmentId}
        />
      )}
    </div>
  );
}

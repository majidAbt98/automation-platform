import { DepartmentWithChildren, ProcessStatus } from '@activepieces/shared';
import { t } from 'i18next';
import {
  BarChart2,
  Building2,
  CheckCircle2,
  Plus,
  Search,
  Zap,
} from 'lucide-react';
import { useState } from 'react';

import { DashboardPageHeader } from '@/app/components/dashboard-page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  companyMapMutations,
  companyMapQueries,
} from '@/features/platform-admin/hooks/company-map-hooks';
import { cn } from '@/lib/utils';

import { AddDepartmentDialog } from './components/add-department-dialog';
import { DepartmentDetail } from './components/department-detail';
import { DepartmentTree } from './components/department-tree';

export default function CompanyMapPage() {
  const [selectedDepartment, setSelectedDepartment] =
    useState<DepartmentWithChildren | null>(null);
  const [addDepartmentOpen, setAddDepartmentOpen] = useState(false);
  const locale = document.documentElement.lang || 'en';
  const isRtl = locale === 'fa';

  const { data: departments = [], isLoading: isDepartmentsLoading } =
    companyMapQueries.useDepartments();
  const { data: stats, isLoading: isStatsLoading } =
    companyMapQueries.useCompanyMapStats();

  const automatedCount = stats?.byStatus?.[ProcessStatus.AUTOMATED] ?? 0;
  const discoveredCount = stats?.byStatus?.[ProcessStatus.DISCOVERED] ?? 0;

  const statCards = [
    {
      title: t('Total Departments'),
      value: stats?.totalDepartments ?? 0,
      icon: Building2,
      className: 'text-blue-600',
      bgClassName: 'bg-blue-50',
    },
    {
      title: t('Total Processes'),
      value: stats?.totalProcesses ?? 0,
      icon: BarChart2,
      className: 'text-violet-600',
      bgClassName: 'bg-violet-50',
    },
    {
      title: t('Automated'),
      value: automatedCount,
      icon: Zap,
      className: 'text-green-600',
      bgClassName: 'bg-green-50',
    },
    {
      title: t('Discovered'),
      value: discoveredCount,
      icon: Search,
      className: 'text-amber-600',
      bgClassName: 'bg-amber-50',
    },
  ];

  return (
    <div className="flex flex-col w-full min-h-0">
      <DashboardPageHeader
        title={t('Company Map')}
        description={t('Visualize your organization and automation processes')}
      >
        <Button
          size="sm"
          onClick={() => setAddDepartmentOpen(true)}
        >
          <Plus className="size-4 mr-1" />
          {t('Add Department')}
        </Button>
      </DashboardPageHeader>

      <div className="flex flex-col gap-6 p-6 flex-1 min-h-0">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {statCards.map((card) => (
            <Card key={card.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-4">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </CardTitle>
                <div className={cn('rounded-full p-1.5', card.bgClassName)}>
                  <card.icon className={cn('size-4', card.className)} />
                </div>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                {isStatsLoading ? (
                  <Skeleton className="h-7 w-12" />
                ) : (
                  <span className="text-2xl font-bold">{card.value}</span>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tree + Detail Panel */}
        <div className="flex flex-1 min-h-0 border rounded-lg overflow-hidden bg-background">
          <div className="flex-1 overflow-auto">
            {isDepartmentsLoading && (
              <div className="flex items-center justify-center h-64">
                <div className="flex flex-col items-center gap-3">
                  <Skeleton className="h-10 w-36" />
                  <div className="flex gap-6">
                    <Skeleton className="h-10 w-36" />
                    <Skeleton className="h-10 w-36" />
                  </div>
                </div>
              </div>
            )}
            {!isDepartmentsLoading && departments.length === 0 && (
              <div className="flex flex-col items-center justify-center h-64 gap-4">
                <Building2 className="size-12 text-muted-foreground" />
                <div className="text-center">
                  <p className="text-sm font-medium">{t('No departments yet')}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t('Start by adding your first department')}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAddDepartmentOpen(true)}
                >
                  <Plus className="size-4 mr-1" />
                  {t('Add Department')}
                </Button>
              </div>
            )}
            {!isDepartmentsLoading && departments.length > 0 && (
              <DepartmentTree
                departments={departments}
                selectedDepartmentId={selectedDepartment?.id ?? null}
                locale={locale}
                onSelect={setSelectedDepartment}
                isRtl={isRtl}
              />
            )}
          </div>

          {selectedDepartment && (
            <DepartmentDetail
              department={selectedDepartment}
              locale={locale}
              onClose={() => setSelectedDepartment(null)}
            />
          )}
        </div>
      </div>

      <AddDepartmentDialog
        open={addDepartmentOpen}
        onOpenChange={setAddDepartmentOpen}
      />
    </div>
  );
}

import {
  DepartmentProcess,
  DepartmentWithChildren,
  ProcessStatus,
} from '@activepieces/shared';
import { t } from 'i18next';
import { Building2, Plus, X } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { companyMapQueries } from '@/features/platform-admin/hooks/company-map-hooks';
import { cn } from '@/lib/utils';

import { AddProcessDialog } from './add-process-dialog';
import { ProcessCard } from './process-card';

type DepartmentDetailProps = {
  department: DepartmentWithChildren;
  locale?: string;
  onClose: () => void;
};

const statusOrder: ProcessStatus[] = [
  ProcessStatus.DISCOVERED,
  ProcessStatus.ANALYZING,
  ProcessStatus.READY_FOR_AUTOMATION,
  ProcessStatus.AUTOMATED,
  ProcessStatus.MONITORING,
];

export const DepartmentDetail = ({
  department,
  locale,
  onClose,
}: DepartmentDetailProps) => {
  const isFa = locale === 'fa';
  const name = isFa ? department.nameFA : department.name;
  const [addProcessOpen, setAddProcessOpen] = useState(false);

  const { data: processes = [], isLoading } = companyMapQueries.useProcesses({
    departmentId: department.id,
  });

  const groupedProcesses = statusOrder.reduce<
    Record<ProcessStatus, DepartmentProcess[]>
  >(
    (acc, status) => {
      acc[status] = processes.filter((p) => p.status === status);
      return acc;
    },
    {} as Record<ProcessStatus, DepartmentProcess[]>,
  );

  return (
    <div className="flex flex-col h-full border-l bg-card w-80 shrink-0">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex size-8 items-center justify-center rounded-full bg-muted shrink-0">
            {department.icon ? (
              <span className="text-base">{department.icon}</span>
            ) : (
              <Building2 className="size-4 text-muted-foreground" />
            )}
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-sm truncate">{name}</h3>
            <p className="text-xs text-muted-foreground">
              {t('{{count}} processes', {
                count: department.processCount ?? processes.length,
              })}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="size-7 p-0 shrink-0"
          onClick={onClose}
        >
          <X className="size-4" />
        </Button>
      </div>

      {department.description && (
        <div className="px-4 py-2 text-xs text-muted-foreground border-b">
          {department.description}
        </div>
      )}

      <div className="flex items-center justify-between px-4 py-2 border-b">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {t('Processes')}
        </span>
        <Button
          variant="outline"
          size="sm"
          className="h-6 px-2 text-xs"
          onClick={() => setAddProcessOpen(true)}
        >
          <Plus className="size-3 mr-1" />
          {t('Add')}
        </Button>
      </div>

      <ScrollArea className="flex-1">
        {isLoading && (
          <div className="p-4 text-center text-sm text-muted-foreground">
            {t('Loading...')}
          </div>
        )}
        {!isLoading && processes.length === 0 && (
          <div className="p-4 text-center text-sm text-muted-foreground">
            {t('No processes yet')}
          </div>
        )}
        {!isLoading && processes.length > 0 && (
          <div className="p-3 flex flex-col gap-4">
            {statusOrder.map((status) => {
              const statusProcesses = groupedProcesses[status];
              if (statusProcesses.length === 0) return null;
              return (
                <div key={status} className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-muted-foreground">
                      {t(status.replace(/_/g, ' '))}
                    </span>
                    <Badge variant="secondary" className="text-xs px-1 py-0">
                      {statusProcesses.length}
                    </Badge>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {statusProcesses.map((process) => (
                      <ProcessCard
                        key={process.id}
                        process={process}
                        locale={locale}
                      />
                    ))}
                  </div>
                  <Separator />
                </div>
              );
            })}
          </div>
        )}
      </ScrollArea>

      <AddProcessDialog
        open={addProcessOpen}
        onOpenChange={setAddProcessOpen}
        departmentId={department.id}
      />
    </div>
  );
};

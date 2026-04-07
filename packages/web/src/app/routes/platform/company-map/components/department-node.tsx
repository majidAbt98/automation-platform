import { DepartmentWithChildren } from '@activepieces/shared';
import { t } from 'i18next';
import { Building2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type DepartmentNodeProps = {
  department: DepartmentWithChildren;
  isSelected: boolean;
  locale?: string;
  onClick: (department: DepartmentWithChildren) => void;
};

function getAutomationStatus(
  department: DepartmentWithChildren,
): 'full' | 'partial' | 'none' {
  const total = department.processCount ?? 0;
  const automated = department.automatedCount ?? 0;
  if (total === 0) return 'none';
  if (automated === total) return 'full';
  if (automated > 0) return 'partial';
  return 'none';
}

export const DepartmentNode = ({
  department,
  isSelected,
  locale,
  onClick,
}: DepartmentNodeProps) => {
  const isFa = locale === 'fa';
  const name = isFa ? department.nameFA : department.name;
  const status = getAutomationStatus(department);

  return (
    <button
      type="button"
      onClick={() => onClick(department)}
      className={cn(
        'flex flex-col items-center gap-2 rounded-lg border bg-card p-3 shadow-sm transition-all hover:shadow-md w-36 text-center cursor-pointer',
        isSelected && 'ring-2 ring-primary border-primary',
      )}
    >
      <div className="relative">
        <div className="flex size-10 items-center justify-center rounded-full bg-muted">
          {department.icon ? (
            <span className="text-lg">{department.icon}</span>
          ) : (
            <Building2 className="size-5 text-muted-foreground" />
          )}
        </div>
        <span
          className={cn(
            'absolute bottom-0 right-0 size-3 rounded-full border-2 border-card',
            status === 'full' && 'bg-green-500',
            status === 'partial' && 'bg-yellow-500',
            status === 'none' && 'bg-red-400',
          )}
        />
      </div>
      <span className="text-xs font-medium leading-tight line-clamp-2 w-full">
        {name}
      </span>
      {(department.processCount ?? 0) > 0 && (
        <Badge variant="secondary" className="text-xs px-1.5 py-0">
          {t('{{count}} processes', { count: department.processCount ?? 0 })}
        </Badge>
      )}
    </button>
  );
};

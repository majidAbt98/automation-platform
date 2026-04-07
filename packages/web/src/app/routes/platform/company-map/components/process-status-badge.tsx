import { ProcessStatus } from '@activepieces/shared';
import { t } from 'i18next';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type ProcessStatusBadgeProps = {
  status: ProcessStatus;
  className?: string;
};

const statusConfig: Record<
  ProcessStatus,
  { label: string; className: string }
> = {
  [ProcessStatus.DISCOVERED]: {
    label: 'Discovered',
    className: 'bg-blue-100 text-blue-700 border-blue-200',
  },
  [ProcessStatus.ANALYZING]: {
    label: 'Analyzing',
    className: 'bg-amber-100 text-amber-700 border-amber-200',
  },
  [ProcessStatus.READY_FOR_AUTOMATION]: {
    label: 'Ready',
    className: 'bg-orange-100 text-orange-700 border-orange-200',
  },
  [ProcessStatus.AUTOMATED]: {
    label: 'Automated',
    className: 'bg-green-100 text-green-700 border-green-200',
  },
  [ProcessStatus.MONITORING]: {
    label: 'Monitoring',
    className: 'bg-purple-100 text-purple-700 border-purple-200',
  },
};

export const ProcessStatusBadge = ({
  status,
  className,
}: ProcessStatusBadgeProps) => {
  const config = statusConfig[status];
  return (
    <Badge
      variant="outline"
      className={cn(config.className, className)}
    >
      {t(config.label)}
    </Badge>
  );
};

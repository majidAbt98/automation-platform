import { DepartmentProcess, ProcessPriority } from '@activepieces/shared';
import { t } from 'i18next';
import { ExternalLink, Zap } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

import { ProcessStatusBadge } from './process-status-badge';

type ProcessCardProps = {
  process: DepartmentProcess;
  locale?: string;
};

const priorityConfig: Record<
  ProcessPriority,
  { label: string; className: string }
> = {
  [ProcessPriority.LOW]: {
    label: 'Low',
    className: 'bg-slate-100 text-slate-600',
  },
  [ProcessPriority.MEDIUM]: {
    label: 'Medium',
    className: 'bg-blue-100 text-blue-600',
  },
  [ProcessPriority.HIGH]: {
    label: 'High',
    className: 'bg-orange-100 text-orange-600',
  },
  [ProcessPriority.CRITICAL]: {
    label: 'Critical',
    className: 'bg-red-100 text-red-600',
  },
};

export const ProcessCard = ({ process, locale }: ProcessCardProps) => {
  const isFa = locale === 'fa';
  const name = isFa ? process.nameFA : process.name;
  const description = process.description;
  const priority = priorityConfig[process.priority];

  return (
    <Card className="w-full">
      <CardContent className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col gap-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium truncate">{name}</span>
              <ProcessStatusBadge status={process.status} />
              <Badge
                variant="outline"
                className={cn('text-xs', priority.className)}
              >
                {t(priority.label)}
              </Badge>
            </div>
            {description && (
              <p className="text-xs text-muted-foreground line-clamp-2">
                {description}
              </p>
            )}
          </div>
          {process.flowId && (
            <Button
              variant="ghost"
              size="sm"
              className="shrink-0 h-7 px-2"
              asChild
            >
              <a
                href={`/flows/${process.flowId}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="size-3 mr-1" />
                <span className="text-xs">{t('Flow')}</span>
              </a>
            </Button>
          )}
          {!process.flowId && process.status === 'AUTOMATED' && (
            <Zap className="size-4 text-muted-foreground shrink-0" />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

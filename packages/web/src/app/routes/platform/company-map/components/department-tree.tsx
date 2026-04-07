import { DepartmentWithChildren } from '@activepieces/shared';

import { cn } from '@/lib/utils';

import { DepartmentNode } from './department-node';

type DepartmentTreeProps = {
  departments: DepartmentWithChildren[];
  selectedDepartmentId: string | null;
  locale?: string;
  onSelect: (department: DepartmentWithChildren) => void;
  isRtl?: boolean;
};

type TreeNodeProps = {
  department: DepartmentWithChildren;
  selectedDepartmentId: string | null;
  locale?: string;
  onSelect: (department: DepartmentWithChildren) => void;
  isRtl?: boolean;
  depth?: number;
};

const TreeNode = ({
  department,
  selectedDepartmentId,
  locale,
  onSelect,
  isRtl,
  depth = 0,
}: TreeNodeProps) => {
  const children = department.children ?? [];

  return (
    <div
      className={cn(
        'flex flex-col items-center',
        depth > 0 && 'relative',
      )}
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {depth > 0 && (
        <div className="w-px h-6 bg-border" />
      )}
      <DepartmentNode
        department={department}
        isSelected={selectedDepartmentId === department.id}
        locale={locale}
        onClick={onSelect}
      />
      {children.length > 0 && (
        <div className="flex flex-col items-center w-full">
          <div className="w-px h-6 bg-border" />
          <div className="relative flex items-start justify-center gap-6">
            {children.length > 1 && (
              <div
                className="absolute top-0 h-px bg-border"
                style={{
                  left: `calc(50% - (${children.length - 1} * 36px + ${Math.floor((children.length - 1) / 2)} * 8px))`,
                  width: `calc(${children.length - 1} * 72px + ${children.length - 2 >= 0 ? children.length - 2 : 0} * 8px)`,
                  minWidth: '72px',
                }}
              />
            )}
            {children.map((child) => (
              <TreeNode
                key={child.id}
                department={child}
                selectedDepartmentId={selectedDepartmentId}
                locale={locale}
                onSelect={onSelect}
                isRtl={isRtl}
                depth={depth + 1}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const DepartmentTree = ({
  departments,
  selectedDepartmentId,
  locale,
  onSelect,
  isRtl,
}: DepartmentTreeProps) => {
  if (departments.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        'flex items-start justify-center gap-6 overflow-auto p-4',
        isRtl && 'flex-row-reverse',
      )}
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {departments.map((dept) => (
        <TreeNode
          key={dept.id}
          department={dept}
          selectedDepartmentId={selectedDepartmentId}
          locale={locale}
          onSelect={onSelect}
          isRtl={isRtl}
          depth={0}
        />
      ))}
    </div>
  );
};

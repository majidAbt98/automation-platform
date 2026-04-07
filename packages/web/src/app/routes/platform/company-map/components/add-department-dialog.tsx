import {
  CreateDepartmentRequest,
  DepartmentWithChildren,
  UpdateDepartmentRequest,
} from '@activepieces/shared';
import { zodResolver } from '@hookform/resolvers/zod';
import { t } from 'i18next';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { companyMapMutations } from '@/features/platform-admin/hooks/company-map-hooks';

const departmentSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  nameFA: z.string().min(1, 'Persian name is required'),
  description: z.string().nullable(),
  icon: z.string().nullable(),
  parentId: z.string().nullable(),
  order: z.number().default(0),
});

type DepartmentFormValues = z.infer<typeof departmentSchema>;

type AddDepartmentDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  parentDepartment?: DepartmentWithChildren;
  editingDepartment?: DepartmentWithChildren;
};

export const AddDepartmentDialog = ({
  open,
  onOpenChange,
  parentDepartment,
  editingDepartment,
}: AddDepartmentDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editingDepartment
              ? t('Edit Department')
              : parentDepartment
                ? t('Add Sub-department')
                : t('Add Department')}
          </DialogTitle>
        </DialogHeader>
        <AddDepartmentForm
          key={open ? 'open' : 'closed'}
          onOpenChange={onOpenChange}
          parentDepartment={parentDepartment}
          editingDepartment={editingDepartment}
        />
      </DialogContent>
    </Dialog>
  );
};

type AddDepartmentFormProps = {
  onOpenChange: (open: boolean) => void;
  parentDepartment?: DepartmentWithChildren;
  editingDepartment?: DepartmentWithChildren;
};

const AddDepartmentForm = ({
  onOpenChange,
  parentDepartment,
  editingDepartment,
}: AddDepartmentFormProps) => {
  const isEditing = !!editingDepartment;

  const form = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentSchema),
    mode: 'onChange',
    defaultValues: {
      name: editingDepartment?.name ?? '',
      nameFA: editingDepartment?.nameFA ?? '',
      description: editingDepartment?.description ?? null,
      icon: editingDepartment?.icon ?? null,
      parentId: editingDepartment?.parentId ?? parentDepartment?.id ?? null,
      order: editingDepartment?.order ?? 0,
    },
  });

  const { mutate: createDepartment, isPending: isCreating } =
    companyMapMutations.useCreateDepartment({
      onSuccess: () => onOpenChange(false),
    });

  const { mutate: updateDepartment, isPending: isUpdating } =
    companyMapMutations.useUpdateDepartment({
      onSuccess: () => onOpenChange(false),
    });

  const isPending = isCreating || isUpdating;

  const handleSubmit = (values: DepartmentFormValues) => {
    form.clearErrors('root');
    if (isEditing && editingDepartment) {
      const req: UpdateDepartmentRequest = {
        name: values.name,
        nameFA: values.nameFA,
        description: values.description,
        icon: values.icon,
        parentId: values.parentId,
        order: values.order,
      };
      updateDepartment({ id: editingDepartment.id, request: req });
    } else {
      const req: CreateDepartmentRequest = {
        name: values.name,
        nameFA: values.nameFA,
        description: values.description,
        icon: values.icon,
        parentId: values.parentId,
        order: values.order,
      };
      createDepartment(req);
    }
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <FormField
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('Name (English)')}</FormLabel>
              <Input
                {...field}
                placeholder={t('e.g. Finance')}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="nameFA"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('Name (Persian)')}</FormLabel>
              <Input
                {...field}
                placeholder={t('e.g. مالی')}
                dir="rtl"
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('Description')}</FormLabel>
              <Input
                {...field}
                value={field.value ?? ''}
                onChange={(e) => field.onChange(e.target.value || null)}
                placeholder={t('Optional description')}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="icon"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('Icon (emoji)')}</FormLabel>
              <Input
                {...field}
                value={field.value ?? ''}
                onChange={(e) => field.onChange(e.target.value || null)}
                placeholder={t('e.g. 🏦')}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        {form.formState.errors.root?.serverError && (
          <FormMessage>
            {form.formState.errors.root.serverError.message}
          </FormMessage>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            {t('Cancel')}
          </Button>
          <Button type="submit" disabled={isPending} loading={isPending}>
            {isEditing ? t('Save Changes') : t('Create Department')}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

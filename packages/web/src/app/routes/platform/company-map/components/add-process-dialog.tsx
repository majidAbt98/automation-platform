import {
  CreateDepartmentProcessRequest,
  DepartmentProcess,
  ProcessPriority,
  ProcessStatus,
  UpdateDepartmentProcessRequest,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { companyMapMutations } from '@/features/platform-admin/hooks/company-map-hooks';

const processSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  nameFA: z.string().min(1, 'Persian name is required'),
  description: z.string().nullable(),
  status: z.nativeEnum(ProcessStatus),
  priority: z.nativeEnum(ProcessPriority),
  flowId: z.string().nullable(),
  departmentId: z.string(),
});

type ProcessFormValues = z.infer<typeof processSchema>;

type AddProcessDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  departmentId: string;
  editingProcess?: DepartmentProcess;
};

export const AddProcessDialog = ({
  open,
  onOpenChange,
  departmentId,
  editingProcess,
}: AddProcessDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editingProcess ? t('Edit Process') : t('Add Process')}
          </DialogTitle>
        </DialogHeader>
        <AddProcessForm
          key={open ? 'open' : 'closed'}
          onOpenChange={onOpenChange}
          departmentId={departmentId}
          editingProcess={editingProcess}
        />
      </DialogContent>
    </Dialog>
  );
};

type AddProcessFormProps = {
  onOpenChange: (open: boolean) => void;
  departmentId: string;
  editingProcess?: DepartmentProcess;
};

const AddProcessForm = ({
  onOpenChange,
  departmentId,
  editingProcess,
}: AddProcessFormProps) => {
  const isEditing = !!editingProcess;

  const form = useForm<ProcessFormValues>({
    resolver: zodResolver(processSchema),
    mode: 'onChange',
    defaultValues: {
      name: editingProcess?.name ?? '',
      nameFA: editingProcess?.nameFA ?? '',
      description: editingProcess?.description ?? null,
      status: editingProcess?.status ?? ProcessStatus.DISCOVERED,
      priority: editingProcess?.priority ?? ProcessPriority.MEDIUM,
      flowId: editingProcess?.flowId ?? null,
      departmentId: editingProcess?.departmentId ?? departmentId,
    },
  });

  const { mutate: createProcess, isPending: isCreating } =
    companyMapMutations.useCreateProcess({
      onSuccess: () => onOpenChange(false),
    });

  const { mutate: updateProcess, isPending: isUpdating } =
    companyMapMutations.useUpdateProcess({
      onSuccess: () => onOpenChange(false),
    });

  const isPending = isCreating || isUpdating;

  const handleSubmit = (values: ProcessFormValues) => {
    form.clearErrors('root');
    if (isEditing && editingProcess) {
      const req: UpdateDepartmentProcessRequest = {
        name: values.name,
        nameFA: values.nameFA,
        description: values.description,
        status: values.status,
        priority: values.priority,
        flowId: values.flowId,
        metadata: null,
      };
      updateProcess({ id: editingProcess.id, request: req });
    } else {
      const req: CreateDepartmentProcessRequest = {
        departmentId: values.departmentId,
        name: values.name,
        nameFA: values.nameFA,
        description: values.description,
        status: values.status,
        priority: values.priority,
        flowId: values.flowId,
        metadata: null,
      };
      createProcess(req);
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
              <Input {...field} placeholder={t('e.g. Invoice Processing')} />
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
                placeholder={t('e.g. پردازش فاکتور')}
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
              <Textarea
                {...field}
                value={field.value ?? ''}
                onChange={(e) => field.onChange(e.target.value || null)}
                placeholder={t('Optional description')}
                rows={2}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('Status')}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(ProcessStatus).map((status) => (
                      <SelectItem key={status} value={status}>
                        {t(status.replace(/_/g, ' '))}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('Priority')}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(ProcessPriority).map((priority) => (
                      <SelectItem key={priority} value={priority}>
                        {t(priority)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          name="flowId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('Flow ID (optional)')}</FormLabel>
              <Input
                {...field}
                value={field.value ?? ''}
                onChange={(e) => field.onChange(e.target.value || null)}
                placeholder={t('Link to an existing flow')}
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
            {isEditing ? t('Save Changes') : t('Add Process')}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

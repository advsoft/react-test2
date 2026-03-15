import { useForm, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import type { AddProductFormValues } from '../types/product.ts';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/shared/ui/form';

const addProductSchema = z.object({
  title: z.string().trim().min(1, 'Укажите наименование товара'),
  price: z.number().min(0, 'Цена должна быть неотрицательным числом'),
  brand: z.string().trim().min(1, 'Укажите вендора или производителя'),
  sku: z.string().trim().min(1, 'Укажите артикул товара'),
});

interface AddProductModalProps {
  open: boolean;
  onClose: () => void;
}

export function AddProductModal({ open, onClose }: AddProductModalProps) {
  const form = useForm<AddProductFormValues>({
    resolver: zodResolver(addProductSchema),
    mode: 'onTouched',
    defaultValues: { title: '', price: 0, brand: '', sku: '' },
  });

  const onSubmit = () => {
    toast.success('Товар добавлен');
    form.reset();
    onClose();
  };

  const handleOpenChange = (openState: boolean) => {
    if (!openState) {
      form.reset();
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Добавить товар</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <AddProductFormContent onSubmit={onSubmit} />
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function AddProductFormContent({ onSubmit }: { onSubmit: (data: AddProductFormValues) => void }) {
  const form = useFormContext<AddProductFormValues>();

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
      <FormField
        control={form.control}
        name="title"
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel>Наименование</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Наименование" className="rounded-sm" />
            </FormControl>
            <p className="min-h-5 text-sm font-medium text-destructive block" role={fieldState.error ? 'alert' : undefined}>
              {fieldState.error?.message ?? <span className="invisible" aria-hidden="true">.</span>}
            </p>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="price"
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel>Цена</FormLabel>
            <FormControl>
              <Input
                type="number"
                min={0}
                placeholder="Цена"
                value={field.value}
                onChange={(e) => field.onChange(e.target.value === '' ? 0 : Number(e.target.value))}
                className="rounded-sm"
              />
            </FormControl>
            <p className="min-h-5 text-sm font-medium text-destructive block" role={fieldState.error ? 'alert' : undefined}>
              {fieldState.error?.message ?? <span className="invisible" aria-hidden="true">.</span>}
            </p>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="brand"
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel>Вендор</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Вендор" className="rounded-sm" />
            </FormControl>
            <p className="min-h-5 text-sm font-medium text-destructive block" role={fieldState.error ? 'alert' : undefined}>
              {fieldState.error?.message ?? <span className="invisible" aria-hidden="true">.</span>}
            </p>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="sku"
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel>Артикул</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Артикул" className="rounded-sm" />
            </FormControl>
            <p className="min-h-5 text-sm font-medium text-destructive block" role={fieldState.error ? 'alert' : undefined}>
              {fieldState.error?.message ?? <span className="invisible" aria-hidden="true">.</span>}
            </p>
          </FormItem>
        )}
      />
      <Button type="submit" className="w-full">
        Добавить
      </Button>
    </form>
  );
}

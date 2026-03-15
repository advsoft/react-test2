import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Lock, Eye, EyeOff, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.ts';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Checkbox } from '@/shared/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/shared/ui/form';

const loginSchema = z.object({
  username: z.string().min(1, 'Обязательное поле'),
  password: z.string().min(1, 'Обязательное поле'),
  remember: z.boolean(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const { login, rememberMe, setRememberMe } = useAuth();
  const [apiError, setApiError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onTouched',
    defaultValues: {
      username: '',
      password: '',
      remember: rememberMe,
    },
  });

  useEffect(() => {
    form.reset({ ...form.getValues(), remember: rememberMe });
  }, [rememberMe, form]);

  const onSubmit = async (values: LoginFormValues) => {
    setApiError(null);
    try {
      await login(values.username, values.password, values.remember);
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Ошибка авторизации');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-96 max-w-full space-y-3">
        <FormField
          control={form.control}
          name="username"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Логин</FormLabel>
              <FormControl>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 size-6 text-gray-400" />
                  <Input
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      setApiError(null);
                    }}
                    placeholder="test"
                    className="h-14 pl-12 pr-10 rounded-xl border-gray-200 bg-white text-lg"
                  />
                  {field.value && (
                    <button
                      type="button"
                      onClick={() => {
                        field.onChange('');
                        setApiError(null);
                      }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="size-5" />
                    </button>
                  )}
                </div>
              </FormControl>
              <p className="min-h-5 text-sm font-medium text-destructive block" role={fieldState.error ? 'alert' : undefined}>
                {fieldState.error?.message ?? <span className="invisible" aria-hidden="true">.</span>}
              </p>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Пароль</FormLabel>
              <FormControl>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-6 text-gray-400" />
                  <Input
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      setApiError(null);
                    }}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••••••"
                    className="h-14 pl-12 pr-12 rounded-xl border-gray-200 bg-white text-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="size-6" />
                    ) : (
                      <Eye className="size-6" />
                    )}
                  </button>
                </div>
              </FormControl>
              <p className="min-h-5 text-sm font-medium text-destructive block" role={fieldState.error ? 'alert' : undefined}>
                {fieldState.error?.message ?? <span className="invisible" aria-hidden="true">.</span>}
              </p>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="remember"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={field.value}
                    onCheckedChange={(checked) => {
                      field.onChange(checked);
                      setRememberMe(!!checked);
                    }}
                  />
                  <label
                    htmlFor="remember"
                    className="text-base text-gray-500 cursor-pointer"
                  >
                    Запомнить данные
                  </label>
                </div>
              </FormControl>
            </FormItem>
          )}
        />

        <div className="h-6 text-sm font-medium text-destructive flex items-center" aria-live="polite">
          <span className={apiError ? '' : 'invisible'}>{apiError || '.'}</span>
        </div>

        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="w-full h-auto py-4 bg-primary hover:bg-primary/90 text-lg rounded-xl"
        >
          {form.formState.isSubmitting ? 'Загрузка...' : 'Войти'}
        </Button>

        <div className="flex items-center gap-2.5 w-full mt-4">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-base text-gray-200">или</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <div className="text-center mt-6">
          <span className="text-lg text-gray-600">Нет аккаунта? </span>
          <a
            href="#"
            className="text-lg text-primary underline font-semibold"
            onClick={(e) => e.preventDefault()}
          >
            Создать
          </a>
        </div>
      </form>
    </Form>
  );
}

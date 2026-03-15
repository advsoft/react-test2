import { LoginForm } from '../components/LoginForm.tsx';

const LOGO_URL = 'https://www.figma.com/api/mcp/asset/1e39367e-e30d-4435-8dfe-1d5d454297f2';

export function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <div className="bg-white rounded-[40px] shadow-lg max-w-xl p-1.5 w-full">
        <div className="flex flex-col items-center rounded-[34px] border border-gray-200 p-12 gap-8 bg-gradient-to-b from-black/[0.03] to-transparent">
          <div className="flex items-center justify-center overflow-hidden bg-white rounded-full size-14 border border-gray-200 shadow-sm">
            <img src={LOGO_URL} alt="" className="size-9" />
          </div>

          <div className="text-center flex flex-col gap-3">
            <h1 className="m-0 text-4xl font-semibold leading-tight text-gray-900">
              Добро пожаловать!
            </h1>
            <p className="m-0 text-lg text-muted-foreground">
              Пожалуйста, авторизуйтесь
            </p>
          </div>

          <LoginForm />
        </div>
      </div>
    </div>
  );
}

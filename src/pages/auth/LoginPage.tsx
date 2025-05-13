
import { MainLayout } from "@/components/layout/MainLayout";
import { LoginForm } from "@/components/auth/LoginForm";

export function LoginPage() {
  return (
    <MainLayout>
      <div className="container mx-auto py-12">
        <div className="max-w-md mx-auto">
          <LoginForm />
        </div>
      </div>
    </MainLayout>
  );
}

export default LoginPage;

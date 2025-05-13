
import { MainLayout } from "@/components/layout/MainLayout";
import { SignupForm } from "@/components/auth/SignupForm";

export function SignupPage() {
  return (
    <MainLayout>
      <div className="container mx-auto py-12">
        <div className="max-w-md mx-auto">
          <SignupForm />
        </div>
      </div>
    </MainLayout>
  );
}

export default SignupPage;

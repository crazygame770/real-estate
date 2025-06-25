
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getUserRole } from "@/utils/auth";

interface SignInFormProps {
  onSuccess: () => void;
  onError: (error: Error) => void;
}

const SignInForm = ({ onSuccess, onError }: SignInFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        if (authError.message.includes("Invalid login credentials")) {
          const { data: emailExists } = await supabase
            .from('profiles')
            .select('id')
            .eq('email', email)
            .single();

          if (!emailExists) {
            throw new Error("No account found with this email address");
          } else {
            throw new Error("Incorrect password");
          }
        }
        throw authError;
      }

      if (authData.user) {
        const role = await getUserRole(authData.user.id);
        await supabase.auth.updateUser({
          data: { role }
        });
        onSuccess();
      }
    } catch (error: any) {
      onError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-3">
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10 h-12 bg-gray-50 dark:bg-gray-800 rounded-lg border-gray-200 dark:border-gray-700 focus:ring-primary focus:border-primary transition-colors"
            required
          />
        </div>
      </div>
      <div className="space-y-3">
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-10 h-12 bg-gray-50 dark:bg-gray-800 rounded-lg border-gray-200 dark:border-gray-700 focus:ring-primary focus:border-primary transition-colors"
            required
          />
        </div>
      </div>
      <Button 
        type="submit" 
        className="w-full h-12 font-medium text-white bg-primary hover:bg-primary/90 rounded-lg shadow-lg hover:shadow-primary/25 transition-all duration-300" 
        disabled={loading}
      >
        {loading ? "Signing in..." : "Sign In"}
      </Button>
    </form>
  );
};

export default SignInForm;

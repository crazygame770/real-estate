import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, User, Phone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { checkExistingUser } from "@/utils/auth";
import { Link } from "react-router-dom";

interface SignUpFormProps {
  onSuccess: () => void;
  onError: (error: Error) => void;
}

const SignUpForm = ({ onSuccess, onError }: SignUpFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (password !== confirmPassword) {
        throw new Error("Passwords do not match");
      }

      await checkExistingUser(email, username, phone);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            phone,
            role: 'user'
          }
        }
      });

      if (error) {
        if (error.message.includes("User already registered")) {
          throw new Error("An account with this email already exists");
        }
        throw error;
      }

      if (data.user) {
        onSuccess();
      }
    } catch (error: any) {
      onError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
          <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Full Name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="pl-10 h-12 bg-gray-50 dark:bg-gray-800 rounded-lg border-gray-200 dark:border-gray-700 focus:ring-primary focus:border-primary transition-colors"
            required
          />
        </div>
      </div>
      <div className="space-y-3">
        <div className="relative">
          <Phone className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input
            type="tel"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
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
      <div className="space-y-3">
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
        {loading ? "Creating Account..." : "Sign In"}
      </Button>
      
      <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-3">
        By signing up, you agree to our <Link to="/terms?from=auth" className="text-primary hover:underline">Terms of Use</Link> and <Link to="/privacy?from=auth" className="text-primary hover:underline">Privacy Policy</Link>
      </p>
    </form>
  );
};

export default SignUpForm;

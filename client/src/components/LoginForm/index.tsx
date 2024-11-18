// LoginForm.tsx
import React, { useState } from "react";

interface LoginFormProps {
  onLogin: (username: string, password: string) => Promise<void>;
  onSwitchToSignup: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, onSwitchToSignup }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onLogin(username, password);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="w-full rounded-lg border p-2"
            required
          />
        </div>
        <div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full rounded-lg border p-2"
            required
          />
        </div>
        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-10 py-3 text-xl font-semibold text-white transition duration-200 hover:bg-blue-700"
        >
          Sign In
        </button>
      </form>

      <div className="mt-4 text-center">
        <p className="text-sm">
          Don&apos;t have an account?{" "}
          <button
            onClick={onSwitchToSignup}
            className="text-blue-600 underline hover:text-blue-800"
          >
            Create one
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;

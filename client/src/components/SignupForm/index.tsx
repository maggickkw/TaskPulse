import React, { useState } from "react";
import { Camera, XCircleIcon } from "lucide-react";
import Image from "next/image";

interface SignupFormProps {
  onSignup: (
    username: string,
    password: string,
    profilePicture: File | null,
  ) => Promise<void>;
  onSwitchToLogin: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({
  onSignup,
  onSwitchToLogin,
}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB");
        return;
      }

      // Validate file type
      if (!file.type.match(/image\/(jpeg|png|jpg)/)) {
        setError("Only JPEG and PNG images are allowed");
        return;
      }

      setError("");
      setProfilePicture(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (username.length < 3) {
      setError("Username must be at least 3 characters long");
      return;
    }

    try {
      setIsLoading(true);
      await onSignup(username, password, profilePicture);
    } catch (error) {
      console.error("Signup failed:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Signup failed. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
      <h2 className="mb-6 text-center text-2xl font-bold">Create an Account</h2>

      {error && (
        <div className="mb-4 rounded-lg bg-red-100 p-3 text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="username"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            className="w-full rounded-lg border border-gray-300 p-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
            required
            minLength={3}
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full rounded-lg border border-gray-300 p-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
            required
            minLength={6}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Profile Picture
          </label>

          <div className="flex flex-col items-center space-y-4">
            {previewUrl ? (
              <div className="relative h-32 w-32">
                <Image
                  src={previewUrl}
                  alt="Profile preview"
                  className="h-full w-full rounded-full border-2 border-gray-200 object-cover"
                  width={32}
                  height={32}
                />
                <button
                  type="button"
                  onClick={() => {
                    setProfilePicture(null);
                    setPreviewUrl("");
                  }}
                  className="absolute -right-8 -top-2 rounded-full p-1 text-white hover:bg-red-600"
                >
                  <XCircleIcon color="gray" />
                </button>
              </div>
            ) : (
              <div className="flex h-32 w-32 items-center justify-center rounded-full border-2 border-dashed border-gray-300 bg-gray-50">
                <Camera className="h-8 w-8 text-gray-400" />
              </div>
            )}

            <div className="w-full">
              <input
                type="file"
                id="profilePicture"
                name="profilePicture"
                accept="image/png, image/jpeg"
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="profilePicture"
                className="block w-full cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-center hover:bg-gray-50"
              >
                {previewUrl ? "Change Picture" : "Upload Picture"}
              </label>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition duration-200 ${isLoading ? "cursor-not-allowed bg-blue-400" : "hover:bg-blue-700"}`}
        >
          {isLoading ? "Creating Account..." : "Sign Up"}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <button
            onClick={onSwitchToLogin}
            className="font-medium text-blue-600 hover:text-blue-800"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;

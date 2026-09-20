import { Navigate } from "react-router-dom";
import miyuMascot from "../assets/miyu-mascot.jpeg";
import StickerCard from "../components/StickerCard";
import LoadingState from "../components/LoadingState";
import { useAuth } from "../lib/useAuth";

function Login() {
  const { isAuthenticated, isLoading } = useAuth();

  function handleLogin() {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/discord`;
  }

  if (isLoading) {
    return <LoadingState />;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 select-none">
      <StickerCard className="p-8 max-w-sm w-full flex flex-col items-center text-center -rotate-1">
        <img
          src={miyuMascot}
          alt="Miyu"
          className="w-32 h-32 rounded-full mb-4 border-[3px] border-ink object-cover"
        />
        <h1 className="text-3xl font-bold text-ink mb-1">Miyu</h1>
        <p className="text-ink/70 mb-6 font-medium">
          Gerencie embeds e boas-vindas do seu servidor
        </p>
        <button
          onClick={handleLogin}
          className="bg-green text-black font-bold px-6 py-3 rounded-xl border-[3px] border-ink shadow-[4px_4px_0_var(--color-ink)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_var(--color-ink)] transition-all"
        >
          Entrar com Discord
        </button>
      </StickerCard>
    </div>
  );
}

export default Login;

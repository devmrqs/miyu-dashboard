function Login() {
  function handleLogin() {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/discord`;
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <button
        onClick={handleLogin}
        className="bg-indigo-500 text-white font-semibold px-6 py-3 rounded-2xl hover:bg-indigo-600 transition"
      >
        Entrar com Discord
      </button>
    </div>
  );
}

export default Login;

import { Link } from "react-router-dom";
import miyuMascot from "../assets/miyu-mascot.jpeg";

function AppHeader() {
  return (
    <header className="border-b-[3px] border-ink bg-miyu-cream select-none">
      <div className="max-w-3xl mx-auto px-8 py-4 flex items-center gap-3">
        <img
          src={miyuMascot}
          alt="Miyu"
          className="w-10 h-10 rounded-full border-[3px] border-ink object-cover"
        />
        <div>
          <Link
            to="/dashboard"
            className="text-xl font-bold text-ink leading-none"
          >
            Miyu
          </Link>
          <p className="text-xs text-ink/50 font-medium">painel de controle</p>
        </div>
      </div>
    </header>
  );
}

export default AppHeader;

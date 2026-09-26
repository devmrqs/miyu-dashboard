import { useState } from "react";
import { Navigate } from "react-router-dom";
import { DndContext, closestCenter, type DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import miyuMascot from "../assets/miyu-mascot.jpeg";
import StickerCard from "../components/StickerCard";
import { useAuth } from "../lib/useAuth";

interface Feature {
  id: string;
  icon: string;
  text: string;
}

const INITIAL_FEATURES: Feature[] = [
  { id: "1", icon: "🎨", text: "Crie embeds com preview em tempo real" },
  { id: "2", icon: "👋", text: "Configure boas-vindas personalizadas" },
  { id: "3", icon: "🖱️", text: "Monte tudo arrastando os blocos" },
];

function SortableFeature({ feature }: { feature: Feature }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: feature.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex items-center gap-2 bg-white border-2 border-ink rounded-lg px-3 py-2 text-left cursor-grab active:cursor-grabbing"
    >
      <span>{feature.icon}</span>
      <span className="text-sm font-bold text-ink">{feature.text}</span>
    </div>
  );
}

function Login() {
  const { isAuthenticated, isLoading } = useAuth();
  const [features, setFeatures] = useState<Feature[]>(INITIAL_FEATURES);

  function handleLogin() {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/discord`;
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setFeatures((prev) => {
      const oldIndex = prev.findIndex((f) => f.id === active.id);
      const newIndex = prev.findIndex((f) => f.id === over.id);
      return arrayMove(prev, oldIndex, newIndex);
    });
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-ink font-bold">
        Carregando...
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <StickerCard className="p-8 max-w-sm w-full flex flex-col items-center text-center -rotate-1">
        <img
          src={miyuMascot}
          alt="Miyu"
          className="w-40 h-40 rounded-2xl border-[3px] border-ink object-cover mb-4"
        />

        <h1 className="text-3xl font-bold text-ink mb-1">Miyu</h1>
        <p className="text-ink/60 font-bold mb-5">
          O jeito mais fofo de configurar seu servidor
        </p>

        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={features.map((f) => f.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="w-full space-y-2 mb-6">
              {features.map((feature) => (
                <SortableFeature key={feature.id} feature={feature} />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        <button
          onClick={handleLogin}
          className="w-full bg-miyu-pink-dark text-white font-bold px-6 py-3 rounded-xl border-[3px] border-ink shadow-[4px_4px_0_var(--color-ink)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_var(--color-ink)] transition-all"
        >
          Entrar com Discord
        </button>
      </StickerCard>
    </div>
  );
}

export default Login;

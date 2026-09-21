import { useState } from "react";
import type { BlockType } from "../types/block";
import Select from "./Select";

interface AddBlockMenuProps {
  onAdd: (type: BlockType) => void;
}

const BLOCK_OPTIONS = [
  { value: "text", label: "Texto" },
  { value: "separator", label: "Separador" },
  { value: "button-link", label: "Botão de Link" },
  { value: "button-action", label: "Botão de Ação" },
  { value: "section-thumbnail", label: "Seção com Imagem" },
  { value: "media-gallery", label: "Galeria de Imagens" },
];

function AddBlockMenu({ onAdd }: AddBlockMenuProps) {
  const [key, setKey] = useState(0);

  function handleChange(value: string) {
    onAdd(value as BlockType);
    setKey((prev) => prev + 1);
  }

  return (
    <Select
      key={key}
      label="Adicionar bloco"
      placeholder="Escolha um tipo..."
      options={BLOCK_OPTIONS}
      value=""
      onValueChange={handleChange}
    />
  );
}

export default AddBlockMenu;

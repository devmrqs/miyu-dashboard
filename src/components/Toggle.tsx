interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  disabled?: boolean;
  activeColorClass?: string;
}

function Toggle({
  checked,
  onChange,
  label,
  disabled = false,
  activeColorClass = "bg-[#43cdba]",
}: ToggleProps) {
  const baseTrackBg = "bg-[#f4efe6]";
  const disabledTrackBg = checked ? "bg-[#a6dbd3]" : "bg-[#f2eee6]";

  const currentBg = disabled
    ? disabledTrackBg
    : checked
      ? activeColorClass
      : baseTrackBg;

  const trackStyles = disabled
    ? "border-gray-400 shadow-[4px_4px_0px_0px_#9ca3af]"
    : "border-black shadow-[4px_4px_0px_0px_#000000]"; // Aumentei a sombra para acompanhar a borda mais grossa

  const thumbStyles = disabled ? "border-gray-400" : "border-black";

  return (
    <label
      className={`flex items-center gap-3 ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
    >
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={`w-14 h-8 rounded-full border-[3px] relative transition-colors duration-200 ${trackStyles} ${currentBg}`}
      >
        <span
          className={`absolute top-0.75 left-0.75 w-5 h-5 bg-white border-[3px] rounded-full transition-transform duration-200 ${thumbStyles} ${
            checked ? "translate-x-6" : "translate-x-0"
          }`}
        />
      </button>
      <span
        className={`font-bold ${disabled ? "text-gray-400" : "text-black"}`}
      >
        {label}
      </span>
    </label>
  );
}

export default Toggle;

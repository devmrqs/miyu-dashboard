import * as RadixSelect from "@radix-ui/react-select";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label?: string;
  placeholder?: string;
  options: SelectOption[];
  value?: string;
  onValueChange: (value: string) => void;
}

function Select({
  label,
  placeholder = "Escolha...",
  options,
  value,
  onValueChange,
}: SelectProps) {
  return (
    <div className="flex flex-col gap-1 select-none">
      {label && <label className="text-sm font-bold text-ink">{label}</label>}

      <RadixSelect.Root value={value} onValueChange={onValueChange}>
        <RadixSelect.Trigger className="flex items-center justify-between w-full bg-white border-[3px] border-ink rounded-lg px-4 py-2.5 font-bold text-ink shadow-[3px_3px_0_var(--color-ink)] data-[state=open]:translate-x-0.5 data-[state=open]:translate-y-0.5 data-[state=open]:shadow-[1px_1px_0_var(--color-ink)] transition-all cursor-pointer outline-none">
          <RadixSelect.Value placeholder={placeholder} />
          <RadixSelect.Icon className="font-bold">▾</RadixSelect.Icon>
        </RadixSelect.Trigger>

        <RadixSelect.Portal>
          <RadixSelect.Content
            position="popper"
            side="bottom"
            avoidCollisions={false}
            sideOffset={6}
            className="bg-white border-[3px] border-ink rounded-lg shadow-[4px_4px_0_var(--color-ink)] overflow-hidden z-50 w-(--radix-select-trigger-width)"
          >
            <RadixSelect.Viewport className="max-h-60 overflow-y-auto">
              {options.map((option) => (
                <RadixSelect.Item
                  key={option.value}
                  value={option.value}
                  className="px-4 py-2.5 font-bold text-ink cursor-pointer outline-none data-highlighted:bg-miyu-pink/30 border-b-0.5 border-ink last:border-b-0"
                >
                  <RadixSelect.ItemText>{option.label}</RadixSelect.ItemText>
                </RadixSelect.Item>
              ))}
            </RadixSelect.Viewport>
          </RadixSelect.Content>
        </RadixSelect.Portal>
      </RadixSelect.Root>
    </div>
  );
}

export default Select;

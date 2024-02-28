export type SelectOption<T = string> = {
  value: T;
  label: string;
};

type Props<T = string> = {
  options: SelectOption<T>[];
  value: T;
  label: string;
  onChange: (value: T) => void;
};

export const Select = <T extends string = string>({
  value,
  options,
  label,
  onChange,
}: Props<T>) => {
  return (
    <>
      <label>{label}</label>
      <select
        value={value}
        className="margin-left"
        onChange={(e) => {
          onChange(e.target.value as T);
        }}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </>
  );
};
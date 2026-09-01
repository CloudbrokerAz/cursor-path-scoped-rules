import { labelForVariant, type ButtonVariant } from "./ui";

export type ButtonProps = {
  variant: ButtonVariant;
  onClick: () => void;
};

export function Button({ variant, onClick }: ButtonProps) {
  return (
    <button className={`btn btn-${variant}`} onClick={onClick} type="button">
      {labelForVariant(variant)}
    </button>
  );
}

interface SaveButtonProps {
  text: string;
  onClick?: () => void;
}

export default function SaveButton({ text, onClick }: SaveButtonProps) {
  return (
    <button
      onClick={onClick}
      className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-darker)] 
      hover:from-[var(--color-primary-dark)] hover:to-[var(--color-secondary-darker)] 
      cursor-pointer text-white p-2 w-32 rounded-md font-semibold transition-all"
    >
      {text}
    </button>
  );
}

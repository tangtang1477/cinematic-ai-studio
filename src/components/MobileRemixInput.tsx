import { useEffect, useRef, useState } from "react";
import { Plus, Settings, ArrowUp } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit?: (text: string) => void;
}

const MobileRemixInput = ({ open, onClose, onSubmit }: Props) => {
  const [text, setText] = useState("");
  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setMounted(true);
      requestAnimationFrame(() => {
        setVisible(true);
        setTimeout(() => inputRef.current?.focus(), 50);
      });
    } else if (mounted) {
      setVisible(false);
      const t = setTimeout(() => setMounted(false), 300);
      return () => clearTimeout(t);
    }
  }, [open, mounted]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!mounted) return null;

  const canSend = text.trim().length > 0;

  const handleSend = () => {
    if (!canSend) return;
    onSubmit?.(text.trim());
    setText("");
    onClose();
  };

  return (
    <>
      <div
        className="fixed inset-0 z-[70]"
        onClick={onClose}
        style={{
          background: "rgba(0,0,0,0.4)",
          opacity: visible ? 1 : 0,
          transition: "opacity 280ms cubic-bezier(0.22,1,0.36,1)",
        }}
      />
      <div
        className="fixed left-0 right-0 bottom-0 z-[71]"
        style={{
          background: "rgba(0,0,0,0.5)",
          borderTop: "1px solid rgba(255,255,255,0.2)",
          backdropFilter: "blur(7.5px)",
          WebkitBackdropFilter: "blur(7.5px)",
          borderRadius: "24px 24px 0 0",
          padding: "16px 16px calc(16px + env(safe-area-inset-bottom))",
          transform: visible ? "translateY(0)" : "translateY(100%)",
          transition: "transform 280ms cubic-bezier(0.22,1,0.36,1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <input
          ref={inputRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
          placeholder="Describe changes…"
          className="w-full bg-transparent outline-none border-none"
          style={{
            color: "#fff",
            fontSize: 15,
            lineHeight: "20px",
            padding: "8px 4px 16px",
          }}
        />
        <div className="flex items-center gap-2">
          <button
            aria-label="Add"
            className="flex items-center justify-center rounded-full"
            style={{
              width: 40,
              height: 40,
              background: "#151515",
              border: "1.5px solid #202020",
            }}
          >
            <Plus size={18} color="#D9D9D9" />
          </button>
          <div className="flex-1" />
          <button
            aria-label="Settings"
            className="flex items-center justify-center rounded-full"
            style={{
              width: 40,
              height: 40,
              background: "#151515",
              border: "1.5px solid #202020",
            }}
          >
            <Settings size={18} color="#D9D9D9" />
          </button>
          <button
            onClick={handleSend}
            disabled={!canSend}
            aria-label="Send"
            className="flex items-center justify-center rounded-full transition-opacity"
            style={{
              width: 40,
              height: 40,
              background: "#fff",
              opacity: canSend ? 1 : 0.4,
            }}
          >
            <ArrowUp size={20} color="#000" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </>
  );
};

export default MobileRemixInput;

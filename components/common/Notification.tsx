
import { CircleCheck, CircleAlert, X } from "lucide-react";
import { useEffect } from "react";

type NotificationProps = {
    message: string;
    type: "success" | "error";
    isClosing: boolean
    onClose: () => void
    onExitComplete: () => void
};

export default function Notification({
    message,
    type,
    isClosing,
    onClose,
    onExitComplete
}: NotificationProps) {
    const isSuccess = type === "success";

    useEffect(() => {
        if (isClosing) return;
        
        const timeout = setTimeout(() => {
            onClose();
        }, 4000);

        return () => clearTimeout(timeout);
    }, [isClosing, onClose]);

    useEffect(() => {
        if(!isClosing) return;

        const timeout = setTimeout(() => {
            onExitComplete()
        }, 250)

        return () => clearTimeout(timeout)
    }, [isClosing, onExitComplete])

    return (
        <section
            role="status"
            aria-live={isSuccess ? "polite" : "assertive"}
            className={`fixed right-4 top-4 z-50 flex max-w-sm items-center gap-3
                rounded-2xl border bg-essenza-background p-4 shadow-lg
                sm:right-8 sm:top-8
                ${isClosing
                    ? "animate-notification-exit"
                    : "animate-notification-enter"
                }`}
        >
            <span
                className={`flex size-10 shrink-0 items-center justify-center rounded-full
          ${isSuccess
                        ? "bg-essenza-primary/10 text-essenza-primary"
                        : "bg-red-500/10 text-red-600"
                    }`}
            >
                {isSuccess ? (
                    <CircleCheck size={21} />
                ) : (
                    <CircleAlert size={21} />
                )}
            </span>

            <p className="text-sm font-medium leading-relaxed text-essenza-text">
                {message}
            </p>

            <button
                type="button"
                onClick={onClose}
                aria-label="Cerrar notificación"
                className="ml-2 cursor-pointer rounded-lg p-1 text-essenza-text/60
                    transition-colors hover:bg-essenza-primary/10
                    hover:text-essenza-text"
            >
                <X size={18} />
            </button>
        </section>
    );
}

import {Button} from "@/components/Button";

type ConfirmDialogProps = {
    isOpen : boolean;
    message: string;
    onConfirm?: () => void;
    onCancel: () => void;
    confirmLabel?: string;
    cancelLabel?: string;
    /** false のときは閉じるボタンだけ出す（削除完了後） */
    showConfirm?: boolean;
}

export function ConfirmDialog({
    isOpen,
    message,
    onConfirm,
    onCancel,
    confirmLabel = "削除する",
    cancelLabel = "キャンセル",
    showConfirm = true,
}:ConfirmDialogProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" onClick={onCancel}>
            <div className="w-full max-w-sm rounded-lg bg-white p-4 shadow-lg" onClick={(e)=> e.stopPropagation()}>
                <p className="text-sm text-gray-800">{message}</p>
                <div className="mt-4 flex justify-end gap-2">
                    <Button
                    type="button"
                    className="bg-gray-200 !text-gray-800 hover:bg-gray-300"
                    onClick={onCancel}
                    >
                        {cancelLabel}
                    </Button>
                    {showConfirm && (
                    <Button
                        type="button"
                        className="bg-red-500 hover:bg-red-600"
                        onClick={onConfirm}
                    >
                        {confirmLabel}
                    </Button>
                    )}
                </div>
            </div>
        </div>
    )
}
// components/shared/ConfirmDialog.tsx
"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ReactNode, useEffect, useState } from "react";
import { cn } from "@/libs/utils";

type TextareaConfig = {
  label?: ReactNode;
  placeholder?: string;
  required?: boolean;
  maxLength?: number;
  rows?: number;
  /** Controlled value (optional). If provided, component won't manage its own state. */
  value?: string;
  /** Controlled onChange (optional). */
  onChange?: (v: string) => void;
  /** Initial value for the internal state (used when uncontrolled). */
  initialValue?: string;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: ReactNode;
  description?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmClassName?: string; // e.g. "bg-red-600 hover:bg-red-700"
  isLoading?: boolean;
  /** onConfirm now receives the textarea value (if textarea is enabled). */
  onConfirm: (comment?: string) => void | Promise<void>;
  /** Pass this to show a textarea. Omit to keep the classic confirm-only dialog. */
  textareaProps?: TextareaConfig;
};

export function ConfirmDialog({
  open,
  onOpenChange,
  title = "Are you sure?",
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  confirmClassName,
  isLoading,
  onConfirm,
  textareaProps,
}: Props) {
  // Internal state only used when the textarea is uncontrolled
  const [internalComment, setInternalComment] = useState<string>("");

  const controlled = typeof textareaProps?.value === "string";
  const comment = controlled
    ? textareaProps?.value ?? ""
    : internalComment;

  const setComment = textareaProps?.onChange ?? setInternalComment;

  // Reset internal value when dialog opens
  useEffect(() => {
    if (open && textareaProps && !controlled) {
      setInternalComment(textareaProps.initialValue ?? "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const confirmDisabled =
    !!isLoading ||
    !!(textareaProps?.required && !comment.trim());

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description ? (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          ) : null}
        </AlertDialogHeader>

        {textareaProps && (
          <div className="space-y-2 pt-2">
            {textareaProps.label ? (
              <Label>{textareaProps.label}</Label>
            ) : null}
            <Textarea
              rows={textareaProps.rows ?? 4}
              placeholder={textareaProps.placeholder}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              maxLength={textareaProps.maxLength}
              className="resize-none"
              aria-invalid={
                textareaProps.required && !comment.trim() ? true : undefined
              }
            />
            {typeof textareaProps.maxLength === "number" && (
              <div className="text-xs text-muted-foreground text-right">
                {comment.length}/{textareaProps.maxLength}
              </div>
            )}
          </div>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction
            className={cn(confirmClassName)}
            disabled={confirmDisabled}
            onClick={() => void onConfirm(textareaProps ? comment : undefined)}
          >
            {isLoading ? "Processing..." : confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

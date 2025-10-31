"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  description?: ReactNode;
  children: ReactNode;             // your form fields
  submitLabel?: string;
  cancelLabel?: string;
  isSubmitting?: boolean;
  onSubmit: () => void | Promise<void>;
  onCancel?: () => void;
  sizeClassName?: string;          // e.g. "sm:max-w-md"
};

export function FormDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  submitLabel = "Save",
  cancelLabel = "Cancel",
  isSubmitting,
  onSubmit,
  onCancel,
  sizeClassName = "sm:max-w-md",
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={sizeClassName}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description ? <DialogDescription>{description}</DialogDescription> : null}
        </DialogHeader>

        <div className="space-y-4">{children}</div>

        <DialogFooter>
          <Button
            variant="ghost"
            onClick={() => (onCancel ? onCancel() : onOpenChange(false))}
            disabled={isSubmitting}
          >
            {cancelLabel}
          </Button>
          <Button onClick={() => void onSubmit()} disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : submitLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

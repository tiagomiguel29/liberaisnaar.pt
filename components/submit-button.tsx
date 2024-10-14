"use client";

import { type ComponentProps } from "react";
import { useFormStatus } from "react-dom";
import { Spinner } from "./spinner";
import { Button } from "@mui/material";

type Props = ComponentProps<typeof Button> & {
  pendingText?: string;
};

export function SubmitButton({
  children,
  pendingText = "Submitting...",
  ...props
}: Props) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" variant="contained" disabled={pending} aria-disabled={pending} {...props}>
      {pending ? <Spinner/> : children}
    </Button>
  );
}

"use client";

import { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { logoutUser } from "@/actions/user";

export default function SessionExpiredDialog() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleSessionExpired = () => setOpen(true);
    window.addEventListener("session-expired", handleSessionExpired);

    return () => {
      window.removeEventListener("session-expired", handleSessionExpired);
    };
  }, []);

  const handleLoginAgain = async () => {
    try {
      await logoutUser(); // clear cookies/session
    } catch (e) {
      console.error("Logout cleanup failed:", e);
    }
    setOpen(false);
    window.location.href = "/sign-in";
  };

  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="bg-white z-[99] max-w-sm rounded-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-red-600">
            Session Expired
          </AlertDialogTitle>
          <AlertDialogDescription>
            Your session has expired. Please log in again to continue.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button onClick={handleLoginAgain}>Login Again</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "shssc-portal-privacy-notice-dismissed";

export default function PrivacyNotice() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const dismissed = window.localStorage.getItem(STORAGE_KEY);
    setOpen(!dismissed);
  }, []);

  function handleClose() {
    window.localStorage.setItem(STORAGE_KEY, "true");
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Privacy Notice</DialogTitle>
          <DialogDescription>
            SHSSC Portal collects and processes your school email, profile details, and submitted
            concerns so the Student Council can respond appropriately under the Data Privacy Act of
            2012 (RA 10173).
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>
            Anonymous complaints and suggestions will be handled without exposing your identity to
            non-sysadmin officers.
          </p>
          <p>
            By continuing to use the portal, you acknowledge the privacy workflow described in the
            registration form and Privacy Policy.
          </p>
        </div>
        <DialogFooter>
          <Button onClick={handleClose}>Continue</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

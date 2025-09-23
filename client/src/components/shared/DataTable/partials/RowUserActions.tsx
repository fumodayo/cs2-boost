import React, { useState } from "react";
import toast from "react-hot-toast";
import { FaBan, FaCheckCircle } from "react-icons/fa";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/@radix-ui/AlertDialog";
import { Button } from "~/components/shared/Button";
import { IUser } from "~/types";
import Input from "../../Input";

interface RowUserActionsProps {
  user: IUser;
  onBanUser: (userId: string, reason: string) => Promise<void>;
  onUnbanUser: (userId: string) => Promise<void>;
  isProcessing: boolean;
}

const RowUserActions: React.FC<RowUserActionsProps> = ({
  user,
  onBanUser,
  onUnbanUser,
  isProcessing,
}) => {
  const [banReason, setBanReason] = useState("");

  const handleConfirmBan = () => {
    if (!banReason.trim()) {
      toast.error("Please provide a reason for banning.");
      return;
    }
    onBanUser(user._id, banReason);
  };

  const handleConfirmUnban = () => {
    onUnbanUser(user._id);
  };

  return (
    <div className="flex justify-end">
      {user.is_banned ? (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="text-green-500 hover:bg-green-50 hover:text-green-600"
            >
              <FaCheckCircle className="mr-2" /> Unban
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Unban user {user.username}?</AlertDialogTitle>
              <AlertDialogDescription>
                The account will be unlocked. Banned for:
                <span className="font-semibold">{user.ban_reason}</span>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmUnban}
                disabled={isProcessing}
              >
                {isProcessing ? "Processing..." : "Confirm Unban"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ) : (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="danger"
              size="sm"
              className="text-white"
            >
              <FaBan className="mr-2" /> Ban
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Ban user {user.username}?</AlertDialogTitle>
              <AlertDialogDescription>
                This action will lock the user's account. Please provide a
                reason.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <Input
              id="ban-reason"
              placeholder="Reason for banning..."
              value={banReason}
              onChange={(e) => setBanReason(e.target.value)}
              className="mt-2"
            />
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setBanReason("")}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmBan}
                disabled={isProcessing}
              >
                {isProcessing ? "Processing..." : "Confirm Ban"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};

export default RowUserActions;

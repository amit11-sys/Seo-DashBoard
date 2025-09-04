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
} from "@/components/ui/alert-dialog";
import { MdDeleteSweep } from "react-icons/md";

export default function BulkDeleteDialog({
  selectedKeywords,
  campaignId,
  handleBulkDelete,
}: {
  selectedKeywords: string[];
  campaignId: string;
  handleBulkDelete: (selected: string[], campaignId: string) => void;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button
          disabled={selectedKeywords.length === 0}
          className="px-3 flex items-center gap-2 py-1 bg-red-500 text-white rounded disabled:opacity-50"
        >
          <MdDeleteSweep className="text-2xl" /> Delete
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-white">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Keywords?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. Are you sure you want to delete{" "}
            <span className="font-semibold">{selectedKeywords.length}</span>{" "}
            selected keyword(s)?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-500 hover:bg-red-600 text-white"
            onClick={() => handleBulkDelete(selectedKeywords, campaignId)}
          >
            Yes, Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

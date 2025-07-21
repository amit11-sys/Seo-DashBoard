import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";



export function CampaignModal({ buttonText }: { buttonText: string }) {
 
  
  // async function onSubmit(values: z.infer<typeof campaignSchema>) {
  //   console.log("started loading...");

  //   startLoading(); // ✅ Start loading

  //   try {
  //     // toast("trying");
  //     const campaign = await createCampaign(values);
  //     if (campaign?.success) {
  //       toast("Campaign Created Successfully");
  //     } else {
  //       toast(campaign?.error);
  //     }
  //   } catch (error) {
  //     toast("Something went wrong");
  //   } finally {
  //     stopLoading();
  //   }
  // }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">{buttonText}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Campaign</DialogTitle>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

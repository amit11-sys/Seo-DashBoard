import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { campaignSchema } from "@/lib/zod";
import { useLoader } from "@/hooks/useLoader";
import { toast } from "sonner";
import { createCampaign } from "@/actions/campaign";
export function CampaignModal({ buttonText }: { buttonText: string }) {
  const { startLoading, stopLoading } = useLoader();
  const form = useForm<z.infer<typeof campaignSchema>>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      name: "",
      url: "",
    },
  });
  async function onSubmit(values: z.infer<typeof campaignSchema>) {
    console.log('started loading...');
    
    startLoading(); // ✅ Start loading

    try {
      // toast("trying");
      const campaign=await createCampaign(values)
      if(campaign?.success){
        toast("Campaign Created Successfully")
      }else{
        toast(campaign?.error)
      }
    } catch (error) {
      toast("Something went wrong");
    } finally {
      stopLoading();
    }
  }
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

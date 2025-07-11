"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { HiOutlineKey } from "react-icons/hi";
import { MdOutlineDevices, MdOutlineLocationOn } from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
import { LiaLanguageSolid, LiaSearchLocationSolid } from "react-icons/lia";
import { TbTag } from "react-icons/tb";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import CustomButton from "../../ui/CustomButton";
import { NewCustomInput } from "@/components/NewCustomInput";
import DropDownList from "../../DropDownList";
import { toast } from "sonner";
import { createUpdateKeywordById } from "@/actions/keyword";
import { getDbLiveKeywordData } from "@/actions/keywordTracking";

const editKeywordsSchema = z.object({
  url: z.string().url("Invalid URL"),
  keywordTag: z.string().optional(),
  searchLocation: z.string().min(1, "Location is required"),
  volumeLocation: z.string().optional(),
  language: z.string().min(1, "Language is required"),
  SearchEngine: z.string().optional(),
  serpType: z.string().optional(),
  deviceType: z.string().optional(),
  keywords: z.string().min(1, "Enter at least one keyword"),
});

interface EditKeywordsProps {
  campaignId: string;
  defaultData?: any; // for editing existing values
  keywordId: string;
  showAddedKeyword: any;
  setTableBody:any
}

const EditKeywords = ({
  campaignId,
  defaultData,
  keywordId,
  showAddedKeyword,
  setTableBody, // Optional: if you want to update the table body after editing
}: EditKeywordsProps) => {
  const form = useForm<z.infer<typeof editKeywordsSchema>>({
    resolver: zodResolver(editKeywordsSchema),
    defaultValues: {
      url: defaultData?.url || "",
      keywordTag: defaultData?.keywordTag || "",
      searchLocation: defaultData?.searchLocation || "",
      volumeLocation: defaultData?.volumeLocation || "",
      language: defaultData?.language || "",
      SearchEngine: defaultData?.SearchEngine || "",
      serpType: defaultData?.serpType || "",
      deviceType: defaultData?.deviceType || "",
      keywords: defaultData?.keywords || "",
    },
  });

  const [tagsInput, setTagsInput] = useState("");
  const [keywords, setKeywords] = useState<string[]>(
    defaultData?.keywords || ""
  );
  const [keywordError, setKeywordError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      (e.key === "Enter" || e.key === "," || e.key === " ") &&
      tagsInput.trim()
    ) {
      e.preventDefault();
      const trimmed = tagsInput.trim();
      if (!keywords.includes(trimmed)) {
        setKeywords((prev) => [...prev, trimmed]);
      }
      setTagsInput("");
    } else if (e.key === "Backspace" && !tagsInput && keywords.length) {
      setKeywords((prev) => prev.slice(0, -1));
    }
  };

  const removeKeyword = (index: number) => {
    setKeywords((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async () => {
    const isValid = await form.trigger();
    if (keywords.length === 0) {
      setKeywordError("Please enter at least one keyword.");
      return;
    } else {
      setKeywordError(null);
    }
    if (!isValid) return;

    const payload = {
      ...form.getValues(),

      campaignId,
      keywordId,
    };

    console.log(payload, "edit");
    try {
      const Response = await createUpdateKeywordById(payload);
 const campaignLiveKeywordsData = await getDbLiveKeywordData(campaignId);
      let data: any = [];
      if (campaignLiveKeywordsData.LiveKeywordDbData) {
        data = campaignLiveKeywordsData.LiveKeywordDbData.map((item: any) => ({
          // select: false,
          status: item.status,
          keywordId: item.keywordId,
          keyword: item.keyword,
          location: item.location_name,
          // intent: "C",
          start: String(item.rank_group),
          page: Math.ceil(item.rank_absolute / 10).toString(),
          Absolute_Rank: String(item.rank_absolute),
          Group_Rank: String(item.rank_group),
          // oneDay: "1",
          sevenDays: "-",
          // thirtyDays: "-",
          life: String(item.rank_group),
          // comp: "0",
          // sv: "0",
          date: new Date(item.createdAt).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "2-digit",
          }),
          rankingUrl: item.url,
          // rankingUrl: new URL(item.url) || "/",
        }));
      }
      setTableBody(data);
      if (!Response) throw new Error("Update failed");
      console.log(Response.tracking);
      //   await showAddedKeyword(
      //  Response.tracking
      // );
      toast.success("Keywords updated successfully");
      form.reset({
        url: "",
        keywordTag: "",
        searchLocation: "",
        language: "",
        SearchEngine: "",
        serpType: "",
        deviceType: "",
        volumeLocation: "",
        keywords: "",
      });

      setOpen(false);
      // Optional: form.reset(); or refresh logic
    } catch (error) {
      console.error("Edit Error:", error);
      toast.error("Failed to update keywords");
    }
  };
  const languages = [
  "English",
  "Spanish",
  "French",
  "German",
  "Italian",
  "Portuguese",
  "Dutch",
  "Russian",
  "Japanese",
  "Korean",
  "Chinese (Simplified)",
  "Chinese (Traditional)",
  "Arabic",
  "Hindi",
  "Bengali",
  "Urdu",
  "Turkish",
  "Polish",
  "Vietnamese",
  "Thai",
  "Hebrew",
  "Swedish",
  "Norwegian",
  "Danish",
  "Finnish",
  "Greek",
  "Hungarian",
  "Czech",
  "Romanian",
  "Slovak",
  "Indonesian",
  "Malay",
  "Filipino",
  "Ukrainian",
  "Bulgarian",
  "Serbian",
  "Croatian",
  "Lithuanian",
  "Latvian",
  "Estonian",
  "Persian",
  "Swahili",
  "Catalan",
  "Slovenian",
  "Icelandic",
  "Welsh",
  "Irish",
  "Basque",
  "Galician",
  "Albanian",
  "Macedonian",
];
const countries = [
  "United States",
  "Canada",
  "New Zealand",
  "United Kingdom",
  "Australia",
  "India",
  "Germany",
  "France",
  "Japan",
  "China",
  "Brazil",
  "South Africa",
  "Russia",
  "Italy",
  "Spain",
  "Netherlands",
  "Mexico",
  "United Arab Emirates",
  "Turkey",
  "South Korea",
  "Indonesia"
];
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <HiOutlineKey className="text-xl text-blue-600 cursor-pointer" />
      </DialogTrigger>

      <DialogContent className="max-w-4xl border-none shadow-2xl bg-white p-6">
        <DialogHeader className="flex items-center gap-2">
          <HiOutlineKey className="text-2xl text-orange-500" />
          <DialogTitle className="text-2xl font-semibold text-gray-800">
            Edit Keywords
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <div className="grid grid-cols-2 gap-6 mt-6">
            <div className="space-y-4">
              <Controller
                name="url"
                control={form.control}
                render={({ field }) => (
                  <NewCustomInput
                    placeholder="Enter Domain URL"
                    {...field}
                    errorMessage={form.formState.errors.url?.message}
                  />
                )}
              />
              <Controller
                name="keywordTag"
                control={form.control}
                render={({ field }) => (
                  <NewCustomInput
                    icon={<TbTag className="text-blue-500" />}
                    placeholder="Keyword Tag"
                    {...field}
                  />
                )}
              />
              <Controller
                name="searchLocation"
                control={form.control}
                render={({ field }) => (
                  <DropDownList
                    listData={countries}
                    icon={
                      <MdOutlineLocationOn className="text-blue-500 text-xl" />
                    }
                    listName="Search Location"
                    value={field.value}
                    onChange={(selected) => field.onChange(selected?.value)}
                    errorMessage={form.formState.errors.searchLocation?.message}
                  />
                )}
              />
              <Controller
                name="volumeLocation"
                control={form.control}
                render={({ field }) => (
                  <DropDownList
                    listData={["Toronto", "OK"]}
                    icon={
                      <MdOutlineLocationOn className="text-blue-500 text-xl" />
                    }
                    listName="Volume Location"
                    value={field.value}
                    onChange={(selected) => field.onChange(selected?.value)}
                  />
                )}
              />
              <Controller
                name="language"
                control={form.control}
                render={({ field }) => (
                  <DropDownList
                    listData={languages}
                    icon={
                      <LiaLanguageSolid className="text-blue-500 text-xl" />
                    }
                    listName="Language"
                    value={field.value}
                    onChange={(selected) => field.onChange(selected?.value)}
                    errorMessage={form.formState.errors.language?.message}
                  />
                )}
              />
            </div>

            <div className="space-y-4">
              <Controller
                name="keywords"
                control={form.control}
                render={({ field }) => (
                  <NewCustomInput
                    icon={<TbTag className="text-blue-500" />}
                    placeholder="Keywords"
                    {...field}
                  />
                )}
              />
              {keywordError && (
                <p className="text-red-500 text-sm">{keywordError}</p>
              )}

              <Controller
                name="SearchEngine"
                control={form.control}
                render={({ field }) => (
                  <DropDownList
                    listData={["US (google.com)", "NL (google.com)"]}
                    icon={<FcGoogle className="text-xl" />}
                    listName="Search Engine"
                    value={field.value}
                    onChange={(selected) => field.onChange(selected?.value)}
                  />
                )}
              />
              <Controller
                name="serpType"
                control={form.control}
                render={({ field }) => (
                  <DropDownList
                    listData={["organic", "paid"]}
                    icon={
                      <LiaSearchLocationSolid className="text-blue-500 text-xl" />
                    }
                    listName="SERP Type"
                    value={field.value}
                    onChange={(selected) => field.onChange(selected?.value)}
                  />
                )}
              />
              <Controller
                name="deviceType"
                control={form.control}
                render={({ field }) => (
                  <DropDownList
                    listData={["desktop", "mobile"]}
                    icon={
                      <MdOutlineDevices className="text-blue-500 text-xl" />
                    }
                    listName="Device Type"
                    value={field.value}
                    onChange={(selected) => field.onChange(selected?.value)}
                  />
                )}
              />
            </div>
          </div>

          <div className="mt-6 flex justify-start">
            <CustomButton buttonName="Update" onClick={onSubmit} />
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditKeywords;

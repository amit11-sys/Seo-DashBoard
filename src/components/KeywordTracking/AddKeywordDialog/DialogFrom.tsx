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
import { useRouter } from "next/navigation";
import CustomButton from "../../ui/CustomButton";
import { NewCustomInput } from "@/components/NewCustomInput";
import DropDownList from "../../DropDownList";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { TbTag } from "react-icons/tb";
import { addKeywordsSchema } from "@/lib/zod";
// import { createNewkeywords } from "@/actions/addKeywords";
import { toast } from "sonner";
// import { getDbLiveKeywordData } from "@/actions/keywordTracking";

const schema = z.object({
  name: z.string().min(1, "Campaign name is required"),
  keywordTag: z.string().optional(),
  searchLocation: z.string().min(1, "Location is required"),
  language: z.string().min(1, "Language is required"),
  SearchEngine: z.string().optional(),
  serpType: z.string().optional(),
  deviceType: z.string().optional(),
});
interface compaignid {
  campaignId: string;
}
const DialogForm = (campaignId: any) => {
  const form = useForm({
    resolver: zodResolver(addKeywordsSchema),
    defaultValues: {
      url: "",
      keywordTag: "",
      searchLocation: "",
      language: "",
      SearchEngine: "",
      serpType: "",
      deviceType: "",
      volumeLocation: "",
      keywords: [],
    },
  });

  const [tagsInput, setTagsInput] = useState("");
  const [Keywords, setKeywords] = useState<string[]>([]);
  const [keywordError, setKeywordError] = useState<string | null>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      (e.key === "Enter" || e.key === "," || e.key === " ") &&
      tagsInput.trim()
    ) {
      e.preventDefault();
      const trimmed = tagsInput.trim();
      if (!Keywords.includes(trimmed)) {
        setKeywords((prev) => [...prev, trimmed]);
      }
      setTagsInput("");
    } else if (e.key === "Backspace" && !tagsInput && Keywords.length) {
      setKeywords((prev) => prev.slice(0, -1));
    }
  };

  const removeKeyword = (index: number) => {
    setKeywords((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async () => {
    const isValid = await form.trigger();
    if (Keywords.length === 0) {
      setKeywordError("Please enter at least one keyword.");
      return;
    } else {
      setKeywordError(null);
    }
    if (!isValid) return;

    const payload = {
      ...form.getValues(),
      keywords: Keywords,
      campaignId,
    };

    try {
      const res = await fetch("/api/add-keywords", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to create keywords");
      if (!res.ok) throw new Error("Failed to create keywords");
      console.log(res);

      const response = await res.json();
      // if (!response.success) {
      //   throw new Error(response.error || "Failed to create keywords");
      // }
      console.log(response.addedKeywords, "Response from API");

      await campaignId?.showAddedKeyword(
        response?.addedKeywords
      );
      // Optionally, you can log the response or handle it as needed
      // console.log("Submitted:", response);
      toast.success(response?.message);

      // form.reset({
      //   url: "",
      //   keywordTag: "",
      //   searchLocation: "",
      //   language: "",
      //   SearchEngine: "",
      //   serpType: "",
      //   deviceType: "",
      //   volumeLocation: "",
      //   keywords: [],
      // });

      setKeywords([]);
      // await getDbLiveKeywordData(campaignId.campaignId)
    } catch (error) {
      console.error("Submission Error:", error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger className="bg-gradient-to-r from-[#FE7743] to-[#d65d2d] text-white px-5 py-4 rounded-full text-sm font-medium shadow-md transition-all duration-200 transform hover:scale-105">
        Add Keywords
      </DialogTrigger>

      <DialogContent className="max-w-4xl border-none shadow-2xl bg-white p-6">
        <DialogHeader className="flex items-center gap-2">
          <HiOutlineKey className="text-2xl text-blue-500" />
          <DialogTitle className="text-2xl font-semibold text-gray-800">
            Add Keywords
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
                    placeholder="Add Keyword Tag"
                    {...field}
                  />
                )}
              />
              <Controller
                name="searchLocation"
                control={form.control}
                render={({ field }) => (
                  <DropDownList
                    listData={["USA", "Canada", "New zealand"]}
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
                    listData={["toronto", "ok"]}
                    icon={
                      <MdOutlineLocationOn className="text-blue-500 text-xl" />
                    }
                    listName="volume Location"
                    value={field.value}
                    onChange={(selected) => field.onChange(selected?.value)}
                    errorMessage={form.formState.errors.volumeLocation?.message}
                  />
                )}
              />
              <Controller
                name="language"
                control={form.control}
                render={({ field }) => (
                  <DropDownList
                    listData={["English", "French"]}
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
              <div
                className={`multipleKeyword border ${keywordError && "border-red-400"} p-2 rounded w-full`}
              >
                <div className="flex flex-wrap gap-2">
                  {Keywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 px-2 py-1 rounded flex items-center gap-1"
                    >
                      {keyword}
                      <button onClick={() => removeKeyword(index)}>
                        &times;
                      </button>
                    </span>
                  ))}
                  <input
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a keyword and press Enter"
                    className="flex-1 bg-transparent p-1 outline-none"
                  />
                </div>
              </div>
              {keywordError && (
                <p className="text-red-500 text-sm">{keywordError}</p>
              )}

              <Controller
                name="SearchEngine"
                control={form.control}
                render={({ field }) => (
                  <DropDownList
                    listData={["US (google.com)", "NL (google.com)"]}
                    icon={<FcGoogle className=" text-xl" />}
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
            <CustomButton buttonName="Submit" onClick={onSubmit} />
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default DialogForm;

"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BlueButton from "@/components/ui/CustomButton";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { campaignSchema } from "@/lib/zod";
import { useLoader } from "@/hooks/useLoader";
import { toast } from "sonner";
import { createCampaign } from "@/actions/campaign";
import { CiCircleCheck } from "react-icons/ci";
import DropDownList from "@/components/DropDownList";
import { HiMiniTag } from "react-icons/hi2";
import { MdOutlineDevices, MdOutlineLocationOn } from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
import { LiaLanguageSolid, LiaSearchLocationSolid } from "react-icons/lia";
import axios from "axios";
import { NewCustomInput } from "./NewCustomInput";
import CustomButton from "@/components/ui/CustomButton";

type CampaignFormType = z.infer<typeof campaignSchema>;

export function CampaignTabs() {
  const { startLoading, stopLoading } = useLoader();

  const form = useForm<CampaignFormType>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      name: "",
      url: "",
      keywordTag: "",
      allkeywords: "",
      SearchEngine: "",
      searchLocation: "",
      volumeLocation: "",
      language: "",
      serpType: "",
      deviceType: "",
    },
  });
  console.log(form.getValues());

  const [tagsInput, settagsInput] = useState("");
  const [keywordTag, setkeywordTag] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [campaignValid, setCampaignValid] = useState(false);
  const [activeTab, setActiveTab] = useState("account");
  const [language, setLanguage] = useState<string[]>([]);
  const [location, setLocation] = useState<string[]>([]);

  const username = process.env.NEXT_PUBLIC_DATAFORSEO_USERNAME ?? "";
  const password = process.env.NEXT_PUBLIC_DATAFORSEO_PASSWORD ?? "";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://api.dataforseo.com/v3/dataforseo_labs/locations_and_languages",
          {
            auth: { username, password },
            headers: { "content-type": "application/json" },
          }
        );

        const langData = response.data?.tasks?.[0]?.result || [];

        const allLanguages: string[] = [];
        const allLocations: string[] = [];

        langData.forEach((item: any) => {
          item.available_languages.forEach((langItem: any) => {
            allLanguages.push(langItem.language_name);
          });
          allLocations.push(item.location_name);
        });

        setLanguage(allLanguages);
        setLocation(allLocations);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchData();
  }, []);

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
      settagsInput("");
    } else if (e.key === "Backspace" && !tagsInput && keywords.length) {
      setKeywords((prev) => prev.slice(0, -1));
    }
  };

  const removeKeyword = (index: number) => {
    setKeywords((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCampaignSubmit = async () => {
    const values = form.getValues();
    const isValid = await form.trigger();

    if (!values.name || !values.url) {
      toast("Please fill all fields.");
      return;
    }

    if (!isValid) return;

    setCampaignValid(true);
    toast("Campaign Info validated!");
    setActiveTab("keywords");
  };
  const allkeywords = keywords.join(" ");

  const onFinalSubmit = async () => {
    const values = form.getValues();

    if (!values.name || !values.url || keywords.length === 0) {
      toast("Please complete all fields.");
      return;
    }

    const payload = {
      ...values,
      allkeywords,
    };

    startLoading();
    try {
      const response = await createCampaign(payload);
      if (response?.success) {
        console.log(response);
        toast("Campaign created successfully");
        form.reset();
        setKeywords([]);
        setCampaignValid(false);
        setActiveTab("account");
      } else {
        toast(response?.error || "Failed to create campaign");
      }
    } catch (error) {
      toast("Something went wrong");
    } finally {
      stopLoading();
    }
  };

  return (
    <Form {...form}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="account">
            Campaign Info
            {campaignValid && (
              <CiCircleCheck className="ml-2 text-green-500" size={16} />
            )}
          </TabsTrigger>
          <TabsTrigger value="keywords" disabled={!campaignValid}>
            Live Keyword Tracking
          </TabsTrigger>
        </TabsList> */}
        <TabsList className="w-full flex gap-2 p-1 bg-gray-100 rounded-lg relative overflow-hidden">
          <TabsTrigger
            value="account"
            className="group relative flex-1 py-3 text-sm font-semibold text-gray-600 rounded-md transition-all duration-300 ease-in-out 
               hover:shadow-md hover:bg-blue-100 hover:text-blue-700 
               data-[state=active]:bg-[#335488] 
               data-[state=active]:text-white 
               data-[state=active]:shadow-lg
               disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="flex items-center justify-center gap-2">
              Campaign Info
              {campaignValid && (
                <CiCircleCheck
                  className="text-black-300 group-data-[state=active]:text-white transition-colors duration-200"
                  size={25}
                />
              )}
            </span>
            {/* Animated underline */}
            <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-white transition-all duration-300 group-data-[state=active]:w-full" />
          </TabsTrigger>

          <TabsTrigger
            value="keywords"
            disabled={!campaignValid}
            className="group relative flex-1 py-3 text-sm font-semibold text-gray-600 rounded-md transition-all duration-300 ease-in-out 
               hover:shadow-md hover:bg-blue-100 hover:text-blue-700 
               data-[state=active]:bg-[#335488] 
               data-[state=active]:text-white 
               data-[state=active]:shadow-lg
               disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="flex items-center justify-center gap-2">
              Live Keyword Tracking
            </span>
            {/* Animated underline */}
            <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-white transition-all duration-300 group-data-[state=active]:w-full" />
          </TabsTrigger>
        </TabsList>

        <TabsContent value="account">
          <div className="flex flex-col md:flex-row gap-4">
            <Card className="w-[40%]">
              <CardHeader>
                <CardTitle>Campaign Info</CardTitle>
                <CardDescription>
                  Provide details about your campaign.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <NewCustomInput
                            placeholder="Enter Campaign Name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="url"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <NewCustomInput
                            placeholder="Enter Domain URL"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </CardContent>
              <CardFooter>
                <CustomButton
                  buttonName="Continue to Keywords"
                  onClick={handleCampaignSubmit}
                />
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent className="flex flex-col gap-5" value="keywords">
          <div className="flex gap-5">
            <Card className="flex-1">
              <CardHeader>
                <CardTitle>Live Keyword Tracking</CardTitle>
                <CardDescription>Add keywords to track.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border p-2 rounded w-full max-w-xl">
                  <div className="flex flex-wrap gap-2">
                    {keywords.map((keyword, index) => (
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
                      onChange={(e) => settagsInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Type a keyword and press Enter"
                      className="flex-1 p-1 outline-none"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="flex-1 w-full md:w-1/2 p-4 space-y-4">
              <Controller
                name="keywordTag"
                control={form.control}
                render={({ field }) => (
                  <NewCustomInput
                    icon={<HiMiniTag className="text-blue-500" />}
                    placeholder="Add Keyword Tag"
                    {...field}
                  />
                )}
              />

              <div className="w-full gap-5 flex md:flex-nowrap flex-wrap   items-center">
                <Controller
                  name="searchLocation"
                  control={form.control}
                  render={({ field }) => (
                    <DropDownList
                      showArrow={false}
                      listData={location}
                      icon={
                        <MdOutlineLocationOn className="text-blue-500 text-xl" />
                      }
                      listName="Search Location"
                      value={field.value}
                      onChange={(selected) => field.onChange(selected?.value)}
                    />
                  )}
                />

                <Controller
                  name="volumeLocation"
                  control={form.control}
                  render={({ field }) => (
                    <DropDownList
                      showArrow={false}
                      listData={location}
                      icon={
                        <MdOutlineLocationOn className="text-blue-500 text-xl" />
                      }
                      listName="Volume Location"
                      value={field.value}
                      onChange={(selected) => field.onChange(selected?.value)}
                    />
                  )}
                />
              </div>

              <Controller
                name="SearchEngine"
                control={form.control}
                render={({ field }) => (
                  <DropDownList
                    listData={["US (google.com)", "NL (google.com)"]}
                    icon={<FcGoogle className=" text-xl" />}
                    listName="us (google.com)"
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
                    listData={language}
                    icon={
                      <LiaLanguageSolid className="text-blue-500 text-xl" />
                    }
                    listName="Language"
                    value={field.value}
                    onChange={(selected) => field.onChange(selected?.value)}
                  />
                )}
              />
              <div className="w-full gap-5 flex md:flex-nowrap flex-wrap   items-center">
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
            </Card>
          </div>
          <div className="w-full flex gap-4 items-end justify-end">
            <BlueButton
              transparent={true}
              buttonName="Previous"
              onClick={() => setActiveTab("account")}
            />
            <BlueButton onClick={onFinalSubmit} buttonName="Finish" />
          </div>
        </TabsContent>
      </Tabs>
    </Form>
  );
}

export default CampaignTabs;

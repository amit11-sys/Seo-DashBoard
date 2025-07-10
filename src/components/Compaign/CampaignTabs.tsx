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
import { string, z } from "zod";
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
import { createCampaign, getUserCampaign } from "@/actions/campaign";
import DropDownList from "@/components/DropDownList";
import { HiMiniTag } from "react-icons/hi2";
import { MdOutlineDevices, MdOutlineLocationOn } from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
import { LiaLanguageSolid, LiaSearchLocationSolid } from "react-icons/lia";
import axios from "axios";
import { NewCustomInput } from "../NewCustomInput";
import CustomButton from "@/components/ui/CustomButton";
import { useCampaignData } from "@/app/context/CampaignContext";
import { FaCircleCheck } from "react-icons/fa6";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
// import { getTrackingData } from "@/actions/keywordTracking";

type CampaignFormType = z.infer<typeof campaignSchema>;
interface LocationAndLanguageType {
  allLanguages: string[];
  allLocations: string[];
}

interface CampaignTabsProps {
  location_and_language: LocationAndLanguageType;
}

export function CampaignTabs({ location_and_language }: CampaignTabsProps) {
  const { startLoading, stopLoading } = useLoader();
  const router = useRouter();

  const form = useForm<CampaignFormType>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      name: "",
      url: "",
      keywordTag: "",
      keyword: [],
      SearchEngine: "",
      searchLocation: "",
      volumeLocation: "",
      language: "",
      serpType: "",
      deviceType: "",
    },
  });

  const [tagsInput, settagsInput] = useState("");
  const [Keywords, setKeywords] = useState<string[]>([]);
  const [campaignValid, setCampaignValid] = useState(false);
  const [activeTab, setActiveTab] = useState("account");
  const [language, setLanguage] = useState<string[]>([]);
  const [location, setLocation] = useState<string[]>([]);
  const { setCampaignData } = useCampaignData();
  const [keywordError, setKeywordError] = useState<string | null>(null);
  const [volumeLocationOptions, setVolumeLocationOptions] = useState<string[]>(
    []
  );

  const fetchCitiesByCountry = async (country: string) => {
    if (!country) {
      setVolumeLocationOptions([]);
      return;
    }
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_COUNTRIESNOW_URL}countries/cities`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ country }),
        }
      );

      const data = await res.json();
      // console.log();

      if (data) {
        // const stateData = data.data.states.map((state: any) => state?.name);
        setVolumeLocationOptions(data.data);
      } else {
        setVolumeLocationOptions([]);
        toast.error("No cities found for selected country.");
      }
    } catch (error) {
      console.error("Error fetching cities:", error);
      toast.error("Failed to fetch cities.");
    }
  };

  // const username = process.env.NEXT_PUBLIC_DATAFORSEO_USERNAME ?? "";
  // const password = process.env.NEXT_PUBLIC_DATAFORSEO_PASSWORD ?? "";

  useEffect(() => {
    setLanguage(location_and_language.allLanguages);
    setLocation(location_and_language.allLocations);
  }, []);

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
      settagsInput("");
    } else if (e.key === "Backspace" && !tagsInput && Keywords.length) {
      setKeywords((prev) => prev.slice(0, -1));
    }
  };

  const removeKeyword = (index: number) => {
    setKeywords((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCampaignSubmit = async () => {
    const values = form.getValues();
    console.log(values);

    const isValid = await form.trigger(["name", "url"]);

    // if (!isValid) {
    //   if (form.formState.errors.keyword) {
    //     toast.error(form.formState.errors.name.message || "Please provide Name.");
    //   }
    //   if (form.formState.errors.searchLocation) {
    //     toast.error(form.formState.errors.url.message || "Please select a url.");
    //   }

    //   return;
    // }

    if (!isValid) return;

    setCampaignValid(true);
    toast("Campaign Info validated!");
    setActiveTab("keywords");
  };
  const keywords = Keywords;
  // const onFinalSubmit = async () => {
  //   const values = form.getValues();
  //   const isValid = await form.trigger([
  //     "keyword",
  //     "searchLocation",
  //     "language",
  //   ]);

  //   if (!isValid) {
  //     return;
  //   }
  //   // if ( Keywords.length === 0) {
  //   //   toast("Please complete all fields.");
  //   //   return;
  //   // }
  //   // if (!values.name || !values.url || Keywords.length === 0 || !values.searchLocation || !values.language) {
  //   //   toast("Please complete all fields.");
  //   //   return;
  //   // }

  //   const payload = {
  //     ...values,
  //     keywords,
  //   };

  //   console.log(payload);

  //   startLoading();
  //   try {
  //     const response = await createCampaign(payload);
  //     // if(!response?.token_expired){
  //     //   // await userExpire()
  //     //   // Cookies.remove('accessToken');
  //     //   return;

  //     // }

  //     if (response?.success) {
  //       const campaign = await getUserCampaign();
  //       toast("Campaign created successfully");
  //       form.reset();
  //       setKeywords([]);
  //       setCampaignValid(false);

  //       setActiveTab("account");
  //       setCampaignData(campaign?.campaign || []);
  //     } else {
  //       toast(response?.error || "Failed to create campaign");
  //       console.log(response);
  //     }
  //   } catch (error) {
  //     toast("Something went wrong");
  //   } finally {
  //     stopLoading();
  //   }
  // };
  // console.log(form.formState.errors.searchLocation?.message)
  // console.log(form.formState.errors.language?.message)

  const onFinalSubmit = async () => {
    const values = form.getValues();
    const isValid = await form.trigger();

    if (keywords.length === 0) {
      setKeywordError("Please enter at least one keyword.");
      return;
    } else {
      setKeywordError(null);
    }
    if (!isValid) {
      return;
    }

    const payload = {
      ...values,
      keyword: Keywords,
    };

    console.log(payload);

    startLoading();
    try {
      const response = await createCampaign(payload);

      if (response?.success) {
        const campaign = await getUserCampaign();
        // console.log(campaign, "from on submit");
        const campaignId = response.campaign._id;

        router.push(`/dashboard/${campaignId}`);

        toast("Campaign created successfully");
        form.reset();
        setKeywords([]);
        setCampaignValid(false);
        setActiveTab("account");
        setCampaignData(campaign?.campaign || []);
      } else {
        toast(response?.error || "Failed to create campaign");
        console.log(response);
      }
    } catch (error) {
      toast("Something went wrong");
    } finally {
      stopLoading();
    }
  };

  // console.log(form.formState.errors.keyword?.message);

  // console.log(Keywords)
  return (
    <Form {...form}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* <AnimatedBackground /> */}
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
        <TabsList className="w-full  flex justify-center items-center gap-2 p-1 mt-32  rounded-lg relative overflow-hidden">
          <TabsTrigger
            value="account"
            className=" rounded-full group relative flex-1 p-3 text-sm font-semibold text-gray-600  transition-all duration-300 ease-in-out 
               hover:shadow-md hover:bg-blue-100 hover:text-blue-700 
               data-[state=active]:bg-[#273F4F] 
               data-[state=active]:text-white 
               data-[state=active]:shadow-lg
               disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="flex text-2xl items-center justify-center gap-2">
              Campaign Info
              {campaignValid && (
                <FaCircleCheck
                  className=" text-green-700 font-bold group-data-[state=active]:text-white transition-colors duration-200"
                  size={25}
                />
              )}
            </span>
            {/* Animated underline */}
            {/* <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-black mt-2 transition-all duration-300 group-data-[state=active]:w-full" /> */}
          </TabsTrigger>

          <TabsTrigger
            value="keywords"
            disabled={!campaignValid}
            className=" rounded-full group relative flex-1 p-3 text-sm font-semibold text-gray-600  transition-all duration-300 ease-in-out 
               hover:shadow-md hover:bg-blue-100 hover:text-blue-700 
               data-[state=active]:bg-[#273F4F] 
               data-[state=active]:text-white 
               data-[state=active]:shadow-lg
               disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="flex items-center text-2xl  justify-center gap-2">
              Live Keyword Tracking
            </span>
            {/* Animated underline */}
            {/* <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-black transition-all duration-300 group-data-[state=active]:w-full" /> */}
          </TabsTrigger>
        </TabsList>

        <TabsContent
          className=" pt-10 flex justify-center items-center"
          value="account"
        >
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 80,
              damping: 15,
              duration: 0.6,
            }}
            className=" w-[60%] flex justify-center items-center gap-4"
          >
            <Card className="w-[50%] drop-shadow-lg border-slate-300 min-h-52 border text-black     shadow-xl">
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
                            errorMessage={form.formState.errors.name?.message}
                          />
                        </FormControl>
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
                            errorMessage={form.formState.errors.url?.message}
                          />
                        </FormControl>
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
          </motion.div>
        </TabsContent>

        <TabsContent className="flex flex-col gap-5" value="keywords">
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 80,
              damping: 15,
              duration: 0.6,
            }}
            className="flex w-[70%] mx-auto gap-5"
          >
            <Card className="flex-1 drop-shadow-lg border-slate-300">
              <CardHeader>
                <CardTitle>Live Keyword Tracking</CardTitle>
                <CardDescription>Add keywords to track.</CardDescription>
              </CardHeader>
              <CardContent>
                {/* <div className=" multipleKeyword border  p-2 rounded w-full max-w-xl">
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
                      onChange={(e) => settagsInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Type a keyword and press Enter"
                      className="flex-1 bg-transparent p-1 outline-none"
                      
                    />
                  
                  </div>
                </div>
                <p className="text-red-500 text-sm ml/-3">
                  {form.formState.errors.keyword?.message}
                </p> */}

                <div
                  className={`multipleKeyword border ${keywordError && "border-red-400"}  p-2 rounded w-full max-w-xl`}
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
                      onChange={(e) => settagsInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Type a keyword and press Enter"
                      className="flex-1 bg-transparent p-1 outline-none"
                    />
                  </div>
                </div>
                {keywordError && (
                  <p className="text-red-500 text-sm mt-1">{keywordError}</p>
                )}

                {/* <p className="text-red-500 text-sm ml-3">error</p> */}
              </CardContent>
            </Card>
            <Card className="flex-1  drop-shadow-lg border-slate-300 w-full md:w-1/2 p-4 space-y-4">
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

              <div className="w-full gap-1 flex flex-col md:flex-nowrap flex-wrap ">
                <div className="flex w-full gap-6">
                  <div className="flex-1  flex flex-col justify-start items-start">
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
                          onChange={async (selected) => {
                            field.onChange(selected?.value);

                            if (selected?.value) {
                              await fetchCitiesByCountry(selected.value);
                            }
                          }}
                          className={`${form.formState.errors.searchLocation?.message && "border-red-500 animate-shake "}`}

                          // errorMessage={
                          //   form.formState.errors.searchLocation?.message
                          // }
                        />
                      )}
                    />
                  </div>

                  <div className="flex-1 flex justify-start items-start">
                    <Controller
                      name="volumeLocation"
                      control={form.control}
                      render={({ field }) => (
                        <DropDownList
                          showArrow={false}
                          listData={volumeLocationOptions}
                          icon={
                            <MdOutlineLocationOn className="text-blue-500 text-xl" />
                          }
                          listName="Volume Location"
                          value={field.value}
                          onChange={(selected) =>
                            field.onChange(selected?.value)
                          }
                          errorMessage={
                            form.formState.errors.volumeLocation?.message
                          }
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="w-full text-sm text-red-500">
                  {form.formState.errors.searchLocation?.message}
                </div>
              </div>

              {/* ----- */}
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
                    errorMessage={form.formState.errors.language?.message}
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
          </motion.div>
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

"use client";

import { useState, useEffect, useTransition, useMemo } from "react";
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
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { campaignSchema } from "@/lib/zod";
import { useLoader } from "@/hooks/useLoader";
import { toast } from "sonner";
import { createCampaign, getUserCampaign } from "@/actions/campaign";
import DropDownList from "@/components/DropDownList";
import { HiMiniTag } from "react-icons/hi2";
import { MdOutlineDevices, MdOutlineLocationOn } from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
import { LiaLanguageSolid, LiaSearchLocationSolid } from "react-icons/lia";
import { NewCustomInput } from "../NewCustomInput";
import CustomButton from "@/components/ui/CustomButton";
import { useCampaignData } from "@/app/context/CampaignContext";
import { FaCircleCheck } from "react-icons/fa6";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import KeywordTextArea from "../KeywordTextArea";
import debounce from "lodash.debounce";

import { OptionType } from "@/components/AutocompleteInput";
import {
  getfetchDBLocation,
  getlanguageData,
} from "@/actions/locations_Language";

type CampaignFormType = z.infer<typeof campaignSchema>;
interface LocationAndLanguageType {
  allLanguages: any;
  allLocations: any;
}

interface CampaignTabsProps {
  location_and_language: LocationAndLanguageType;
}

export function CampaignTabs() {
  const { startLoading, stopLoading } = useLoader();
  const router = useRouter();
  const [languages, setLanguages] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [volumnQuery, setVolumnQuery] = useState("");
  const [results, setResults] = useState<any>([]);
  const [VolumeLocation, setVolumeLocation] = useState<any>([]);
  const [isPending, startTransition] = useTransition();
  const [isPendingvolumndata, startTransitionVolumndata] = useTransition();

  // ✅ Memoize debounced function so it survives re-renders
  const debouncedFetch = useMemo(() => {
    return debounce((q: string) => {
      startTransition(() => {
        getfetchDBLocation(q).then(setResults).catch(console.error);
      });
    }, 300);
  }, []);

  useEffect(() => {
    if (query.trim().length > 1) debouncedFetch(query);
    return () => {
      debouncedFetch.cancel();
    };
  }, [query, debouncedFetch]);
  const debouncedFetchvolumn = useMemo(() => {
    return debounce((q: string) => {
      startTransitionVolumndata(() => {
        getfetchDBLocation(q).then(setVolumeLocation).catch(console.error);
      });
    }, 300);
  }, []);

  useEffect(() => {
    if (volumnQuery.trim().length > 1) debouncedFetchvolumn(volumnQuery);
    return () => {
      debouncedFetchvolumn.cancel();
    };
  }, [volumnQuery, debouncedFetchvolumn]);
  useEffect(() => {
    const fetchlanguage = async () => {
      try {
        const data = await getlanguageData();

        const langdata = data?.allLanguages;
        setLanguages(langdata ?? []);
      } catch (error) {
        console.log(error, "language error");
      }
    };
    fetchlanguage();
  }, []);
  // console.log("Results:", results, "Query:", query);
  const form = useForm<CampaignFormType>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      name: "",
      url: "",
      keywordTag: "",
      keyword: [],
      SearchEngine: "",
      searchLocationCode: 0,
      volumeLocationCode: 0,
      language: "",
      serpType: "",
      deviceType: "",
    },
  });
  // console.log(location_and_language,"luange and locations")
  const [Keywords, setKeywords] = useState<string[]>([]);
  const [KeywordsText, setKeywordsText] = useState<any>("");
  const [campaignValid, setCampaignValid] = useState(false);
  const [activeTab, setActiveTab] = useState("account");
  const { setCampaignData } = useCampaignData();
  const [keywordError, setKeywordError] = useState<string | null>(null);

  const handleCampaignSubmit = async () => {
    const values = form.getValues();
    console.log(values);

    const isValid = await form.trigger(["name", "url"]);
    if (!isValid) return;

    setCampaignValid(true);
    toast("Campaign Info validated!");
    setActiveTab("keywords");
  };
  // const keywords = Keywords;

  const onFinalSubmit = async () => {
    const values = form.getValues();
    const isValid = await form.trigger();

    if (Keywords?.length === 0) {
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
      // searchLocationCode:
    };

    // console.log(payload, "pyaload of caompgin form");

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
  const handleKeywordChange = (keywords: string[], rawText: string) => {
    setKeywordsText(rawText);
    setKeywords(keywords);
  };
  const googleDomains: string[] = [
    "google.com",
    "google.com.au",
    "google.co.uk",
    "google.ca",
    "google.co.in",
    "google.de",
    "google.fr",
    "google.it",
    "google.es",
    "google.com.br",
    "google.com.mx",
    "google.co.jp",
    "google.com.hk",
    "google.cn",
    "google.ru",
    "google.com.tr",
    "google.com.sa",
    "google.co.za",
    "google.nl",
    "google.be",
    "google.se",
    "google.no",
    "google.dk",
    "google.fi",
    "google.ch",
    "google.at",
    "google.pl",
    "google.cz",
    "google.hu",
    "google.gr",
    "google.pt",
    "google.ie",
    "google.co.kr",
    "google.com.sg",
    "google.co.id",
    "google.com.my",
    "google.co.th",
    "google.com.vn",
    "google.com.ph",
    "google.ae",
    "google.com.eg",
    "google.com.ar",
    "google.cl",
    "google.com.co",
    "google.com.pe",
    "google.com.uy",
    "google.com.ve",
    "google.com.ng",
    "google.com.gh",
    "google.com.pk",
    "google.com.bd",
    "google.lk",
    "google.com.np",
    "google.co.il",
    "google.com.qa",
    "google.com.kw",
    "google.com.om",
    "google.kz",
    "google.com.tw",
    "google.com.ua",
    "google.co.nz",
    "google.com.lb",
    "google.com.mt",
    "google.is",
    "google.li",
    "google.ee",
    "google.lv",
    "google.lt",
    "google.hr",
    "google.rs",
    "google.ba",
    "google.mk",
    "google.al",
    "google.ge",
    "google.am",
    "google.com.cy",
    "google.md",
    "google.by",
    "google.mn",
    "google.com.kh",
    "google.la",
    "google.com.mm",
    "google.com.bn",
    "google.com.fj",
    "google.vu",
    "google.fm",
    "google.ws",
    "google.to",
    "google.as",
    "google.co.ck",
    "google.com.sb",
  ];

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
          className=" pt-10 flex flex-col justify-center items-center"
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
          {/* <GoogleSignIn/> */}
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
                <KeywordTextArea
                  value={KeywordsText}
                  onChange={handleKeywordChange}
                  placeholder="Enter keywords separated by comma or new line"
                />

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
                    <div className="relative">
                      <Controller
                        name="searchLocationCode"
                        control={form.control}
                        render={({ field }) => (
                          <input
                            {...field}
                            value={query}
                            onChange={(e) => {
                              setQuery(e.target.value);
                              field.onChange(e.target.value); // Update form state
                            }}
                            className=" w-full flex items-center bg-transparent rounded-full gap-3 border border-input  px-3 py-3 shadow-sm "
                            placeholder="Search for location"
                          />
                        )}
                      />

                      {results.length > 0 && (
                        <ul className="absolute mt-2 bg-white border border-gray-300 overflow-y-scroll z-10 w-full h-40">
                          {isPending && (
                            <p className="text-green-500">Loading...</p>
                          )}
                          {results.map((loc: any) => {
                            console.log("Location:", loc);
                            return (
                              <li
                                key={loc._id}
                                onClick={() => {
                                  form.setValue(
                                    "searchLocationCode",
                                    loc.locationCode
                                  );
                                  setQuery(loc.locationName); // Update input with selected location
                                  setResults([]); // Clear results after selection
                                }}
                                className="cursor-pointer hover:bg-gray-100 border border-gray-200 p-2"
                              >
                                {loc.locationName}
                              </li>
                            );
                          })}
                        </ul>
                      )}
                      <div className="w-full text-sm text-red-500">
                        {form.formState.errors.searchLocationCode?.message}
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 flex justify-start items-start">
                    <div className="relative">
                      <Controller
                        name="volumeLocationCode"
                        control={form.control}
                        render={({ field }) => (
                          <input
                            {...field}
                            value={volumnQuery}
                            onChange={(e) => {
                              setVolumnQuery(e.target.value);
                              field.onChange(e.target.value);
                            }}
                            className="w-full flex items-center bg-transparent rounded-full gap-3 border border-input  px-3 py-3 shadow-sm"
                            placeholder="Search for Volume location"
                          />
                        )}
                      />
                      <div className="w-full text-sm text-red-500">
                        {form.formState.errors.volumeLocationCode?.message}
                      </div>

                      {VolumeLocation.length > 0 && (
                        <ul className="absolute mt-2 bg-white border border-gray-300 z-10 overflow-y-scroll  w-full h-40">
                          {isPendingvolumndata && (
                            <p className="text-green-500">Loading...</p>
                          )}
                          {VolumeLocation.map((loc: any) => (
                            <li
                              key={loc._id}
                              onClick={() => {
                                form.setValue(
                                  "volumeLocationCode",
                                  loc.locationCode
                                );
                                setVolumnQuery(loc.locationName);
                                setVolumeLocation([]);
                              }}
                              className="cursor-pointer hover:bg-gray-100 p-2"
                            >
                              {loc.locationName}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* ----- */}
              <Controller
                name="SearchEngine"
                control={form.control}
                render={({ field }) => (
                  <DropDownList
                    listData={googleDomains}
                    icon={<FcGoogle className=" text-xl" />}
                    listName="us (google.com)"
                    value={field.value}
                    onChange={(selected: any) =>
                      field.onChange(selected?.value)
                    }
                  />
                )}
              />
              <div className="w-full text-sm text-red-500">
                {form.formState.errors.SearchEngine?.message}
              </div>
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
                    onChange={(selected: any) =>
                      field.onChange(selected?.value)
                    }
                    errorMessage={form.formState.errors.language?.message}
                  />
                )}
              />
              <div className="w-full gap-5 flex md:flex-nowrap flex-wrap   items-center">
                <div className="flex-1">
                  <Controller
                    name="serpType"
                    control={form.control}
                    render={({ field }) => (
                      <DropDownList
                        listData={["organic + local", "organic", "Local"]}
                        icon={
                          <LiaSearchLocationSolid className="text-blue-500 text-xl" />
                        }
                        listName="SERP Type"
                        value={field.value}
                        onChange={(selected: any) =>
                          field.onChange(selected?.value)
                        }
                      />
                    )}
                  />
                </div>
                <div className="flex-1">
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
                        onChange={(selected: any) =>
                          field.onChange(selected?.value)
                        }
                      />
                    )}
                  />
                  <div className="w-full text-sm text-red-500">
                    {form.formState.errors.deviceType?.message}
                  </div>
                </div>
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

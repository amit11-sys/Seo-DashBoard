"use client";

import React, { useEffect, useMemo, useState, useTransition } from "react";
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
import {
  getDbLiveKeywordData,
  getDbLiveKeywordDataWithSatusCode,
  getEditDataFetchDb,
  getfetchDBlocationData,
  getTrackingData,
} from "@/actions/keywordTracking";
import debounce from "lodash.debounce";
import {
  getfetchDBLocation,
  getlanguageData,
} from "@/actions/locations_Language";
import { useLoader } from "@/hooks/useLoader";
import { getGetCampaignByid } from "@/actions/campaign";
// import {editKeywordsSchema} from "@/lib/zod"

// const editKeywordsSchema = z.object({
//   url: z.string().url("Invalid URL"),
//   keywordTag: z.string().optional(),
//   searchLocationCode: z.number().min(1, "Location is required"),
//   volumeLocationCode: z.number().min(1, "Location is required"),
//   language: z.string().min(1, "Language is required"),
//   SearchEngine: z.string().min(1, "Search engine is required"),
//   serpType: z.string().optional(),
//   deviceType: z.string().min(1, "Device type is required"),
//   keywords: z.string().min(1, "Enter at least one keyword"),
// });
const editKeywordsSchema = z.object({
  url: z.string().url({ message: "Please enter a valid URL" }),
  searchLocationCode: z
    .number()
    .min(1, { message: "Search Location is required" }),
  keywordTag: z.string().optional(),
  SearchEngine: z.string().optional(),
  // keywords: z.array( z.string().min(1, { message: "Please provide at least one keyword" })),
  keywords: z
    .string()
    .min(1, { message: "Please provide at least one keyword" }),
  volumeLocationCode: z.number().optional(),
  language: z.string().min(1, { message: "Language is required" }),
  serpType: z.string().optional(),
  deviceType: z.string().min(1, { message: "DeviceType is required" }),
});

interface EditKeywordsProps {
  campaignId: string;
  defaultData?: any; // for editing existing values
  keywordId: string;
  showAddedKeyword: any;
  setTableBody: any;
  addEditkeywordsData: any;
  CardSetOnChanges?: any;
}

const EditKeywords = ({
  campaignId,
  defaultData,
  CardSetOnChanges,
  keywordId,
  addEditkeywordsData,
  showAddedKeyword,
  setTableBody, // Optional: if you want to update the table body after editing
}: EditKeywordsProps) => {
  const { startLoading, stopLoading } = useLoader();
  const form = useForm<z.infer<typeof editKeywordsSchema>>({
    resolver: zodResolver(editKeywordsSchema),
    defaultValues: {
      url: "",
      searchLocationCode: 0,
      keywordTag: "",
      SearchEngine: "",
      keywords: "",
      volumeLocationCode: 0,
      language: "",
      serpType: "",
      deviceType: "",
    },
  });
  // console.log(defaultData, "defaultttt");

  const searchLoc = form.watch("searchLocationCode");

  const [tagsInput, setTagsInput] = useState("");
  const [keywords, setKeywords] = useState<string>("");
  const [keywordError, setKeywordError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [volumnQuery, setVolumnQuery] = useState("");
  const [results, setResults] = useState<any>([]);
  const [VolumeLocation, setVolumeLocation] = useState<any>([]);
  const [isPending, startTransition] = useTransition();
  const [isPendingvolumndata, startTransitionVolumndata] = useTransition();
  const [languages, setLanguages] = useState<string[]>([]);
  // ✅ Memoize debounced function so it survives re-renders
  const debouncedFetch = useMemo(() => {
    return debounce((q: string) => {
      startTransition(() => {
        getfetchDBLocation(q).then((response) => {
            console.log(response, "response");
            if (response?.error === "Unauthorized please login") {
              window.dispatchEvent(new Event("session-expired"));
              return;
            }
            setResults(response?.allLocations);
          }).catch(console.error);
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
        getfetchDBLocation(q).then((response) => {
            
            if (response?.error === "Unauthorized please login") {
              window.dispatchEvent(new Event("session-expired"));
              return;
            }
            setVolumeLocation(response?.allLocations);
          }).catch(console.error);
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
  }, [open]);

  useEffect(() => {
    if (defaultData) {
      form.reset({
        url: defaultData?.url || "",
        keywordTag: defaultData?.keywordTag || "",
        searchLocationCode: defaultData?.searchLocationCode || 0,
        volumeLocationCode: defaultData?.volumeLocationCode || 0,
        language: defaultData?.language || "",
        SearchEngine: defaultData?.SearchEngine || "",
        serpType: defaultData?.serpType || "",
        deviceType: defaultData?.deviceType || "",
        keywords: defaultData?.keywords || "",
      });

      // Set query input display names for selected locations
      if (defaultData?.searchLocationName) {
        setQuery(defaultData.searchLocationName);
      }

      if (defaultData?.volumeLocationName) {
        setVolumnQuery(defaultData.volumeLocationName);
      }
    }
  }, [defaultData, form]);

  // const editclick = async () => {

  // };

  // const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  //   if (
  //     (e.key === "Enter" || e.key === "," || e.key === " ") &&
  //     tagsInput.trim()
  //   ) {
  //     e.preventDefault();
  //     const trimmed = tagsInput.trim();
  //     if (!keywords.includes(trimmed)) {
  //       setKeywords((prev) => [...prev, trimmed]);
  //     }
  //     setTagsInput("");
  //   } else if (e.key === "Backspace" && !tagsInput && keywords.length) {
  //     setKeywords((prev) => prev.slice(0, -1));
  //   }
  // };

  // const removeKeyword = (index: number) => {
  //   setKeywords((prev) => prev.filter((_, i) => i !== index));
  // };

  const onSubmit = async () => {
     const isValid = await form.trigger();
        // form.setValue("keywords", Keywords);
    console.log(form.getValues(),"all value");
    
        if (!isValid){
          toast.error("Please fill all the fields")
          return
        }
    const keywordInput = form.getValues("keywords");
    console.log("okokoko", form.getValues());
    console.log("keywodsINput", keywordInput);
    if (!keywordInput || keywordInput[0].trim() === "") {
      setKeywordError("Please enter at least one keyword.");
      return;
    } else {
      setKeywordError(null);
    }

    if (!keywordInput) return;

    const payload = {
      ...form.getValues(),

      campaignId,
      keywordId,
    };

    console.log(payload, "edit");

    startLoading();
    try {
      const Response = await createUpdateKeywordById(payload);
      const campaignDataWithId = await getGetCampaignByid(campaignId);
      const campaignStatus = campaignDataWithId?.campaign?.status ?? 1;

      const liveKeywordData: any = await getDbLiveKeywordDataWithSatusCode(
        campaignId,
        campaignStatus
      );

               const topRankData = liveKeywordData?.topRankData?.data ?? [];

      console.log(liveKeywordData, "campaignLiveKeywordsData");

      let data: any = [];
      if (liveKeywordData?.newLiveKeywordDbData) {
        data = liveKeywordData?.newLiveKeywordDbData.map((item: any) => ({
          // select: false,
          type: item?.type || "",
          keywordId: item?.keywordId || "",
          keyword: item?.keyword || "",
          location: item?.location_name?.locationName?.locationName || "",
          intent: item?.intent || "",
          start: item?.start || 0,
          page: Math.ceil(item?.rank_absolute / 10).toString() || 0,
          Absolute_Rank: String(item?.rank_absolute) || 0,
          Group_Rank: item?.rank_group || 0,
          // oneDay: "1",
          sevenDays: "-",
          // thirtyDays: "-",
          life: item?.rank_group || 0,
          comp: item?.competition || 0,
          sv: item?.searchVolumn || 0,
          date: new Date(item?.createdAt).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "2-digit",
          }),
          rankingUrl: item.url || "",
          // rankingUrl: new URL(item.url) || "/",
        }));
      }
      console.log(data, "data after delete");
      if (setTableBody) {
        setTableBody(data);
      }
      if (topRankData) {
        CardSetOnChanges(topRankData);
      }
      if (!Response) throw new Error("Update failed");
      // console.log(Response.tracking,"tracking");

      // await addEditkeywordsData(Response.tracking);

      await showAddedKeyword(Response.tracking);

      toast.success("Keywords updated successfully");
      form.reset({
        url: "",
        keywordTag: "",
        searchLocationCode: 0,
        language: "",
        SearchEngine: "",
        serpType: "",
        deviceType: "",
        volumeLocationCode: 0,
        keywords: "",
      });
      stopLoading();

      setOpen(false);
      // Optional: form.reset(); or refresh logic
    } catch (error) {
      console.error("Edit Error:", error);
      toast.error("Failed to update keywords");
    }
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
  const onEdithandler = async (keywordId: string) => {
    const defaultData = await getEditDataFetchDb(keywordId);
    console.log(defaultData, "data default");
    const locationCode = Number(defaultData.keywordsData.searchLocationCode);
    console.log(locationCode, "location code");
    const matchlocation = await getfetchDBlocationData(locationCode);
    console.log(matchlocation, "match locations");

    const modifiedKeywords = [defaultData?.keywordsData].map((item: {}) => ({
      ...item,
      location_name: matchlocation?.locationName?.locationName,
    }));

    addEditkeywordsData(modifiedKeywords);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          onClick={() => {
            onEdithandler(keywordId);
          }}
        >
          <HiOutlineKey className="text-xl text-blue-600 cursor-pointer" />
        </button>
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
              {/* <Controller
                  name="searchLocationCode"
                  control={form.control}
                  render={({ field }) => (
                    <DropDownList
                      listData={countries}
                      icon={
                        <MdOutlineLocationOn className="text-blue-500 text-xl" />
                      }
                      listName="Search Location"
                      value={field.value}
                      onChange={(selected:any) => field.onChange(selected?.value)}
                      errorMessage={
                        form.formState.errors.searchLocationCode?.message
                      }
                    />
                  )}
                /> */}
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
                        field.onChange(e.target.value || 0); // Update form state
                      }}
                      className=" w-full flex items-center bg-transparent rounded-full gap-3 border border-input  px-3 py-3 shadow-sm "
                      placeholder="Search for location"
                    />
                  )}
                />

                {results.length > 0 && (
                  <ul className="absolute mt-2 bg-white border border-gray-300 overflow-y-scroll z-10 w-full h-40">
                    {isPending && <p className="text-green-500">Loading...</p>}
                    {results.map((loc: any) => {
                      console.log("Location:", loc);
                      return (
                        <li
                          key={loc._id}
                          onClick={() => {
                            form.setValue(
                              "searchLocationCode",
                              loc.locationCode || 0
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
              {/* <Controller
                  name="volumeLocationCode"
                  control={form.control}
                  render={({ field }) => (
                    <DropDownList
                      listData={countries}
                      icon={
                        <MdOutlineLocationOn className="text-blue-500 text-xl" />
                      }
                      listName="Volume Location"
                      value={field.value}
                      onChange={(selected: any) =>
                        field.onChange(selected?.value)
                      }
                    />
                  )}
                /> */}
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
                        field.onChange(e.target.value || 0);
                      }}
                      className="w-full flex items-center bg-transparent rounded-full gap-3 border border-input  px-3 py-3 shadow-sm"
                      placeholder="Search for Volume location"
                    />
                  )}
                />
                <div className="w-full text-sm text-red-500">
                  {form.formState.errors.volumeLocationCode?.message && "required" }
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
                          form.setValue("volumeLocationCode", loc.locationCode  || 0);
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
                    listData={googleDomains}
                    icon={<FcGoogle className="text-xl" />}
                    listName="Search Engine"
                    value={field.value}
                    onChange={(selected: any) =>
                      field.onChange(selected?.value)
                    }
                  />
                )}
              />
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

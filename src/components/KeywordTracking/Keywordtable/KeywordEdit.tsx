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
  getTrackingData,
} from "@/actions/keywordTracking";
import debounce from "lodash.debounce";
import { getfetchDBLocation, getlanguageData } from "@/actions/locations_Language";
import { useLoader } from "@/hooks/useLoader";

const editKeywordsSchema = z.object({
  url: z.string().url("Invalid URL"),
  keywordTag: z.string().optional(),
  searchLocationCode: z.number().min(1, "Location is required"),
  volumeLocationCode: z.number().min(1, "Location is required"),
  language: z.string().min(1, "Language is required"),
  SearchEngine: z.string().min(1, "Search engine is required"),
  serpType: z.string().optional(),
  deviceType: z.string().min(1, "Device type is required"),
  keywords: z.string().min(1, "Enter at least one keyword"),
});

interface EditKeywordsProps {
  campaignId: string;
  defaultData?: any; // for editing existing values
  keywordId: string;
  showAddedKeyword: any;
  setTableBody: any;
}

const EditKeywords = ({
  campaignId,
  defaultData,
  keywordId,
  showAddedKeyword,
  setTableBody, // Optional: if you want to update the table body after editing
}: EditKeywordsProps) => {
    const { startLoading, stopLoading } = useLoader();
  const form = useForm<z.infer<typeof editKeywordsSchema>>({
    resolver: zodResolver(editKeywordsSchema),
  });
  console.log(defaultData, "defaultttt");
  const [tagsInput, setTagsInput] = useState("");
  const [keywords, setKeywords] = useState<string[]>(
    defaultData?.keywords || ""
  );
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
useEffect(()=>{
const fetchlanguage = async  ()=>{

  try {

    const data = await getlanguageData()
    const langdata = data?.allLanguages
    setLanguages(langdata ?? []);
    
  } catch (error) {
    console.log(error,"language error")
    
  }
}
fetchlanguage()

},[])
  useEffect(() => {
    form.reset({
      url: defaultData?.url || "",
      keywordTag: defaultData?.keywordTag || "",
      searchLocationCode: defaultData?.searchLocationCode || "",
      volumeLocationCode: defaultData?.volumeLocationCode || "",
      language: defaultData?.language || "",
      SearchEngine: defaultData?.SearchEngine || "",
      serpType: defaultData?.serpType || "",
      deviceType: defaultData?.deviceType || "",
      keywords: defaultData?.keywords || "",
    });
  }, [defaultData]);

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
    startLoading()
    try {
      const Response = await createUpdateKeywordById(payload);
      const campaignLiveKeywordsData = await getDbLiveKeywordData(campaignId);
      let data: any = [];
      if (campaignLiveKeywordsData.newLiveKeywordDbData) {
        data = campaignLiveKeywordsData.newLiveKeywordDbData.map((item: any) => {
            console.log(item?.location_name?.locationName,"newLiveKeywordDbData inside new location name")
        return  ({
          
           // select: false,
           status: item.status,
           keywordId: item.keywordId,
           keyword: item.keyword,
           location: item?.location_name?.locationName?.locationName,
           intent: item.intent || "",
           start: String(item.start),
           page: Math.ceil(item.rank_absolute / 10).toString(),
           Absolute_Rank: String(item.rank_absolute),
           Group_Rank: String(item.rank_group),
           // oneDay: "1",
           sevenDays: "-",
           // thirtyDays: "-",
           life: String(item.rank_group),
           comp: item.competition || "0",
           sv: item.searchVolumn || "0",
           date: new Date(item.createdAt).toLocaleDateString("en-GB", {
             day: "2-digit",
             month: "short",
             year: "2-digit",
           }),
           rankingUrl: item.url,
           // rankingUrl: new URL(item.url) || "/",
         })

        }
      
      );
      }
      setTableBody(data);
      if (!Response) throw new Error("Update failed");
      console.log(Response.tracking,"tracking");
        await showAddedKeyword(
       Response.tracking
      );
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
       stopLoading()

      setOpen(false);
      // Optional: form.reset(); or refresh logic
    } catch (error) {
      console.error("Edit Error:", error);
      toast.error("Failed to update keywords");
    }
  };
 
  const countries = [
    { locationName: "Albania", locationCode: 2008 },
    { locationName: "Algeria", locationCode: 2012 },
    { locationName: "Angola", locationCode: 2024 },
    { locationName: "Azerbaijan", locationCode: 2031 },
    { locationName: "Argentina", locationCode: 2032 },
    { locationName: "Australia", locationCode: 2036 },
    { locationName: "Austria", locationCode: 2040 },
    { locationName: "Bahrain", locationCode: 2048 },
    { locationName: "Bangladesh", locationCode: 2050 },
    { locationName: "Armenia", locationCode: 2051 },
    { locationName: "Belgium", locationCode: 2056 },
    { locationName: "Bolivia", locationCode: 2068 },
    { locationName: "Bosnia and herzegovina", locationCode: 2070 },
    { locationName: "Brazil", locationCode: 2076 },
    { locationName: "Bulgaria", locationCode: 2100 },
    { locationName: "Myanmar (burma)", locationCode: 2104 },
    { locationName: "Cambodia", locationCode: 2116 },
    { locationName: "Cameroon", locationCode: 2120 },
    { locationName: "Canada", locationCode: 2124 },
    { locationName: "Sri lanka", locationCode: 2144 },
    { locationName: "Chile", locationCode: 2152 },
    { locationName: "Taiwan", locationCode: 2158 },
    { locationName: "Colombia", locationCode: 2170 },
    { locationName: "Costa rica", locationCode: 2188 },
    { locationName: "Croatia", locationCode: 2191 },
    { locationName: "Cyprus", locationCode: 2196 },
    { locationName: "Czechia", locationCode: 2203 },
    { locationName: "Denmark", locationCode: 2208 },
    { locationName: "Ecuador", locationCode: 2218 },
    { locationName: "El salvador", locationCode: 2222 },
    { locationName: "Estonia", locationCode: 2233 },
    { locationName: "Finland", locationCode: 2246 },
    { locationName: "France", locationCode: 2250 },
    { locationName: "Germany", locationCode: 2276 },
    { locationName: "Ghana", locationCode: 2288 },
    { locationName: "Greece", locationCode: 2300 },
    { locationName: "Guatemala", locationCode: 2320 },
    { locationName: "Hong kong", locationCode: 2344 },
    { locationName: "Hungary", locationCode: 2348 },
    { locationName: "India", locationCode: 2356 },
    { locationName: "Indonesia", locationCode: 2360 },
    { locationName: "Ireland", locationCode: 2372 },
    { locationName: "Israel", locationCode: 2376 },
    { locationName: "Italy", locationCode: 2380 },
    { locationName: "Cote d'ivoire", locationCode: 2384 },
    { locationName: "Japan", locationCode: 2392 },
    { locationName: "Kazakhstan", locationCode: 2398 },
    { locationName: "Jordan", locationCode: 2400 },
    { locationName: "Kenya", locationCode: 2404 },
    { locationName: "South korea", locationCode: 2410 },
    { locationName: "Latvia", locationCode: 2428 },
    { locationName: "Lithuania", locationCode: 2440 },
    { locationName: "Malaysia", locationCode: 2458 },
    { locationName: "Malta", locationCode: 2470 },
    { locationName: "Mexico", locationCode: 2484 },
    { locationName: "Monaco", locationCode: 2492 },
    { locationName: "Moldova", locationCode: 2498 },
    { locationName: "Morocco", locationCode: 2504 },
    { locationName: "Netherlands", locationCode: 2528 },
    { locationName: "New zealand", locationCode: 2554 },
    { locationName: "Nicaragua", locationCode: 2558 },
    { locationName: "Nigeria", locationCode: 2566 },
    { locationName: "Norway", locationCode: 2578 },
    { locationName: "Pakistan", locationCode: 2586 },
    { locationName: "Panama", locationCode: 2591 },
    { locationName: "Paraguay", locationCode: 2600 },
    { locationName: "Peru", locationCode: 2604 },
    { locationName: "Philippines", locationCode: 2608 },
    { locationName: "Poland", locationCode: 2616 },
    { locationName: "Portugal", locationCode: 2620 },
    { locationName: "Romania", locationCode: 2642 },
    { locationName: "Saudi arabia", locationCode: 2682 },
    { locationName: "Senegal", locationCode: 2686 },
    { locationName: "Serbia", locationCode: 2688 },
    { locationName: "Singapore", locationCode: 2702 },
    { locationName: "Slovakia", locationCode: 2703 },
    { locationName: "Vietnam", locationCode: 2704 },
    { locationName: "Slovenia", locationCode: 2705 },
    { locationName: "South africa", locationCode: 2710 },
    { locationName: "Spain", locationCode: 2724 },
    { locationName: "Sweden", locationCode: 2752 },
    { locationName: "Switzerland", locationCode: 2756 },
    { locationName: "Thailand", locationCode: 2764 },
    { locationName: "United arab emirates", locationCode: 2784 },
    { locationName: "Tunisia", locationCode: 2788 },
    { locationName: "Turkiye", locationCode: 2792 },
    { locationName: "Ukraine", locationCode: 2804 },
    { locationName: "North macedonia", locationCode: 2807 },
    { locationName: "Egypt", locationCode: 2818 },
    { locationName: "United kingdom", locationCode: 2826 },
    { locationName: "United states", locationCode: 2840 },
    { locationName: "Burkina faso", locationCode: 2854 },
    { locationName: "Uruguay", locationCode: 2858 },
    { locationName: "Venezuela", locationCode: 2862 },
  ];
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
                        field.onChange(e.target.value); // Update form state
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
                          form.setValue("volumeLocationCode", loc.locationCode);
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

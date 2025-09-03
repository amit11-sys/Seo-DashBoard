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
import KeywordTextArea from "@/components/KeywordTextArea";
import debounce from "lodash.debounce";
import {
  getfetchDBLocation,
  getlanguageData,
} from "@/actions/locations_Language";
import { useLoader } from "@/hooks/useLoader";
import { getfetchDBlocationData } from "@/actions/keywordTracking";
import { GetCampaignByid } from "@/actions/campaign/queries";
// import { getDbLiveKeywordData } from "@/actions/keywordTracking";

// const schema = z.object({
//   name: z.string().min(1, "Campaign name is required"),
//   keywordTag: z.string().optional(),
//   searchLocationC: z.string().min(1, "Location is required"),
//   language: z.string().min(1, "Language is required"),
//   SearchEngine: z.string().optional(),
//   serpType: z.string().optional(),
//   deviceType: z.string().optional(),
// });
interface DialogFormProps {
  campaignId: string;
  // showAddedKeyword: (keywords: string[]) => void;
  // updatedTopRankOnAddedKeyword: () => void;
}

const DialogForm = ({
  campaignId,
  onClose,
  // showAddedKeyword,
  // updatedTopRankOnAddedKeyword,
}: any) => {
  const { startLoading, stopLoading } = useLoader();
  const form = useForm({
    resolver: zodResolver(addKeywordsSchema),
    defaultValues: {
      url: "",
      keywordTag: "",
      searchLocationCode: 0,
      language: "",
      SearchEngine: "",
      serpType: "",
      deviceType: "",
      volumeLocationCode: 0,
      keywords: [],
    },
  });

  const [tagsInput, setTagsInput] = useState("");
  const [Keywords, setKeywords] = useState<string[]>([]);
  const [KeywordsText, setKeywordsText] = useState<any>("");
  const [keywordError, setKeywordError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const [query, setQuery] = useState("");
  const [volumnQuery, setVolumnQuery] = useState("");
  const [results, setResults] = useState<any>([]);
  const [VolumeLocation, setVolumeLocation] = useState<any>([]);
  const [isPending, startTransition] = useTransition();
  const [isPendingvolumndata, startTransitionVolumndata] = useTransition();
  const [languages, setLanguages] = useState<string[]>([]);
  const [defaultUrl, setDefaulturl] = useState<string>("");

  const setDefaultUrl = async () => {
    if (!campaignId) {
      console.warn("No campaignId provided");
      setDefaulturl("");
      return;
    }

    try {
      const campaignData = await GetCampaignByid(campaignId);

      const url = campaignData?.campaign?.projectUrl ?? "";
      form.reset({ url: url });
    } catch (error) {
      console.error("Failed to fetch campaign data:", error);
      setDefaulturl("");
    }
  };

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
  }, [open]);
  useEffect(() => {
    setDefaultUrl();
  }, [campaignId]);

  const onSubmit = async () => {
    const isValid = await form.trigger();
    if (Keywords.length === 0) {
      setKeywordError("Please enter at least one keyword.");
      return;
    } else {
      setKeywordError(null);
    }

    console.log("okokok");

    const payload = {
      ...form.getValues(),
      keywords: Keywords,
      campaignId,
    };

    console.log(payload, "add kewywords front end data payloadd");
    // startLoading();
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

      const response = await res.json();
      onClose();
      console.log(response, "res addd");
      // if (!response.success) {
      //   throw new Error(response.error || "Failed to create keywords");
      // }
      console.log(response.addedKeywords, "Response from API");
      console.log(form.getValues("searchLocationCode"), "cod location");
      // const matchlocation = await getfetchDBlocationData(
      //   form.getValues("searchLocationCode")
      // );
      // await updatedTopRankOnAddedKeyword();

      // if (response?.addedKeywords && matchlocation?.locationName) {
      //   const modifiedKeywords = response.addedKeywords.map((item: {}) => ({
      //     ...item,
      //     location_name: matchlocation.locationName.locationName, // <- direct string
      //   }));

      //   await showAddedKeyword(modifiedKeywords);
      // }

      // Optionally, you can log the response or handle it as needed
      console.log("Submitted:", response);
      toast.success(response?.message);

      form.reset({
        url: "",
        keywordTag: "",
        searchLocationCode: 0,
        language: "",
        SearchEngine: "",
        serpType: "",
        deviceType: "",
        volumeLocationCode: 0,
        keywords: [],
      });

      setKeywords([]);
      setQuery("");
      setVolumnQuery("");
      setKeywordsText("");
      setOpen(false);
      // stopLoading();
      // await getDbLiveKeywordData(campaignId.campaignId)
    } catch (error) {
      console.error("Submission Error:", error);
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
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);

        // setDefaultUrl();
      }}
    >
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
                    disabled={true}
                    defaultValue={defaultUrl}
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
                    errorMessage={form.formState.errors.searchLocationCode?.message}
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
                    listName="volume Location"
                    value={field.value}
                    onChange={(selected: any) =>
                      field.onChange(selected?.value)
                    }
                    errorMessage={
                      form.formState.errors.volumeLocationCode?.message
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
              {/* <div
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
              </div> */}
              <KeywordTextArea
                value={KeywordsText}
                onChange={handleKeywordChange}
                placeholder="Enter keywords separated by comma or new line"
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
                    icon={<FcGoogle className=" text-xl" />}
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
                    listData={["organic", "paid"]}
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
            <CustomButton buttonName="Submit" onClick={onSubmit} />
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default DialogForm;

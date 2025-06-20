"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
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
import { CheckCircle2 } from "lucide-react";

export function TabsDemo() {
  const { startLoading, stopLoading } = useLoader();

  const form = useForm<z.infer<typeof campaignSchema>>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      name: "",
      url: "",
    },
  });

  const [input, setInput] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [campaignValid, setCampaignValid] = useState(false);
  const [activeTab, setActiveTab] = useState("account");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && input.trim()) {
      e.preventDefault();
      const trimmed = input.trim();
      if (!keywords.includes(trimmed)) {
        setKeywords([...keywords, trimmed]);
      }
      setInput("");
    } else if (e.key === "Backspace" && !input && keywords.length) {
      setKeywords(keywords.slice(0, -1));
    }
  };

  const removeKeyword = (index: number) => {
    setKeywords(keywords.filter((_, i) => i !== index));
  };

  const handleCampaignSubmit = async () => {
    const values = form.getValues();

    if (!values.name || !values.url) {
      toast("Please fill all fields.");
      return;
    }

    const isValid = await form.trigger();
    if (!isValid) return;

    setCampaignValid(true);
    toast("Campaign Info validated!");
    setActiveTab("keywords");
  };

  const onFinalSubmit = async () => {
    const values = form.getValues();

    if (!values.name || !values.url || keywords.length === 0) {
      toast("Please complete all fields.");
      return;
    }

    const payload = {
      name: values.name,
      url: values.url,
      keywords,
    };

    startLoading();
    try {
      const response = await createCampaign(payload);
      if (response?.success) {
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
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="account">
          Campaign Info {campaignValid && <CheckCircle2 className="ml-2 text-green-500" size={16} />}
        </TabsTrigger>
        <TabsTrigger value="keywords" disabled={!campaignValid}>
          Live Keyword Tracking
        </TabsTrigger>
      </TabsList>

      {/* Campaign Info Tab */}
      <TabsContent value="account">
        <Card>
          <CardHeader>
            <CardTitle>Campaign Info</CardTitle>
            <CardDescription>
              Provide basic details about your SEO campaign.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Form {...form}>
              <form className="space-y-8 w-full max-w-xl">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Enter Campaign Name" {...field} />
                      </FormControl>
                      <FormMessage className="error-msg" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Enter Domain URL" {...field} />
                      </FormControl>
                      <FormMessage className="error-msg" />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button onClick={handleCampaignSubmit}>Continue to Keywords</Button>
          </CardFooter>
        </Card>
      </TabsContent>

      {/* Keywords Tab */}
      <TabsContent value="keywords">
        <Card>
          <CardHeader>
            <CardTitle>Live Keyword Tracking</CardTitle>
            <CardDescription>
              Add keywords you'd like to track rankings for.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="border p-2 rounded w-full max-w-xl">
              <div className="flex flex-wrap gap-2">
                {keywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-2 py-1 rounded flex items-center gap-1"
                  >
                    {keyword}
                    <button onClick={() => removeKeyword(index)}>&times;</button>
                  </span>
                ))}
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a keyword and press Enter"
                  className="flex-1 p-1 outline-none"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={onFinalSubmit}>Save Campaign</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

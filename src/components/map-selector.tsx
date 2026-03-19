"use client";

import { useEffect, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Controller, useForm, useWatch } from "react-hook-form";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { sideOptions, stackSizeOptions } from "@/lib/constants";
import type { PrepSelectorInput } from "@/lib/validation/forms";
import { prepSelectorSchema } from "@/lib/validation/forms";
import { usePrepStore } from "@/store/use-prep-store";

type MapSelectorProps = {
  maps: {
    slug: string;
    name: string;
    sites: { slug: string; name: string }[];
  }[];
  operators: {
    slug: string;
    name: string;
  }[];
  submitLabel?: string;
  initialValues?: Partial<PrepSelectorInput>;
  title?: string;
  description?: string;
};

export function MapSelector({
  maps,
  operators,
  submitLabel = "Build prep board",
  initialValues,
  title = "Quick map selector",
  description = "Choose the match context and jump straight into a prep plan.",
}: MapSelectorProps) {
  const router = useRouter();
  const addRecentPlan = usePrepStore((state) => state.addRecentPlan);

  const fallbackMap = maps[0];
  const defaultMap = initialValues?.mapSlug ?? fallbackMap?.slug ?? "";
  const defaultSite =
    initialValues?.siteSlug ?? fallbackMap?.sites[0]?.slug ?? "";

  const form = useForm<PrepSelectorInput>({
    resolver: zodResolver(prepSelectorSchema),
    defaultValues: {
      mapSlug: defaultMap,
      side: initialValues?.side ?? "attack",
      siteSlug: defaultSite,
      stackSize: initialValues?.stackSize ?? 5,
      comfortOperators: initialValues?.comfortOperators ?? [],
    },
  });

  const mapSlug = useWatch({
    control: form.control,
    name: "mapSlug",
  });
  const selectedMap = useMemo(
    () => maps.find((map) => map.slug === mapSlug) ?? fallbackMap,
    [fallbackMap, mapSlug, maps],
  );

  useEffect(() => {
    const currentSite = form.getValues("siteSlug");
    const siteExists = selectedMap?.sites.some((site) => site.slug === currentSite);

    if (!siteExists && selectedMap?.sites[0]) {
      form.setValue("siteSlug", selectedMap.sites[0].slug);
    }
  }, [form, selectedMap]);

  function toggleOperator(slug: string) {
    const current = form.getValues("comfortOperators");
    const next = current.includes(slug)
      ? current.filter((value) => value !== slug)
      : [...current, slug].slice(0, 6);
    form.setValue("comfortOperators", next, { shouldValidate: true });
  }

  const comfortOperators = useWatch({
    control: form.control,
    name: "comfortOperators",
  });

  const onSubmit = form.handleSubmit((values) => {
    const selectedSite = selectedMap?.sites.find((site) => site.slug === values.siteSlug);

    addRecentPlan({
      mapSlug: values.mapSlug,
      mapName: selectedMap?.name ?? values.mapSlug,
      side: values.side,
      siteSlug: values.siteSlug,
      siteName: selectedSite?.name ?? values.siteSlug,
      stackSize: values.stackSize,
      comfortOperators: values.comfortOperators,
      updatedAt: new Date().toISOString(),
    });

    const searchParams = new URLSearchParams({
      stack: String(values.stackSize),
    });

    if (values.comfortOperators.length) {
      searchParams.set("comfort", values.comfortOperators.join(","));
    }

    router.push(
      `/prep/${values.mapSlug}/${values.side}/${values.siteSlug}?${searchParams.toString()}`,
    );
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-5" onSubmit={onSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="prep-map">Map</Label>
              <Controller
                control={form.control}
                name="mapSlug"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="prep-map">
                      <SelectValue placeholder="Select map" />
                    </SelectTrigger>
                    <SelectContent>
                      {maps.map((map) => (
                        <SelectItem key={map.slug} value={map.slug}>
                          {map.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="prep-side">Side</Label>
              <Controller
                control={form.control}
                name="side"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="prep-side">
                      <SelectValue placeholder="Select side" />
                    </SelectTrigger>
                    <SelectContent>
                      {sideOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="prep-site">Site</Label>
              <Controller
                control={form.control}
                name="siteSlug"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="prep-site">
                      <SelectValue placeholder="Select site" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedMap?.sites.map((site) => (
                        <SelectItem key={site.slug} value={site.slug}>
                          {site.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="prep-stack">Stack size</Label>
              <Controller
                control={form.control}
                name="stackSize"
                render={({ field }) => (
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={String(field.value)}
                  >
                    <SelectTrigger id="prep-stack">
                      <SelectValue placeholder="Select stack size" />
                    </SelectTrigger>
                    <SelectContent>
                      {stackSizeOptions.map((size) => (
                        <SelectItem key={size} value={String(size)}>
                          {size} stack
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Comfort operators</Label>
            <div className="flex flex-wrap gap-2">
              {operators.map((operator) => {
                const selected = comfortOperators.includes(operator.slug);

                return (
                  <button
                    key={operator.slug}
                    type="button"
                    onClick={() => toggleOperator(operator.slug)}
                    className="focus:outline-none"
                  >
                    <Badge variant={selected ? "default" : "outline"}>{operator.name}</Badge>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-[color:var(--text-subtle)]">
              Recent plans are stored locally on this device for fast re-entry.
            </p>
            <Button type="submit">{submitLabel}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

"use client";

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
import { playstyleOptions, rankBandOptions, stackSizeOptions } from "@/lib/constants";
import type { BanAssistantFormInput } from "@/lib/validation/forms";
import { banAssistantSchema } from "@/lib/validation/forms";

type BanAssistantFormProps = {
  maps: { slug: string; name: string }[];
  operators: { slug: string; name: string }[];
  initialValues: BanAssistantFormInput;
};

export function BanAssistantForm({
  maps,
  operators,
  initialValues,
}: BanAssistantFormProps) {
  const router = useRouter();

  const form = useForm<BanAssistantFormInput>({
    resolver: zodResolver(banAssistantSchema),
    defaultValues: initialValues,
  });

  const selectedOperators = useWatch({
    control: form.control,
    name: "comfortOperators",
  });

  function toggleOperator(slug: string) {
    const current = form.getValues("comfortOperators");
    form.setValue(
      "comfortOperators",
      current.includes(slug)
        ? current.filter((value) => value !== slug)
        : [...current, slug].slice(0, 6),
    );
  }

  const onSubmit = form.handleSubmit((values) => {
    const searchParams = new URLSearchParams({
      map: values.mapSlug,
      rankBand: values.rankBand,
      playstyle: values.playstyle,
      stack: String(values.stackSize),
    });

    if (values.comfortOperators.length) {
      searchParams.set("comfort", values.comfortOperators.join(","));
    }

    router.push(`/bans?${searchParams.toString()}`);
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ban assistant inputs</CardTitle>
        <CardDescription>
          Deterministic rules combine map defaults, rank context, playstyle, stack size,
          and your comfort pool.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-5" onSubmit={onSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label>Map</Label>
              <Controller
                control={form.control}
                name="mapSlug"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
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
              <Label>Rank band</Label>
              <Controller
                control={form.control}
                name="rankBand"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select rank band" />
                    </SelectTrigger>
                    <SelectContent>
                      {rankBandOptions.map((option) => (
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
              <Label>Preferred playstyle</Label>
              <Controller
                control={form.control}
                name="playstyle"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select playstyle" />
                    </SelectTrigger>
                    <SelectContent>
                      {playstyleOptions.map((option) => (
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
              <Label>Stack size</Label>
              <Controller
                control={form.control}
                name="stackSize"
                render={({ field }) => (
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={String(field.value)}
                  >
                    <SelectTrigger>
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
                const selected = selectedOperators.includes(operator.slug);

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

          <div className="flex justify-end">
            <Button type="submit">Run ban logic</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

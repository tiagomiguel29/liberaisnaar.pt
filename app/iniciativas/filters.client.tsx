"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { DateRange } from "react-day-picker";

const typeOtions = [
  { label: "Todos", value: "all" },
  { label: "Apreciação Parlamentar", value: "Apreciação Parlamentar" },
  {
    label: "Iniciativa Popular de Referendo",
    value: "Iniciativa Popular de Referendo",
  },
  { label: "Inquérito Parlamentar", value: "Inquérito Parlamentar" },
  { label: "Projeto de Deliberação", value: "Projeto de Deliberação" },
  { label: "Projeto de Lei", value: "Projeto de Lei" },
  { label: "Projeto de Regimento", value: "Projeto de Regimento" },
  { label: "Projeto de Resolução", value: "Projeto de Resolução" },
  {
    label: "Projeto de Revisão Constitucional",
    value: "Projeto de Revisão Constitucional",
  },
  { label: "Proposta de Lei", value: "Proposta de Lei" },
  { label: "Proposta de Resolução", value: "Proposta de Resolução" },
  { label: "Ratificação", value: "Ratificação" },
];

export const InitiativesFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [date, setDate] = useState<DateRange | undefined>({
    from: searchParams.get("from") ? new Date(searchParams.get("from")!) : undefined,
    to: searchParams.get("to") ? new Date(searchParams.get("to")!) : undefined,
  });
  const [type, setType] = useState<string>(searchParams.get("type") || "all");

  const handleSubmit = () => {
    console.log("Filters applied:", { type, date });
    const st = new URLSearchParams();
    if (type && type !== "all") {
      st.set("type", type);
    }
    if (date?.from) {
      st.set("from", format(date.from, "yyyy-MM-dd"));
    }
    if (date?.to) {
      st.set("to", format(date.to, "yyyy-MM-dd"));
    }
    router.push(`/iniciativas?${st.toString()}`);
  };
  return (
    <div className="space-y-4 py-8">
      <h2 className="text-lg font-semibold">Filtros</h2>
      <div className="flex flex-col sm:flex-row sm:items-end gap-4">
        <div className="space-y-2">
          <Label htmlFor="type-select">Tipo de Iniciativa</Label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="w-full sm:w-[240px]">
              <SelectValue placeholder="Selecionar tipo" />
            </SelectTrigger>
            <SelectContent>
              {typeOtions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="date-range">Data de Submissão</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, "LLL dd, y")} -{" "}
                      {format(date.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(date.from, "LLL dd, y")
                  )
                ) : (
                  <span>Selecionar intervalo de datas</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>
        <Button className="w-full sm:w-auto" onClick={handleSubmit}>
            Aplicar Filtros
        </Button>
      </div>
    </div>
  );
};

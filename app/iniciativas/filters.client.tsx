"use client";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
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

const voteOptions = [
  { label: "Todos", value: "all" },
  { label: "Aprovado", value: "Aprovado" },
  { label: "Rejeitado", value: "Rejeitado" },
  { label: "Sem Votação", value: "no-vote" },
];


export const InitiativesFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [date, setDate] = useState<DateRange | undefined>({
    from: searchParams.get("from")
      ? new Date(searchParams.get("from")!)
      : undefined,
    to: searchParams.get("to") ? new Date(searchParams.get("to")!) : undefined,
  });
  const [type, setType] = useState<string>(searchParams.get("type") || "all");
  const [firstVote, setFirstVote] = useState<string>(
    searchParams.get("firstVote") || "all"
  );
  const [finalVote, setFinalVote] = useState<string>(
    searchParams.get("finalVote") || "all"
  );

  const handleSubmit = () => {
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
    if (firstVote && firstVote !== "all") {
      st.set("firstVote", firstVote);
    }
    if (finalVote && finalVote !== "all") {
      st.set("finalVote", finalVote);
    }
    router.push(`/iniciativas?${st.toString()}`);
  };
  return (
    <div className="space-y-4 py-8">
      <h2 className="text-lg font-semibold">Filtros</h2>
      <div className="flex flex-col sm:flex-row flex-wrap sm:items-end gap-4">
        <div className="w-full sm:w-80">
          <FormControl
            fullWidth
          >
            <InputLabel id="type-select">Tipo de Iniciativa</InputLabel>
            <Select
              labelId="type-select"
              value={type}
              label="Tipo de Iniciativa"
              size="small"
              slotProps={{}}
              onChange={(e) => setType(e.target.value)}
              fullWidth
            >
              {typeOtions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="w-full sm:w-80">
          <Popover>
            <PopoverTrigger asChild>
              <TextField
                id="date"
                variant="outlined"
                size="small"
                label="Data de Submissão"
                fullWidth
                slotProps={{
                  input: {
                    readOnly: true,
                    startAdornment: <CalendarIcon />,
                  },
                }}
                value={
                  date?.from
                    ? date.to
                      ? format(date.from, "LLL dd, y") +
                        " - " +
                        format(date.to, "LLL dd, y")
                      : format(date.from, "LLL dd, y")
                    : "Selecionar data de submissão"
                }
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              ></TextField>
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
        <div className="w-full sm:w-80">
          <FormControl
            fullWidth
          >
            <InputLabel id="first-vote-select">Votação na Generalidade</InputLabel>
            <Select
              labelId="first-vote-select"
              value={firstVote}
              label="Voto na Generalidade"
              size="small"
              slotProps={{}}
              onChange={(e) => setFirstVote(e.target.value)}
              fullWidth
            >
              {voteOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="w-full sm:w-80">
          <FormControl
            fullWidth
          >
            <InputLabel id="final-vote-select">Votação Final Global</InputLabel>
            <Select
              labelId="final-vote-select"
              value={finalVote}
              label="Voto Final Global"
              size="small"
              slotProps={{}}
              onChange={(e) => setFinalVote(e.target.value)}
              fullWidth
            >
              {voteOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <Button
          variant="contained"
          className="w-full sm:w-auto"
          onClick={handleSubmit}
        >
          Aplicar Filtros
        </Button>
      </div>
    </div>
  );
};

"use client";

import { format } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  Box,
  Button,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import { CalendarIcon } from "lucide-react";

const initiativeTypeOtions = [
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

const votesTypeOtions = [
  { label: "Todos", value: "all" },
  { label: "Votação final global", value: "Votação final global" },
  { label: "Votação na generalidade", value: "Votação na generalidade" },
  { label: "Discussão generalidade", value: "Discussão generalidade" },
  { label: "Votação Deliberação", value: "Votação Deliberação" },
  { label: "Votação na especialidade", value: "Votação na especialidade" },
  {
    label: "Requerimento Baixa Comissão sem Votação (Generalidade)",
    value: "Requerimento Baixa Comissão sem Votação (Generalidade)",
  },
  {
    label: "Requerimento de adiamento de Votação (Generalidade)",
    value: "Requerimento de adiamento de Votação (Generalidade)",
  },
  {
    label: "Requerimento avocação plenário",
    value: "Requerimento avocação plenário",
  },
  {
    label: "Requerimento dispensa do prazo previsto Artº 157 RAR",
    value: "Requerimento dispensa do prazo previsto Artº 157 RAR",
  },
];

const partyOptions = [
  "IL",
  "PSD",
  "PS",
  "BE",
  "PCP",
  "CDS-PP",
  "PAN",
  "L",
  "CH",
];

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  
};

export const VotesFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [date, setDate] = useState<DateRange | undefined>({
    from: searchParams.get("from")
      ? new Date(searchParams.get("from")!)
      : undefined,
    to: searchParams.get("to") ? new Date(searchParams.get("to")!) : undefined,
  });
  const [initiativeType, setInitiativeType] = useState(
    searchParams.get("initiativeType") ?? "all"
  );
  const [voteType, setVoteType] = useState(
    searchParams.get("voteType") ?? "all"
  );
  const [parties, setParties] = useState<string[]>(
    searchParams.get("parties")?.split(",") ?? []
  );

  const handleSubmit = () => {
    const st = new URLSearchParams();
    if (initiativeType && initiativeType !== "all") {
      st.set("initiativeType", initiativeType);
    }
    if (voteType && voteType !== "all") {
      st.set("voteType", voteType);
    }
    if (parties.length > 0) {
      st.set("parties", parties.join(","));
    }
    if (date?.from) {
      st.set("from", format(date.from, "yyyy-MM-dd"));
    }
    if (date?.to) {
      st.set("to", format(date.to, "yyyy-MM-dd"));
    }
    router.push(`/votacoes?${st.toString()}`);
  };

  const handlePartiesChange = (event: SelectChangeEvent<typeof parties>) => {
    const {
      target: { value },
    } = event;
    setParties(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  return (
    <div className="space-y-4 py-8">
      <h2 className="text-lg font-semibold">Filtros</h2>
      <div className="flex flex-col sm:flex-row flex-wrap sm:items-end gap-4">
        <div className="w-full sm:w-80">
          <FormControl fullWidth>
            <InputLabel size="small" id="vote-type-select">Tipo de Votação</InputLabel>
            <Select
              labelId="vote-type-select"
              value={voteType}
              label="Tipo de Votação"
              size="small"
              slotProps={{}}
              onChange={(e) => setVoteType(e.target.value)}
              fullWidth
            >
              {votesTypeOtions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="w-full sm:w-80">
          <FormControl fullWidth>
            <InputLabel size="small" id="type-select">Tipo de Iniciativa</InputLabel>
            <Select
              labelId="type-select"
              value={initiativeType}
              label="Tipo de Iniciativa"
              size="small"
              slotProps={{}}
              onChange={(e) => setInitiativeType(e.target.value)}
              fullWidth
            >
              {initiativeTypeOtions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="w-full sm:w-80">
          <FormControl fullWidth>
            <InputLabel size="small" id="party-select-label">Partidos Autores</InputLabel>
            <Select
              labelId="party-select-label"
              id="party-select"
              multiple
              size="small"
              value={parties}
              onChange={handlePartiesChange}
              input={<OutlinedInput id="party-select-input" label="Partidos Autores" size="small"/>}
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: {sm: "nowrap", xs: "wrap"}, gap: 0.5, overflowX: "auto" }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} size="small" color="primary" />
                  ))}
                </Box>
              )}
              MenuProps={MenuProps}
            >
              {partyOptions.map((party) => (
                <MenuItem key={party} value={party}>
                  {party}
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
                label="Data de Votação"
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
                    : "Selecionar data de votação"
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

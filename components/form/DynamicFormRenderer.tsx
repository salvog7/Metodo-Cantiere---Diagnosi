"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import type { FormQuestion } from "@/lib/setup-seed"

const COUNTRY_CODES = [
  { code: "+39", country: "IT" },
  { code: "+1", country: "US" },
  { code: "+44", country: "UK" },
  { code: "+33", country: "FR" },
  { code: "+49", country: "DE" },
  { code: "+34", country: "ES" },
  { code: "+41", country: "CH" },
  { code: "+43", country: "AT" },
  { code: "+32", country: "BE" },
  { code: "+31", country: "NL" },
  { code: "+351", country: "PT" },
  { code: "+30", country: "GR" },
  { code: "+48", country: "PL" },
  { code: "+420", country: "CZ" },
  { code: "+36", country: "HU" },
  { code: "+46", country: "SE" },
  { code: "+47", country: "NO" },
  { code: "+45", country: "DK" },
  { code: "+358", country: "FI" },
  { code: "+353", country: "IE" },
  { code: "+7", country: "RU" },
  { code: "+86", country: "CN" },
  { code: "+81", country: "JP" },
  { code: "+82", country: "KR" },
  { code: "+91", country: "IN" },
  { code: "+61", country: "AU" },
  { code: "+55", country: "BR" },
  { code: "+52", country: "MX" },
  { code: "+54", country: "AR" },
  { code: "+27", country: "ZA" },
]

interface Competitor {
  nomeAzienda: string
  sitoWeb: string
}

interface DynamicFormRendererProps {
  questions: FormQuestion[]
  formData: Record<string, string | number>
  updateFormData: (field: string, value: string | number) => void
  competitors?: Competitor[]
  addCompetitor?: () => void
  removeCompetitor?: (index: number) => void
  updateCompetitor?: (index: number, field: keyof Competitor, value: string) => void
  phonePrefix?: string
  setPhonePrefix?: (value: string) => void
}

export function DynamicFormRenderer({
  questions,
  formData,
  updateFormData,
  competitors = [],
  addCompetitor,
  removeCompetitor,
  updateCompetitor,
  phonePrefix = "+39",
  setPhonePrefix,
}: DynamicFormRendererProps) {
  const renderQuestion = (q: FormQuestion) => {
    const value = formData[q.key]
    const displayValue = value ?? (q.type === "slider" ? (q.defaultValue ?? 3) : "")

    if (q.type === "competitors") {
      if (!addCompetitor || !removeCompetitor || !updateCompetitor) return null
      return (
        <div key={q.key} className="space-y-4">
          <Label className="text-base font-semibold">{q.label}</Label>
          {competitors.map((competitor, index) => (
            <div key={index} className="space-y-3 p-4 border rounded-lg bg-gray-50">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-sm">Competitor {index + 1}</span>
                {competitors.length > 2 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeCompetitor(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Rimuovi
                  </Button>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor={`competitor-name-${index}`}>Nome Azienda</Label>
                <Input
                  id={`competitor-name-${index}`}
                  type="text"
                  value={competitor.nomeAzienda}
                  onChange={(e) => updateCompetitor(index, "nomeAzienda", e.target.value)}
                  placeholder="Es: Azienda Competitor SRL"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`competitor-website-${index}`}>Sito Web</Label>
                <div className="flex items-center">
                  <span className="inline-flex items-center px-3 py-2 bg-gray-100 border border-r-0 border-gray-300 rounded-l-md text-gray-600 text-sm">
                    https://www.
                  </span>
                  <Input
                    id={`competitor-website-${index}`}
                    type="text"
                    value={competitor.sitoWeb}
                    onChange={(e) => updateCompetitor(index, "sitoWeb", e.target.value)}
                    placeholder="esempio.com"
                    required
                    className="rounded-l-none"
                  />
                </div>
              </div>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={addCompetitor} className="w-full bg-transparent">
            + Aggiungi Competitor
          </Button>
        </div>
      )
    }

    if (q.type === "tel" && q.key === "telefono" && setPhonePrefix) {
      return (
        <div key={q.key} className="space-y-2">
          <Label htmlFor={q.key} className="text-base font-semibold">
            {q.label}
          </Label>
          <div className="flex gap-2">
            <Select value={phonePrefix} onValueChange={setPhonePrefix}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-[200px]">
                {COUNTRY_CODES.map((c) => (
                  <SelectItem key={c.code} value={c.code}>
                    {c.country} {c.code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              id={q.key}
              type="tel"
              value={String(displayValue)}
              onChange={(e) => updateFormData(q.key, e.target.value)}
              placeholder={q.placeholder ?? "123 456 7890"}
              required={q.required}
              className="text-base flex-1"
            />
          </div>
        </div>
      )
    }

    if (q.type === "slider") {
      const numValue = Number(displayValue) || (q.defaultValue ?? 3)
      return (
        <div key={q.key} className="space-y-4">
          <Label className="text-base font-semibold">{q.label}</Label>
          <div className="space-y-3">
            <div className="flex justify-between text-sm text-gray-600 px-1">
              <span>{q.minLabel ?? String(q.min ?? 1)}</span>
              <span className="font-medium">Valore: {numValue}</span>
              <span>{q.maxLabel ?? String(q.max ?? 5)}</span>
            </div>
            <Slider
              value={[numValue]}
              onValueChange={(v) => updateFormData(q.key, v[0])}
              min={q.min ?? 1}
              max={q.max ?? 5}
              step={q.step ?? 1}
              className="py-4"
            />
            {q.helperText && <p className="text-sm text-gray-500 italic">{q.helperText}</p>}
          </div>
        </div>
      )
    }

    if (q.type === "radio" && q.options) {
      return (
        <div key={q.key} className="space-y-3">
          <Label className="text-base font-semibold">{q.label}</Label>
          <RadioGroup
            value={String(displayValue)}
            onValueChange={(v) => updateFormData(q.key, v)}
          >
            {q.options.map((opt, i) => (
              <div key={i} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <RadioGroupItem value={opt} id={`${q.key}-${i}`} />
                <Label htmlFor={`${q.key}-${i}`} className="font-normal cursor-pointer text-base flex-1">
                  {opt}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      )
    }

    if (q.type === "textarea") {
      return (
        <div key={q.key} className="space-y-2">
          <Label htmlFor={q.key} className="text-base font-semibold">
            {q.label}
          </Label>
          <Textarea
            id={q.key}
            value={String(displayValue)}
            onChange={(e) => updateFormData(q.key, e.target.value)}
            placeholder={q.placeholder}
            required={q.required}
            rows={4}
            className="text-base"
          />
          {q.helperText && <p className="text-sm text-gray-500">{q.helperText}</p>}
        </div>
      )
    }

    const inputType = q.type === "email" ? "email" : q.type === "url" ? "url" : q.type === "number" ? "number" : "text"
    return (
      <div key={q.key} className="space-y-2">
        <Label htmlFor={q.key} className="text-base font-semibold">
          {q.label}
        </Label>
        <Input
          id={q.key}
          type={inputType}
          value={String(displayValue)}
          onChange={(e) =>
            updateFormData(q.key, q.type === "number" ? Number(e.target.value) || 0 : e.target.value)
          }
          placeholder={q.placeholder}
          required={q.required}
          className="text-base"
        />
        {q.helperText && <p className="text-sm text-gray-500">{q.helperText}</p>}
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {questions.map((q) => renderQuestion(q))}
    </div>
  )
}

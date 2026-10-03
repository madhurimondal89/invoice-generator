import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Palette, Check, Sparkles } from "lucide-react";

interface ThemeColorSectionProps {
  form: UseFormReturn<any>;
}

const PRESET_THEMES = [
  { name: "Modern Indigo", header: "#4f46e5", footer: "#818cf8" },
  { name: "Corporate Slate", header: "#0f172a", footer: "#64748b" },
  { name: "Emerald Pro", header: "#059669", footer: "#34d399" },
  { name: "Royal Ocean", header: "#1e40af", footer: "#60a5fa" },
  { name: "Creative Purple", header: "#7c3aed", footer: "#c084fc" },
  { name: "Contractor Amber", header: "#d97706", footer: "#fbbf24" },
  { name: "Monochrome Dark", header: "#18181b", footer: "#71717a" },
  { name: "Crimson Rose", header: "#be123c", footer: "#fb7185" },
];

const HEADER_SWATCHES = [
  "#4f46e5", "#0f172a", "#059669", "#1e40af",
  "#7c3aed", "#d97706", "#be123c", "#18181b"
];

const FOOTER_SWATCHES = [
  "#818cf8", "#64748b", "#34d399", "#60a5fa",
  "#c084fc", "#fbbf24", "#fb7185", "#71717a"
];

export default function ThemeColorSection({ form }: ThemeColorSectionProps) {
  const currentHeaderColor = form.watch("primaryColor") || "#2563eb";
  const currentFooterColor = form.watch("accentColor") || "#60a5fa";

  const handleApplyPreset = (header: string, footer: string) => {
    form.setValue("primaryColor", header, { shouldDirty: true, shouldTouch: true });
    form.setValue("accentColor", footer, { shouldDirty: true, shouldTouch: true });
  };

  const handleHeaderChange = (val: string) => {
    form.setValue("primaryColor", val, { shouldDirty: true, shouldTouch: true });
  };

  const handleFooterChange = (val: string) => {
    form.setValue("accentColor", val, { shouldDirty: true, shouldTouch: true });
  };

  return (
    <Card className="border-0 shadow-sm ring-1 ring-gray-200 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-slate-50 border-b pb-3.5">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold text-gray-900 flex items-center gap-2">
            <Palette className="h-4 w-4 text-blue-600" />
            Document Styling & Brand Colors
          </CardTitle>
          <span className="text-[11px] font-medium text-gray-500 bg-white/80 px-2 py-0.5 rounded-full border border-gray-200">
            Real-time Live Preview
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-5 space-y-4">
        {/* Preset Palettes */}
        <div>
          <div className="flex items-center gap-1.5 mb-2.5">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Quick Theme Palettes
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {PRESET_THEMES.map((theme) => {
              const isSelected =
                currentHeaderColor.toLowerCase() === theme.header.toLowerCase() &&
                currentFooterColor.toLowerCase() === theme.footer.toLowerCase();

              return (
                <button
                  type="button"
                  key={theme.name}
                  onClick={() => handleApplyPreset(theme.header, theme.footer)}
                  className={`flex items-center gap-2 p-2 rounded-lg border text-left transition-all ${
                    isSelected
                      ? "border-blue-600 bg-blue-50/60 shadow-xs ring-1 ring-blue-500/20"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50/80 bg-white"
                  }`}
                >
                  <div className="flex items-center -space-x-1 shrink-0">
                    <span
                      className="w-4 h-4 rounded-full border border-white shadow-xs"
                      style={{ backgroundColor: theme.header }}
                    />
                    <span
                      className="w-4 h-4 rounded-full border border-white shadow-xs"
                      style={{ backgroundColor: theme.footer }}
                    />
                  </div>
                  <span className="text-xs font-medium text-gray-800 truncate flex-1">
                    {theme.name}
                  </span>
                  {isSelected && <Check className="h-3 w-3 text-blue-600 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Header & Footer Color Pickers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gray-100">
          {/* Header Color Picker */}
          <div className="space-y-2 bg-gray-50/60 p-3.5 rounded-xl border border-gray-200/70">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold text-gray-800 flex items-center gap-1.5">
                <span
                  className="w-3 h-3 rounded-full border border-gray-300"
                  style={{ backgroundColor: currentHeaderColor }}
                />
                Header Banner Color
              </Label>
              <span className="text-[11px] font-mono text-gray-500 uppercase">
                {currentHeaderColor}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative shrink-0">
                <input
                  type="color"
                  value={currentHeaderColor.startsWith("#") ? currentHeaderColor : "#2563eb"}
                  onChange={(e) => handleHeaderChange(e.target.value)}
                  className="w-9 h-9 rounded-lg border border-gray-300 cursor-pointer p-0.5 bg-white"
                  title="Choose Header Color"
                />
              </div>
              <Input
                value={currentHeaderColor}
                onChange={(e) => handleHeaderChange(e.target.value)}
                placeholder="#2563eb"
                className="h-9 font-mono text-xs uppercase"
              />
            </div>

            {/* Quick swatches */}
            <div className="flex items-center gap-1.5 pt-1 flex-wrap">
              {HEADER_SWATCHES.map((color) => (
                <button
                  type="button"
                  key={color}
                  onClick={() => handleHeaderChange(color)}
                  className={`w-5 h-5 rounded-md border transition-transform hover:scale-110 ${
                    currentHeaderColor.toLowerCase() === color.toLowerCase()
                      ? "ring-2 ring-offset-1 ring-blue-500 border-white"
                      : "border-gray-200"
                  }`}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>

          {/* Footer & Accent Color Picker */}
          <div className="space-y-2 bg-gray-50/60 p-3.5 rounded-xl border border-gray-200/70">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold text-gray-800 flex items-center gap-1.5">
                <span
                  className="w-3 h-3 rounded-full border border-gray-300"
                  style={{ backgroundColor: currentFooterColor }}
                />
                Footer & Accent Color
              </Label>
              <span className="text-[11px] font-mono text-gray-500 uppercase">
                {currentFooterColor}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative shrink-0">
                <input
                  type="color"
                  value={currentFooterColor.startsWith("#") ? currentFooterColor : "#60a5fa"}
                  onChange={(e) => handleFooterChange(e.target.value)}
                  className="w-9 h-9 rounded-lg border border-gray-300 cursor-pointer p-0.5 bg-white"
                  title="Choose Footer / Accent Color"
                />
              </div>
              <Input
                value={currentFooterColor}
                onChange={(e) => handleFooterChange(e.target.value)}
                placeholder="#60a5fa"
                className="h-9 font-mono text-xs uppercase"
              />
            </div>

            {/* Quick swatches */}
            <div className="flex items-center gap-1.5 pt-1 flex-wrap">
              {FOOTER_SWATCHES.map((color) => (
                <button
                  type="button"
                  key={color}
                  onClick={() => handleFooterChange(color)}
                  className={`w-5 h-5 rounded-md border transition-transform hover:scale-110 ${
                    currentFooterColor.toLowerCase() === color.toLowerCase()
                      ? "ring-2 ring-offset-1 ring-blue-500 border-white"
                      : "border-gray-200"
                  }`}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

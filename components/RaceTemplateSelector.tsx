"use client";

import { useState, useEffect } from "react";
import type { RaceTemplate } from "@/lib/archestra/types";

interface RaceTemplateSelectorProps {
  onSelect: (template: RaceTemplate) => void;
  selectedTemplate: RaceTemplate | null;
}

export default function RaceTemplateSelector({
  onSelect,
  selectedTemplate,
}: RaceTemplateSelectorProps) {
  const [templates, setTemplates] = useState<RaceTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/templates");
      if (!response.ok) {
        throw new Error("Failed to fetch templates");
      }
      const data = await response.json();
      setTemplates(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-900/20 border border-red-500 rounded-lg">
        <p className="text-red-400">Error: {error}</p>
      </div>
    );
  }

  const categories = Array.from(new Set(templates.map((t) => t.category)));

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Race Templates</h2>
      {categories.map((category) => (
        <div key={category} className="mb-6">
          <h3 className="text-lg font-semibold text-blue-400 mb-3 capitalize">
            {category}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates
              .filter((t) => t.category === category)
              .map((template) => (
                <div
                  key={template.id}
                  onClick={() => onSelect(template)}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedTemplate?.id === template.id
                      ? "bg-blue-900/30 border-blue-500"
                      : "bg-gray-900 border-gray-700 hover:border-gray-500"
                  }`}
                >
                  <h4 className="text-lg font-semibold mb-2">{template.name}</h4>
                  <p className="text-sm text-gray-400 mb-3">
                    {template.description}
                  </p>
                  <div className="text-xs text-gray-500">
                    <p className="mb-2">Servers: {template.servers.length}</p>
                    <div className="flex flex-wrap gap-1">
                      {template.servers.map((serverId) => (
                        <span
                          key={serverId}
                          className="px-2 py-1 bg-gray-800 text-gray-300 rounded"
                        >
                          {serverId}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}

"use client";

import { useState } from "react";
import type { RaceTemplate, RaceResult } from "@/lib/archestra/types";
import { Button, Card, Alert, FormField, Spinner } from "./ui";

interface RaceExecutorProps {
  template: RaceTemplate;
  onComplete: (result: RaceResult) => void;
}

export default function RaceExecutor({ template, onComplete }: RaceExecutorProps) {
  const [parameters, setParameters] = useState<Record<string, string>>({});
  const [executing, setExecuting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Extract parameter placeholders from prompt - helper for testability
  const extractParameterNames = (prompt: string): string[] => {
    return Array.from(prompt.matchAll(/\{([^}]+)\}/g), (m) => m[1]);
  };

  const parameterNames = extractParameterNames(template.prompt);

  const handleExecute = async () => {
    try {
      setExecuting(true);
      setError(null);

      const response = await fetch("/api/race", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateId: template.id,
          parameters,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to execute race");
      }

      const result = await response.json();
      onComplete(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setExecuting(false);
    }
  };

  const canExecute = parameterNames.every((name) => parameters[name]?.trim());

  return (
    <div className="space-y-4">
      <Card>
        <h3 className="text-xl font-bold mb-4">Execute: {template.name}</h3>
        
        <div className="mb-4 p-3 bg-gray-800 rounded">
          <p className="text-sm text-gray-400 mb-2">Prompt Template:</p>
          <p className="text-sm">{template.prompt}</p>
        </div>

        {parameterNames.length > 0 && (
          <div className="space-y-3 mb-4">
            <p className="text-sm font-semibold">Parameters:</p>
            {parameterNames.map((name) => (
              <FormField
                key={name}
                label={name}
                id={`param-${name}`}
                value={parameters[name] || ""}
                onChange={(value) => setParameters({ ...parameters, [name]: value })}
                placeholder={`Enter ${name}`}
                disabled={executing}
                required
              />
            ))}
          </div>
        )}

        {error && (
          <div className="mb-4">
            <Alert variant="error">{error}</Alert>
          </div>
        )}

        <Button
          onClick={handleExecute}
          disabled={!canExecute || executing}
          variant="primary"
          className="w-full"
        >
          {executing ? (
            <span className="flex items-center justify-center">
              <Spinner size="sm" className="mr-2" />
              Executing Race...
            </span>
          ) : (
            "Start Race"
          )}
        </Button>
      </Card>
    </div>
  );
}

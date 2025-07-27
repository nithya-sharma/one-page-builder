"use client";

import { useEffect, useState } from "react";
import * as React from "react";

// Props type
interface Props {
  code: string;
}

export default function DynamicComponentRenderer({ code }: Props) {
  const [Component, setComponent] = useState<React.FC | null>(null);

  useEffect(() => {
    if (!code) return;

    const loadComponent = async () => {
      try {
        const exports: Record<string, any> = {};
        const module = { exports };

        // Dynamically execute the code
        const func = new Function("React", "module", "exports", code);
        func(React, module, exports);

        // Try to get the component from either exports
        const Comp =
          module.exports.GeneratedComponent || exports.GeneratedComponent;

        // Ensure it's a function/component
        if (typeof Comp === "function") {
          setComponent(() => Comp);
        } else {
          throw new Error(
            "Generated component is not a valid React component."
          );
        }
      } catch (err) {
        console.error("Component render error:", err);
        setComponent(() => () => (
          <div className="text-red-500">Error rendering component</div>
        ));
      }
    };

    loadComponent();
  }, [code]);

  return Component ? (
    <Component />
  ) : (
    <p className="text-gray-400">Loading component...</p>
  );
}

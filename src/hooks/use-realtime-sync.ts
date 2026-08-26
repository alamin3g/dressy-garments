import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/**
 * Subscribes to catalogue table changes and refreshes the matching queries,
 * so admin edits appear on the public pages without a manual reload.
 */
export function useCatalogRealtime() {
  const qc = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel("catalog-sync")
      .on("postgres_changes", { event: "*", schema: "public", table: "products" }, () => {
        void qc.invalidateQueries({ queryKey: ["admin", "products"] });
        void qc.invalidateQueries({ queryKey: ["public", "products"] });
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "product_categories" }, () => {
        void qc.invalidateQueries({ queryKey: ["admin", "categories"] });
        void qc.invalidateQueries({ queryKey: ["product-categories"] });
      })
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [qc]);
}

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/**
 * Subscribes to catalogue + site content table changes and refreshes the
 * matching queries, so admin edits appear on the public pages instantly.
 */
export function useCatalogRealtime() {
  const qc = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel(`catalog-sync-${Math.random().toString(36).slice(2)}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "products" }, () => {
        void qc.invalidateQueries({ queryKey: ["admin", "products"] });
        void qc.invalidateQueries({ queryKey: ["public", "products"] });
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "product_categories" }, () => {
        void qc.invalidateQueries({ queryKey: ["admin", "categories"] });
        void qc.invalidateQueries({ queryKey: ["product-categories"] });
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "site_settings" }, () => {
        void qc.invalidateQueries({ queryKey: ["page-content"] });
        void qc.invalidateQueries({ queryKey: ["admin", "settings"] });
      })
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [qc]);
}

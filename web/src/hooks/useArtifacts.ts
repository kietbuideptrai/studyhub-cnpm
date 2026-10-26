import { useCallback, useEffect, useState } from "react";
import { getArtifacts } from "../api/client";
import { ApiRequestError } from "../api/client";
import type { ApiError, ArtifactListItem, Language } from "../../../shared/types";

export type AsyncData<T> =
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: ApiError; statusCode: number | null };

export interface UseArtifactsResult {
  state: AsyncData<ArtifactListItem[]>;
  retry: () => void;
}

export function useArtifacts(language: Language, query: string): UseArtifactsResult {
  const [state, setState] = useState<AsyncData<ArtifactListItem[]>>({
    status: "loading",
  });
  const [requestVersion, setRequestVersion] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setState({ status: "loading" });

    getArtifacts(language, query, controller.signal)
      .then((data) => {
        setState({ status: "success", data });
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) {
          return;
        }

        setState({
          status: "error",
          error: {
            message:
              error instanceof Error
                ? error.message
                : "Đã xảy ra lỗi khi tải danh sách hiện vật.",
          },
          statusCode: error instanceof ApiRequestError ? error.status : null,
        });
      });

    return () => controller.abort();
  }, [language, query, requestVersion]);

  const retry = useCallback(() => {
    setRequestVersion((version) => version + 1);
  }, []);

  return { state, retry };
}

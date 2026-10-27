import { useCallback, useEffect, useState } from "react";
import type { ArtifactListItem, Language } from "../../../shared/types";
import { ApiRequestError, getArtifacts } from "@/api/client";
import type { AsyncData } from "@/hooks/apiState";
import { getErrorMessage } from "@/hooks/apiState";

export interface UseArtifactsResult {
  state: AsyncData<ArtifactListItem[]>;
  retry: () => void;
}

interface ArtifactListRequestState {
  key: string;
  state: AsyncData<ArtifactListItem[]>;
}

export function useArtifacts(
  language: Language,
  query: string,
): UseArtifactsResult {
  const [requestState, setRequestState] =
    useState<ArtifactListRequestState | null>(null);
  const [requestVersion, setRequestVersion] = useState(0);
  const requestKey = `${language}\u0000${query}\u0000${requestVersion}`;

  useEffect(() => {
    const controller = new AbortController();

    getArtifacts(language, query, controller.signal)
      .then((data) => {
        setRequestState({
          key: requestKey,
          state: { status: "success", data },
        });
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) {
          return;
        }

        setRequestState({
          key: requestKey,
          state: {
            status: "error",
            error: {
              message: getErrorMessage(
                error,
                "Đã xảy ra lỗi khi tải danh sách hiện vật.",
              ),
            },
            statusCode: error instanceof ApiRequestError ? error.status : null,
          },
        });
      });

    return () => controller.abort();
  }, [language, query, requestKey]);

  const retry = useCallback(() => {
    setRequestVersion((version) => version + 1);
  }, []);

  return {
    state:
      requestState?.key === requestKey
        ? requestState.state
        : { status: "loading" },
    retry,
  };
}

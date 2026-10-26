import { useCallback, useEffect, useState } from "react";
import type { ArtifactDetail, Language } from "../../../shared/types";
import { ApiRequestError, getArtifact } from "@/api/client";
import type { AsyncData } from "@/hooks/apiState";
import { getErrorMessage } from "@/hooks/apiState";

export interface UseArtifactResult {
  state: AsyncData<ArtifactDetail>;
  isNotFound: boolean;
  retry: () => void;
}

interface ArtifactRequestState {
  key: string;
  state: AsyncData<ArtifactDetail>;
}

export function useArtifact(
  slug: string | undefined,
  language: Language,
): UseArtifactResult {
  const [requestState, setRequestState] =
    useState<ArtifactRequestState | null>(null);
  const [requestVersion, setRequestVersion] = useState(0);
  const requestKey = `${slug ?? ""}\u0000${language}\u0000${requestVersion}`;

  useEffect(() => {
    if (!slug) {
      return;
    }

    const controller = new AbortController();

    getArtifact(slug, language, controller.signal)
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
              message: getErrorMessage(error, "Đã xảy ra lỗi khi tải hiện vật."),
            },
            statusCode: error instanceof ApiRequestError ? error.status : null,
          },
        });
      });

    return () => controller.abort();
  }, [slug, language, requestKey]);

  const retry = useCallback(() => {
    setRequestVersion((version) => version + 1);
  }, []);

  const state: AsyncData<ArtifactDetail> = !slug
    ? {
        status: "error",
        error: { message: "Không tìm thấy hiện vật" },
        statusCode: 404,
      }
    : requestState?.key === requestKey
      ? requestState.state
      : { status: "loading" };

  return {
    state,
    isNotFound: state.status === "error" && state.statusCode === 404,
    retry,
  };
}

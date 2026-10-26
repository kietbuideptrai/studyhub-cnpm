import { useCallback, useEffect, useState } from "react";
import { getArtifact } from "../api/client";
import { ApiRequestError } from "../api/client";
import type { ArtifactDetail, Language } from "../../../shared/types";
import type { AsyncData } from "./useArtifacts";

export interface UseArtifactResult {
  state: AsyncData<ArtifactDetail>;
  isNotFound: boolean;
  retry: () => void;
}

export function useArtifact(
  slug: string | undefined,
  language: Language,
): UseArtifactResult {
  const [state, setState] = useState<AsyncData<ArtifactDetail>>({
    status: "loading",
  });
  const [requestVersion, setRequestVersion] = useState(0);

  useEffect(() => {
    if (!slug) {
      setState({
        status: "error",
        error: { message: "Không tìm thấy hiện vật" },
        statusCode: 404,
      });
      return;
    }

    const controller = new AbortController();
    setState({ status: "loading" });

    getArtifact(slug, language, controller.signal)
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
                : "Đã xảy ra lỗi khi tải hiện vật.",
          },
          statusCode: error instanceof ApiRequestError ? error.status : null,
        });
      });

    return () => controller.abort();
  }, [slug, language, requestVersion]);

  const retry = useCallback(() => {
    setRequestVersion((version) => version + 1);
  }, []);

  return {
    state,
    isNotFound: state.status === "error" && state.statusCode === 404,
    retry,
  };
}

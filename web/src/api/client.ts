import type {
  ApiError,
  ArtifactDetail,
  ArtifactListItem,
  Language,
} from "../../../shared/types";

const API_BASE_URL = (import.meta.env.VITE_API_URL ?? "").replace(/\/+$/, "");

export class ApiRequestError extends Error {
  constructor(
    message: string,
    public readonly status: number | null,
  ) {
    super(message);
    this.name = "ApiRequestError";
  }
}

export function getArtifacts(
  language: Language,
  query?: string,
  signal?: AbortSignal,
): Promise<ArtifactListItem[]> {
  const searchParams = new URLSearchParams({ lang: language });
  if (query?.trim()) {
    searchParams.set("q", query.trim());
  }

  return request<ArtifactListItem[]>(
    `/api/artifacts?${searchParams.toString()}`,
    signal,
  );
}

export function getArtifact(
  slug: string,
  language: Language,
  signal?: AbortSignal,
): Promise<ArtifactDetail> {
  const searchParams = new URLSearchParams({ lang: language });
  return request<ArtifactDetail>(
    `/api/artifacts/${encodeURIComponent(slug)}?${searchParams.toString()}`,
    signal,
  );
}

async function request<T>(path: string, signal?: AbortSignal): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, { signal });
  } catch (error) {
    if (signal?.aborted) {
      throw error;
    }

    throw new ApiRequestError("Không thể kết nối máy chủ. Hãy kiểm tra mạng.", null);
  }

  if (!response.ok) {
    const apiError = await readApiError(response);
    throw new ApiRequestError(apiError.message, response.status);
  }

  try {
    return (await response.json()) as T;
  } catch {
    throw new ApiRequestError("Phản hồi từ máy chủ không hợp lệ.", response.status);
  }
}

async function readApiError(response: Response): Promise<ApiError> {
  try {
    const body: unknown = await response.json();
    if (
      typeof body === "object" &&
      body !== null &&
      "message" in body &&
      typeof body.message === "string"
    ) {
      return { message: body.message };
    }
  } catch {
    return { message: getStatusMessage(response.status) };
  }

  return { message: getStatusMessage(response.status) };
}

function getStatusMessage(status: number): string {
  if (status === 404) {
    return "Không tìm thấy hiện vật";
  }

  return "Không thể tải dữ liệu. Vui lòng thử lại.";
}

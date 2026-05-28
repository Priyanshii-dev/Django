import { parseAsInteger, parseAsString, parseAsStringLiteral } from "nuqs";

export const TASK_STATUS_VALUES = ["all", "completed", "pending"] as const;
export const TASK_SEARCH_DEBOUNCE_MS = 400;

export const taskQueryParams = {
  page: parseAsInteger.withDefault(1).withOptions({
    clearOnDefault: true,
  }),
  limit: parseAsInteger.withDefault(5).withOptions({
    clearOnDefault: true,
  }),
  search: parseAsString.withDefault("").withOptions({
    clearOnDefault: true,
  }),
  status: parseAsStringLiteral(TASK_STATUS_VALUES).withDefault("all").withOptions({
    clearOnDefault: true,
  }),
};

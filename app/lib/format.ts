import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime.js";

dayjs.extend(relativeTime);

type FormatOptions = {
  fromNow?: boolean;
};

export const formatDate = (date: Date | string, options?: FormatOptions) => {
  const { fromNow } = options || { fromNow: false };

  if (fromNow) {
    return dayjs().from(dayjs(date), true);
  }
  return dayjs(date).format("DD MMM YYYY");
};

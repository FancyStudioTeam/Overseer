import type { RateLimitManager } from "@sapphire/ratelimits";
import { Translations } from "@translations";
import type { Locales } from "@types";
import { createErrorMessage, formatUnix } from "@util/utils";
import type { AnyInteractionGateway } from "oceanic.js";

export const handleRateLimit = async (
  context: AnyInteractionGateway,
  rateLimiter: RateLimitManager,
  {
    locale,
  }: {
    locale: Locales;
  },
) => {
  const rateLimit = rateLimiter.acquire(context.user.id);
  const isRateLimited = rateLimit.limited;

  if (isRateLimited) {
    await createErrorMessage(
      context,
      Translations[locale].GLOBAL.USER_IS_LIMITED({
        resets: formatUnix(new Date(rateLimit.expires)),
      }),
    );
  }

  !isRateLimited && rateLimit.consume();

  return isRateLimited;
};

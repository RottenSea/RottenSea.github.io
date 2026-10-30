import { png, touchIcon } from "../utils/images";

/** The icon a phone puts on its home screen. */
export const GET = async () => png(await touchIcon(180));

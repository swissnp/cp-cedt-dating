import * as z from "zod";
export const onBoardingSchema = z.object({
  bio: z.string().min(1, "Please enter some text."),
  soad: z.boolean(),
});

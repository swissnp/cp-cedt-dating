import * as z from "zod";
export const onBoardingSchema = z.object({
  bio: z.string().min(1, "Please enter some text."),
  soad: z.boolean(),
});

export const VerificationEmailSchema = z.object({
  email: z.string().email('Please enter your email').endsWith("@student.chula.ac.th", "Email must be @student.chula.ac.th"),
});
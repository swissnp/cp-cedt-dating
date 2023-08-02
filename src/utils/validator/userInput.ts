import * as z from "zod";

export const interestsBaseSchema = z.array(z.object({
  value: z.string(),
  label: z.string(),
}))

export const interestsObjSchema = z.object({
  interests: interestsBaseSchema
})


export const onBoardingSchema = z.object({
  name : z.string().min(1, "Please enter your username."),
  bio: z.string().min(1, "Please enter some text."),
  soad: z.boolean(),
  interests: interestsBaseSchema,
});

export const VerificationEmailSchema = z.object({
  email: z.string().email('Please enter a valid email').endsWith("@student.chula.ac.th", "Email must be @student.chula.ac.th"),
});

export const IGHandleSchema = z.object({
  handle: z.string().min(1, "Please enter IG handle"),
})

export type IInterestsBase = z.infer<typeof interestsBaseSchema>;
export type IInterestsObj = z.infer<typeof interestsObjSchema>;
export type IOnBoarding = z.infer<typeof onBoardingSchema>;
export type IVerificationEmail = z.infer<typeof VerificationEmailSchema>;
export type IIGHandle = z.infer<typeof IGHandleSchema>;
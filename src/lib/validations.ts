import { AttendanceResponse, FeedbackRating, FeedbackType } from "@prisma/client";
import { z } from "zod";

export const guestLoginSchema = z.object({
  email: z.email("Bitte geben Sie eine gueltige E-Mail-Adresse ein."),
});

export const registrationSchema = z.object({
  phone: z.string().trim().optional(),
  attendanceResponse: z.nativeEnum(AttendanceResponse),
  dietaryRequirements: z.string().trim().optional(),
  accessibilityNeeds: z.string().trim().optional(),
  hotelRequired: z.boolean().default(false),
  arrivalInfo: z.string().trim().optional(),
  departureInfo: z.string().trim().optional(),
  workshopNotes: z.string().trim().optional(),
  selectedSessionIds: z.array(z.string()).default([]),
  privacyAccepted: z.boolean().refine((value) => value, {
    message: "Die Datenschutzinformation muss bestaetigt werden.",
  }),
  photoConsentAccepted: z.boolean().default(false),
});

export const attendeeInviteSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.email(),
  company: z.string().trim().optional(),
  title: z.string().trim().optional(),
});

export const sessionSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3),
  subtitle: z.string().trim().optional(),
  description: z.string().min(10),
  category: z.string().trim().optional(),
  tags: z.string().trim().optional(),
  startAt: z.string().min(1),
  endAt: z.string().min(1),
  roomId: z.string().trim().optional(),
  capacity: z.coerce.number().int().positive().optional(),
  featured: z.boolean().default(false),
  selectionEnabled: z.boolean().default(true),
  speakerIds: z.array(z.string()).default([]),
});

export const announcementSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3),
  body: z.string().min(10),
  audience: z.string().default("all"),
  pinned: z.boolean().default(false),
});

export const venueInfoSchema = z.object({
  id: z.string().optional(),
  key: z.string().min(2),
  title: z.string().min(2),
  content: z.string().min(10),
  sortOrder: z.coerce.number().int().default(0),
});

export const faqSchema = z.object({
  id: z.string().optional(),
  question: z.string().min(5),
  answer: z.string().min(10),
  sortOrder: z.coerce.number().int().default(0),
});

export const downloadSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3),
  description: z.string().trim().optional(),
  category: z.string().trim().optional(),
  fileName: z.string().min(3),
  fileUrl: z.string().min(1),
});

export const messageSchema = z.object({
  subject: z.string().min(3),
  body: z.string().min(10),
  audience: z.enum(["all", "registered", "declined", "checked_in", "hotel"]),
});

export const eventSettingsSchema = z.object({
  registrationOpen: z.boolean().default(true),
  attendeeSelectionOn: z.boolean().default(true),
  confirmationText: z.string().trim().optional(),
  privacyPolicyUrl: z.string().trim().optional(),
  legalNoticeUrl: z.string().trim().optional(),
});

export const feedbackSchema = z.object({
  sessionId: z.string().optional(),
  type: z.nativeEnum(FeedbackType),
  rating: z.nativeEnum(FeedbackRating),
  comment: z.string().trim().optional(),
});

export const checkInSchema = z.object({
  token: z.string().trim().optional(),
  attendeeId: z.string().trim().optional(),
  overrideReason: z.string().trim().optional(),
});

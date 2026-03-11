import crypto from "node:crypto";

import {
  AdminRole,
  AttendanceResponse,
  EmailType,
  FeedbackRating,
  FeedbackType,
  InvitationStatus,
  PrismaClient,
  RegistrationStatus,
  SessionSelectionStatus,
  UserKind,
} from "@prisma/client";

import { CONSENT_VERSION, DEFAULT_EVENT_SLUG } from "../src/lib/constants";

const prisma = new PrismaClient();

function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

const firstNames = [
  "Anna",
  "Lukas",
  "Miriam",
  "Sven",
  "Julia",
  "Daniel",
  "Leonie",
  "Tobias",
  "Katharina",
  "Niklas",
];

const lastNames = [
  "Mueller",
  "Schneider",
  "Fischer",
  "Wagner",
  "Becker",
  "Hoffmann",
  "Schulz",
  "Keller",
  "Richter",
  "Zimmermann",
];

async function main() {
  await prisma.feedback.deleteMany();
  await prisma.emailLog.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.checkIn.deleteMany();
  await prisma.sessionSelection.deleteMany();
  await prisma.consentRecord.deleteMany();
  await prisma.registration.deleteMany();
  await prisma.invitation.deleteMany();
  await prisma.attendee.deleteMany();
  await prisma.membership.deleteMany();
  await prisma.announcement.deleteMany();
  await prisma.downloadAsset.deleteMany();
  await prisma.venueInfo.deleteMany();
  await prisma.faqItem.deleteMany();
  await prisma.sessionModel.deleteMany();
  await prisma.speaker.deleteMany();
  await prisma.room.deleteMany();
  await prisma.event.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.verificationToken.deleteMany();
  await prisma.user.deleteMany();

  const event = await prisma.event.create({
    data: {
      slug: DEFAULT_EVENT_SLUG,
      name: "E.ON Vertriebskonferenz 2026",
      tagline: "Gemeinsam die naechste Vertriebsphase gestalten",
      description:
        "Geschlossene interne Vertriebskonferenz fuer eingeladene Gaeste mit Fokus auf Strategie, Marktimpulse und operative Zusammenarbeit.",
      timezone: "Europe/Berlin",
      startDate: new Date("2026-05-14T08:00:00.000Z"),
      endDate: new Date("2026-05-15T17:00:00.000Z"),
      locationName: "Messe Dortmund, Kongresszentrum",
      locationAddress: "Rheinlanddamm 200",
      locationCity: "44139 Dortmund",
      registrationOpen: true,
      attendeeSelectionOn: true,
      pwaEnabled: true,
      confirmationText:
        "Vielen Dank fuer Ihre Registrierung. Im Conference Companion finden Sie ab sofort Agenda, Logistik und alle aktuellen Hinweise.",
      privacyPolicyUrl: "/privacy-policy",
      legalNoticeUrl: "/legal",
    },
  });

  const [roomPlenum, roomStudio, roomLab, roomDinner] = await Promise.all([
    prisma.room.create({
      data: {
        eventId: event.id,
        name: "Plenarsaal",
        locationHint: "Ebene 1",
        capacity: 300,
      },
    }),
    prisma.room.create({
      data: {
        eventId: event.id,
        name: "Studio Nord",
        locationHint: "Ebene 2",
        capacity: 120,
      },
    }),
    prisma.room.create({
      data: {
        eventId: event.id,
        name: "Workshop Lab",
        locationHint: "Ebene 2",
        capacity: 90,
      },
    }),
    prisma.room.create({
      data: {
        eventId: event.id,
        name: "Abendlocation Phoenix",
        locationHint: "Shuttle ab Hoteleingang",
        capacity: 250,
      },
    }),
  ]);

  const speakers = await Promise.all([
    prisma.speaker.create({
      data: {
        eventId: event.id,
        name: "Dr. Elena Hofmann",
        role: "Chief Sales Officer",
        company: "E.ON Energie Deutschland",
        bio: "Elena Hofmann verantwortet die strategische Ausrichtung des B2B- und Privatkundenvertriebs und treibt datenbasierte Vertriebsmodelle voran.",
        imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80",
      },
    }),
    prisma.speaker.create({
      data: {
        eventId: event.id,
        name: "Matthias Reuter",
        role: "Director Business Development",
        company: "E.ON",
        bio: "Matthias Reuter fokussiert sich auf Marktpotenziale, neue Partnerschaften und skalierbare Vertriebshebel fuer komplexe Energieloesungen.",
        imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80",
      },
    }),
    prisma.speaker.create({
      data: {
        eventId: event.id,
        name: "Sophie Albrecht",
        role: "Head of Customer Experience",
        company: "E.ON",
        bio: "Sophie Albrecht gestaltet serviceorientierte Customer Journeys und verbindet vertriebliche Beratung mit digitaler Exzellenz.",
        imageUrl: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80",
      },
    }),
    prisma.speaker.create({
      data: {
        eventId: event.id,
        name: "Jonas Dietrich",
        role: "Lead Sales Enablement",
        company: "E.ON",
        bio: "Jonas Dietrich verantwortet Enablement-Programme, Best Practices und operative Tools fuer leistungsstarke Vertriebsteams.",
        imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80",
      },
    }),
  ]);

  const sessionData = [
    {
      title: "E.ON Vertriebsstrategie 2026",
      subtitle: "Keynote und strategischer Ausblick",
      description: "Management-Update zu Marktumfeld, Prioritaeten und Wachstumspfaden im Vertrieb.",
      category: "Keynote",
      tags: ["Strategie", "Plenum"],
      startAt: new Date("2026-05-14T08:30:00.000Z"),
      endAt: new Date("2026-05-14T09:30:00.000Z"),
      roomId: roomPlenum.id,
      featured: true,
      speakerIds: [speakers[0].id],
      selectionEnabled: false,
    },
    {
      title: "Breakout: Industriekunden entwickeln",
      subtitle: "Go-to-market fuer komplexe Loesungen",
      description: "Praxisnahe Impulse fuer Angebotsentwicklung, Account Priorisierung und Abschlussstaerke.",
      category: "Breakout",
      tags: ["B2B", "Industrie"],
      startAt: new Date("2026-05-14T10:00:00.000Z"),
      endAt: new Date("2026-05-14T11:00:00.000Z"),
      roomId: roomStudio.id,
      capacity: 80,
      featured: false,
      speakerIds: [speakers[1].id],
      selectionEnabled: true,
    },
    {
      title: "Breakout: Customer Experience als Vertriebshebel",
      subtitle: "Journey, Service und Conversion",
      description: "Wie Kundenerlebnisse, Service-Design und klare Kommunikation Vertriebsperformance verbessern.",
      category: "Breakout",
      tags: ["CX", "Digital"],
      startAt: new Date("2026-05-14T10:00:00.000Z"),
      endAt: new Date("2026-05-14T11:00:00.000Z"),
      roomId: roomLab.id,
      capacity: 60,
      featured: false,
      speakerIds: [speakers[2].id],
      selectionEnabled: true,
    },
    {
      title: "Sales Enablement Clinic",
      subtitle: "Playbooks, Prozesse und Tools",
      description: "Workshop zu praktischen Hilfsmitteln fuer eine konsistente Vertriebssteuerung im Alltag.",
      category: "Workshop",
      tags: ["Enablement", "Operations"],
      startAt: new Date("2026-05-14T13:30:00.000Z"),
      endAt: new Date("2026-05-14T15:00:00.000Z"),
      roomId: roomLab.id,
      capacity: 50,
      featured: true,
      speakerIds: [speakers[3].id],
      selectionEnabled: true,
    },
    {
      title: "Abendprogramm im Phoenix Areal",
      subtitle: "Dinner und informeller Austausch",
      description: "Gemeinsamer Abend mit Dinner, Networking und Blick auf zentrale Themen des ersten Konferenztages.",
      category: "Networking",
      tags: ["Dinner", "Networking"],
      startAt: new Date("2026-05-14T18:30:00.000Z"),
      endAt: new Date("2026-05-14T22:00:00.000Z"),
      roomId: roomDinner.id,
      featured: true,
      speakerIds: [],
      selectionEnabled: false,
    },
    {
      title: "Morning Briefing und Marktdaten",
      subtitle: "Tag 2 kompakt",
      description: "Daten, Pipeline-Entwicklung und Handlungsempfehlungen fuer die naechsten Monate.",
      category: "Plenum",
      tags: ["Daten", "Forecast"],
      startAt: new Date("2026-05-15T07:30:00.000Z"),
      endAt: new Date("2026-05-15T08:30:00.000Z"),
      roomId: roomPlenum.id,
      featured: false,
      speakerIds: [speakers[1].id, speakers[3].id],
      selectionEnabled: false,
    },
    {
      title: "Regionale Wachstumsinitiativen",
      subtitle: "Best Practices aus den Regionen",
      description: "Kurzformate aus den Regionen mit sofort uebertragbaren Ideen fuer Vertrieb und Stakeholder-Kommunikation.",
      category: "Panel",
      tags: ["Regionen", "Best Practice"],
      startAt: new Date("2026-05-15T09:00:00.000Z"),
      endAt: new Date("2026-05-15T10:00:00.000Z"),
      roomId: roomPlenum.id,
      featured: true,
      speakerIds: [speakers[0].id, speakers[2].id],
      selectionEnabled: false,
    },
    {
      title: "Workshop: Vertrieb und Accessibility",
      subtitle: "Barrierefreie Kommunikation in der Praxis",
      description: "Training zu klarer Kommunikation, barrierearmen Touchpoints und inklusiven Vertriebsunterlagen.",
      category: "Workshop",
      tags: ["Accessibility", "Kommunikation"],
      startAt: new Date("2026-05-15T10:30:00.000Z"),
      endAt: new Date("2026-05-15T11:30:00.000Z"),
      roomId: roomStudio.id,
      capacity: 40,
      featured: false,
      speakerIds: [speakers[2].id],
      selectionEnabled: true,
    },
  ];

  const sessions = await Promise.all(
    sessionData.map((session) =>
      prisma.sessionModel.create({
        data: {
          eventId: event.id,
          roomId: session.roomId,
          title: session.title,
          subtitle: session.subtitle,
          description: session.description,
          category: session.category,
          tags: session.tags,
          startAt: session.startAt,
          endAt: session.endAt,
          capacity: session.capacity,
          featured: session.featured,
          selectionEnabled: session.selectionEnabled,
          speakers: {
            connect: session.speakerIds.map((id) => ({ id })),
          },
        },
      }),
    ),
  );

  await prisma.announcement.createMany({
    data: [
      {
        eventId: event.id,
        title: "Shuttle-Zeiten aktualisiert",
        body: "Der erste Shuttle vom Konferenzhotel startet am 14. Mai bereits um 07:30 Uhr. Bitte planen Sie entsprechend.",
        audience: "all",
        pinned: true,
        publishedAt: new Date("2026-05-10T09:00:00.000Z"),
      },
      {
        eventId: event.id,
        title: "Speaker Briefing verfuegbar",
        body: "Die aktualisierte Moderations- und Speaker-Info steht im Download-Bereich bereit.",
        audience: "registered",
        pinned: false,
        publishedAt: new Date("2026-05-11T11:15:00.000Z"),
      },
      {
        eventId: event.id,
        title: "Dinner Dress Code",
        body: "Business Casual fuer das Abendprogramm im Phoenix Areal.",
        audience: "registered",
        pinned: false,
        publishedAt: new Date("2026-05-12T14:00:00.000Z"),
      },
    ],
  });

  await prisma.downloadAsset.createMany({
    data: [
      {
        eventId: event.id,
        title: "Konferenzleitfaden",
        description: "Ablauf, Ansprechpartner und Lageplan.",
        category: "Briefing",
        fileName: "konferenzleitfaden.pdf",
        fileUrl: "/docs/konferenzleitfaden.pdf",
      },
      {
        eventId: event.id,
        title: "Hotel- und Shuttleinformationen",
        description: "Anreise, Transfer und Hotelcheck-in.",
        category: "Logistik",
        fileName: "hotel-shuttle-info.pdf",
        fileUrl: "/docs/hotel-shuttle-info.pdf",
      },
      {
        eventId: event.id,
        title: "Venue Map",
        description: "Orientierung im Kongresszentrum.",
        category: "Map",
        fileName: "venue-map.pdf",
        fileUrl: "/docs/venue-map.pdf",
      },
    ],
  });

  await prisma.venueInfo.createMany({
    data: [
      {
        eventId: event.id,
        key: "venue",
        title: "Venue",
        content: "Messe Dortmund, Kongresszentrum, Rheinlanddamm 200, 44139 Dortmund.",
        sortOrder: 1,
      },
      {
        eventId: event.id,
        key: "parking",
        title: "Parken",
        content: "Kostenfreie Parkplaetze P4 und P5 stehen fuer Konferenzgaeste zur Verfuegung.",
        sortOrder: 2,
      },
      {
        eventId: event.id,
        key: "shuttle",
        title: "Shuttle",
        content: "Shuttle-Service zwischen Hotel und Venue alle 30 Minuten von 07:30 bis 22:30 Uhr.",
        sortOrder: 3,
      },
      {
        eventId: event.id,
        key: "hotel",
        title: "Hotel",
        content: "Kontingent im Radisson Blu Dortmund mit individuellem Check-in Code fuer registrierte Teilnehmende.",
        sortOrder: 4,
      },
      {
        eventId: event.id,
        key: "wifi",
        title: "WLAN",
        content: "SSID: EON-Conference | Passwort: Companion2026",
        sortOrder: 5,
      },
      {
        eventId: event.id,
        key: "emergency",
        title: "Notfallkontakt",
        content: "Event Desk: +49 30 1234 2026 | Security vor Ort: +49 231 555 880",
        sortOrder: 6,
      },
    ],
  });

  await prisma.faqItem.createMany({
    data: [
      {
        eventId: event.id,
        question: "Wann schliesst die Registrierung?",
        answer: "Die digitale Registrierung bleibt bis einschliesslich 12. Mai 2026 geoefnet.",
        sortOrder: 1,
      },
      {
        eventId: event.id,
        question: "Kann ich meine Session-Auswahl spaeter aendern?",
        answer: "Ja, solange die jeweilige Session nicht ausgebucht ist.",
        sortOrder: 2,
      },
      {
        eventId: event.id,
        question: "Wie erhalte ich mein Hotelzimmer?",
        answer: "Ihr Hotelbedarf wird ueber die Registrierung erfasst. Details folgen in der Bestaetigungs-E-Mail.",
        sortOrder: 3,
      },
    ],
  });

  const adminUsers = await Promise.all([
    prisma.user.create({
      data: {
        name: "Laura Admin",
        email: "laura.admin@eon.example",
        kind: UserKind.ADMIN,
      },
    }),
    prisma.user.create({
      data: {
        name: "Max Checkin",
        email: "max.checkin@eon.example",
        kind: UserKind.ADMIN,
      },
    }),
  ]);

  await prisma.membership.createMany({
    data: [
      {
        eventId: event.id,
        userId: adminUsers[0].id,
        role: AdminRole.SUPER_ADMIN,
      },
      {
        eventId: event.id,
        userId: adminUsers[0].id,
        role: AdminRole.EVENT_ADMIN,
      },
      {
        eventId: event.id,
        userId: adminUsers[1].id,
        role: AdminRole.CHECKIN_STAFF,
      },
    ],
  });

  for (let index = 0; index < 50; index += 1) {
    const firstName = firstNames[index % firstNames.length];
    const lastName = `${lastNames[index % lastNames.length]}-${index + 1}`;
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase().replace(/[^a-z0-9]+/g, "")}@partner.example`;
    const inviteToken = crypto.randomBytes(24).toString("base64url");
    const invitationStatus = index < 32 ? InvitationStatus.REGISTERED : index < 40 ? InvitationStatus.SENT : InvitationStatus.DRAFT;
    const registrationStatus =
      index < 28 ? RegistrationStatus.COMPLETED : index < 32 ? RegistrationStatus.DECLINED : RegistrationStatus.PENDING;
    const attendanceResponse =
      index < 28 ? AttendanceResponse.YES : index < 32 ? AttendanceResponse.NO : AttendanceResponse.UNDECIDED;

    const attendee = await prisma.attendee.create({
      data: {
        eventId: event.id,
        firstName,
        lastName,
        email,
        company: index % 2 === 0 ? "E.ON Energie Deutschland" : "Partnernetzwerk Nord",
        title: index % 3 === 0 ? "Regional Sales Lead" : "Account Manager",
        phone: `+49 170 100${String(index).padStart(2, "0")}`,
        invitationStatus,
        registrationStatus,
        attendanceResponse,
        dietaryRequirements: index % 7 === 0 ? "Vegetarisch" : null,
        accessibilityNeeds: index % 11 === 0 ? "Barrierefreier Zugang benoetigt" : null,
        hotelRequired: index % 4 === 0,
        arrivalInfo: index < 32 ? "Anreise per Bahn am Vorabend" : null,
        departureInfo: index < 32 ? "Rueckreise am 15. Mai ab 17:30 Uhr" : null,
        invitedAt: new Date("2026-04-08T09:00:00.000Z"),
        registeredAt: index < 32 ? new Date("2026-04-12T10:00:00.000Z") : null,
        checkedInAt: index < 20 ? new Date("2026-05-14T08:10:00.000Z") : null,
      },
    });

    await prisma.invitation.create({
      data: {
        attendeeId: attendee.id,
        status: invitationStatus,
        tokenHash: hashToken(inviteToken),
        tokenLastFour: inviteToken.slice(-4),
        sentAt: invitationStatus !== InvitationStatus.DRAFT ? new Date("2026-04-08T09:00:00.000Z") : null,
        openedAt: invitationStatus === InvitationStatus.REGISTERED ? new Date("2026-04-10T08:00:00.000Z") : null,
        expiresAt: new Date("2026-05-13T23:59:59.000Z"),
      },
    });

    if (registrationStatus !== RegistrationStatus.PENDING) {
      const registration = await prisma.registration.create({
        data: {
          attendeeId: attendee.id,
          status: registrationStatus,
          attendanceResponse,
          phone: attendee.phone,
          dietaryRequirements: attendee.dietaryRequirements,
          accessibilityNeeds: attendee.accessibilityNeeds,
          hotelRequired: attendee.hotelRequired,
          arrivalInfo: attendee.arrivalInfo,
          departureInfo: attendee.departureInfo,
          workshopNotes: index % 5 === 0 ? "Interesse an praxisnahen Session-Formaten." : null,
          privacyAccepted: true,
          photoConsentAccepted: index % 6 !== 0,
        },
      });

      await prisma.consentRecord.createMany({
        data: [
          {
            attendeeId: attendee.id,
            registrationId: registration.id,
            consentKey: "privacy_policy",
            accepted: true,
            version: CONSENT_VERSION,
          },
          {
            attendeeId: attendee.id,
            registrationId: registration.id,
            consentKey: "photo_video",
            accepted: index % 6 !== 0,
            version: CONSENT_VERSION,
          },
        ],
      });
    }

    if (attendanceResponse === AttendanceResponse.YES) {
      const sessionId = index % 2 === 0 ? sessions[1].id : sessions[2].id;
      await prisma.sessionSelection.create({
        data: {
          attendeeId: attendee.id,
          sessionId,
          status: SessionSelectionStatus.CONFIRMED,
        },
      });

      if (index % 3 === 0) {
        await prisma.sessionSelection.create({
          data: {
            attendeeId: attendee.id,
            sessionId: sessions[3].id,
            status: SessionSelectionStatus.CONFIRMED,
          },
        });
      }
    }

    if (index < 20) {
      await prisma.checkIn.create({
        data: {
          eventId: event.id,
          attendeeId: attendee.id,
          createdById: adminUsers[1].id,
          method: "QR",
        },
      });
    }
  }

  const sampleAttendee = await prisma.attendee.findFirstOrThrow({
    where: {
      registrationStatus: RegistrationStatus.COMPLETED,
    },
  });

  await prisma.emailLog.createMany({
    data: [
      {
        attendeeId: sampleAttendee.id,
        eventId: event.id,
        recipient: sampleAttendee.email,
        subject: "Ihre Einladung zur E.ON Vertriebskonferenz 2026",
        status: "seeded",
        type: EmailType.INVITATION,
      },
      {
        attendeeId: sampleAttendee.id,
        eventId: event.id,
        recipient: sampleAttendee.email,
        subject: "Ihre Registrierung wurde gespeichert",
        status: "seeded",
        type: EmailType.REGISTRATION_CONFIRMATION,
      },
    ],
  });

  await prisma.feedback.createMany({
    data: [
      {
        eventId: event.id,
        attendeeId: sampleAttendee.id,
        type: FeedbackType.EVENT,
        rating: FeedbackRating.GOOD,
        comment: "Sehr klarer Ablauf und starke inhaltliche Impulse fuer den Vertrieb.",
      },
      {
        eventId: event.id,
        attendeeId: sampleAttendee.id,
        sessionId: sessions[1].id,
        type: FeedbackType.SESSION,
        rating: FeedbackRating.EXCELLENT,
        comment: "Praxisnah und direkt auf aktuelle Kundensituationen anwendbar.",
      },
    ],
  });

  console.info("Seed completed", {
    eventSlug: event.slug,
    adminLoginEmail: adminUsers[0].email,
    checkinStaffEmail: adminUsers[1].email,
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

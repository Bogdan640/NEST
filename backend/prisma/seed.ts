import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function executeSeeding() {
  const defaultPasswordHash = await bcrypt.hash('parola123', 10);

  // ── 1. Users ─────────────────────────────────────────────────
  const predefinedUsers = [
    {
      email: 'magdalena.potarniche@nest.local',
      passwordHash: defaultPasswordHash,
      firstName: 'Magdalena',
      lastName: 'Potârniche',
      apartmentNumber: '12A',
      phoneNumber: '0712345678',
      headline: 'Librarian & Cat Lover 🐱',
      about: 'Living in Bloc A1 since 2018. I love organizing community events and sharing books with neighbors.',
      role: 'RESIDENT',
      isVerified: true
    },
    {
      email: 'relizeanu.eusebiu@nest.local',
      passwordHash: defaultPasswordHash,
      firstName: 'Eusebiu',
      lastName: 'Relizeanu',
      apartmentNumber: '5B',
      phoneNumber: '0723456789',
      headline: 'IT Engineer & Weekend Chef',
      about: 'Software developer by day, amateur chef by night. Always happy to lend a hand (or a power drill).',
      role: 'RESIDENT',
      isVerified: true
    },
    {
      email: 'marius.scrum@nest.local',
      passwordHash: defaultPasswordHash,
      firstName: 'Marius',
      lastName: 'Scrum',
      apartmentNumber: '44C',
      phoneNumber: '0734567890',
      headline: 'Block Administrator',
      about: 'Building administrator since 2020. Responsible for maintenance coordination and resident onboarding. Feel free to reach out!',
      role: 'ADMIN',
      isVerified: true
    },
    {
      email: 'valeria.trotineta@nest.local',
      passwordHash: defaultPasswordHash,
      firstName: 'Valeria',
      lastName: 'Trotinetă',
      apartmentNumber: '8D',
      phoneNumber: '0745678901',
      headline: 'Yoga Instructor & Plant Mom 🌿',
      about: 'Passionate about wellness, sustainability, and building a greener community. I teach yoga every Saturday morning!',
      role: 'RESIDENT',
      isVerified: true
    },
    {
      email: 'dorel.mesteru@nest.local',
      passwordHash: defaultPasswordHash,
      firstName: 'Dorel',
      lastName: 'Meșteru',
      apartmentNumber: 'Subsol2',
      phoneNumber: '0756789012',
      headline: 'Retired Engineer & Handyman 🔧',
      about: 'Retired mechanical engineer. I have every tool imaginable and I am always happy to help with repairs around the block.',
      role: 'RESIDENT',
      isVerified: true
    }
  ];

  // Upsert users
  const userRecords: Record<string, any> = {};
  for (const userData of predefinedUsers) {
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {
        headline: userData.headline,
        about: userData.about
      },
      create: userData
    });
    userRecords[userData.email] = user;
  }

  const magdalena = userRecords['magdalena.potarniche@nest.local'];
  const eusebiu   = userRecords['relizeanu.eusebiu@nest.local'];
  const marius    = userRecords['marius.scrum@nest.local'];
  const valeria   = userRecords['valeria.trotineta@nest.local'];
  const dorel     = userRecords['dorel.mesteru@nest.local'];

  // ── 2. Block ─────────────────────────────────────────────────
  let block = await prisma.block.findFirst({ where: { code: 'NEST-BLOC-A1' } });
  if (!block) {
    block = await prisma.block.create({
      data: {
        name: 'Bloc A1',
        address: 'Str. Exemplu Nr. 10, Bloc A1',
        code: 'NEST-BLOC-A1',
        adminId: marius.id
      }
    });
  }

  // Ensure all users belong to the block
  await prisma.user.updateMany({
    where: { email: { in: predefinedUsers.map(u => u.email) } },
    data: { blockId: block.id }
  });

  // ── 3. Clear existing content data (keep users & block) ──────
  await prisma.parkingApplication.deleteMany();
  await prisma.parkingAnnouncement.deleteMany();
  await prisma.parkingSlot.deleteMany();
  await prisma.resourceReservation.deleteMany();
  await prisma.resource.deleteMany();
  await prisma.eventAttendee.deleteMany();
  await prisma.event.deleteMany();
  await prisma.post.deleteMany();
  await prisma.joinRequest.deleteMany();

  // ── 4. Community Feed Posts ──────────────────────────────────
  const now = new Date();
  const daysAgo = (d: number) => new Date(now.getTime() - d * 24 * 60 * 60 * 1000);

  await prisma.post.createMany({
    data: [
      {
        content: '🎉 Welcome to NEST! Our building community platform is now live. Feel free to explore the Feed, share tools in the Shed, coordinate parking, and join events. Let\'s make Bloc A1 the friendliest building in the neighborhood!',
        authorId: marius.id,
        createdAt: daysAgo(14)
      },
      {
        content: '📢 Reminder: The elevator maintenance is scheduled for this Thursday between 09:00 and 13:00. Please use the staircase during this time. Sorry for the inconvenience!',
        authorId: marius.id,
        createdAt: daysAgo(10)
      },
      {
        content: 'Good morning, neighbors! I just listed my power drill and jigsaw in the Shared Shed. If anyone needs them for a weekend project, feel free to request a borrow. Happy to help! 🔧',
        authorId: dorel.id,
        createdAt: daysAgo(8)
      },
      {
        content: 'Does anyone know a reliable plumber? My kitchen faucet has been leaking for two days. Any recommendations would be greatly appreciated! 🙏',
        authorId: magdalena.id,
        createdAt: daysAgo(7)
      },
      {
        content: 'I highly recommend Mr. Ionescu from down the street — he fixed my bathroom pipes last month and charged very fairly. I can share his number privately if you\'d like, Magdalena!',
        authorId: eusebiu.id,
        createdAt: daysAgo(7)
      },
      {
        content: '🧘 Saturday morning yoga in the courtyard is back! Join me this weekend at 08:00 near the benches by the playground. All levels welcome, just bring a mat. See the Events section for details!',
        authorId: valeria.id,
        createdAt: daysAgo(5)
      },
      {
        content: 'I will be away next week (Monday to Friday) and my parking spot P-03 will be free. I\'ve listed it on the Parking module — first come, first served! 🚗',
        authorId: magdalena.id,
        createdAt: daysAgo(3)
      },
      {
        content: '🌻 Spring cleaning day was a huge success! Thank you to everyone who helped clean the staircase and the courtyard area. Our building has never looked better. Proud of this community!',
        authorId: marius.id,
        createdAt: daysAgo(1)
      }
    ]
  });

  // ── 5. Shared Shed Resources ─────────────────────────────────
  const drill = await prisma.resource.create({
    data: {
      name: 'Bosch Power Drill',
      description: 'Professional 750W impact drill with carrying case. Comes with a full set of drill bits for wood, metal, and concrete.',
      type: 'TOOLS',
      ownerId: dorel.id,
      createdAt: daysAgo(8)
    }
  });

  const jigsaw = await prisma.resource.create({
    data: {
      name: 'Makita Jigsaw',
      description: 'Variable speed jigsaw, perfect for cutting wood panels, laminate, and plastic sheets. Very quiet motor.',
      type: 'TOOLS',
      ownerId: dorel.id,
      createdAt: daysAgo(8)
    }
  });

  const ladder = await prisma.resource.create({
    data: {
      name: 'Aluminium Ladder (3m)',
      description: 'Lightweight foldable aluminium ladder, extends up to 3 meters. Great for painting ceilings or changing light bulbs.',
      type: 'TOOLS',
      ownerId: eusebiu.id,
      createdAt: daysAgo(6)
    }
  });

  const projector = await prisma.resource.create({
    data: {
      name: 'Epson Mini Projector',
      description: 'Portable HD projector with HDMI input. Perfect for movie nights in the courtyard or living room presentations.',
      type: 'ELECTRONICS',
      ownerId: eusebiu.id,
      createdAt: daysAgo(5)
    }
  });

  const breadMaker = await prisma.resource.create({
    data: {
      name: 'Moulinex Bread Maker',
      description: 'Automatic bread maker with 12 programs. Makes fresh bread, pizza dough, and even jam. Includes recipe book.',
      type: 'KITCHEN',
      ownerId: magdalena.id,
      createdAt: daysAgo(4)
    }
  });

  const yogaMats = await prisma.resource.create({
    data: {
      name: 'Yoga Mat Set (3 mats)',
      description: 'Set of 3 extra-thick yoga mats (6mm). Non-slip surface, suitable for indoor and outdoor use.',
      type: 'SPORTS',
      ownerId: valeria.id,
      createdAt: daysAgo(5)
    }
  });

  const pressureWasher = await prisma.resource.create({
    data: {
      name: 'Kärcher Pressure Washer',
      description: 'High-pressure washer (130 bar) for cleaning patios, cars, and building facades. Includes foam lance attachment.',
      type: 'TOOLS',
      ownerId: dorel.id,
      createdAt: daysAgo(3)
    }
  });

  // ── 5b. Resource Reservations (borrowing history) ────────────
  // Completed borrow — Eusebiu borrowed Dorel's drill
  await prisma.resourceReservation.create({
    data: {
      resourceId: drill.id,
      borrowerId: eusebiu.id,
      startTime: daysAgo(7),
      endTime: daysAgo(5),
      status: 'RETURNED',
      createdAt: daysAgo(7)
    }
  });

  // Active borrow — Magdalena is currently borrowing the projector
  await prisma.resourceReservation.create({
    data: {
      resourceId: projector.id,
      borrowerId: magdalena.id,
      startTime: daysAgo(2),
      endTime: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
      status: 'APPROVED',
      createdAt: daysAgo(2)
    }
  });

  // Pending request — Valeria wants to borrow the bread maker
  await prisma.resourceReservation.create({
    data: {
      resourceId: breadMaker.id,
      borrowerId: valeria.id,
      startTime: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000),
      endTime: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000),
      status: 'PENDING',
      createdAt: daysAgo(1)
    }
  });

  // Returned — Marius borrowed the ladder
  await prisma.resourceReservation.create({
    data: {
      resourceId: ladder.id,
      borrowerId: marius.id,
      startTime: daysAgo(10),
      endTime: daysAgo(8),
      status: 'RETURNED',
      createdAt: daysAgo(10)
    }
  });

  // Pending request — Marius wants to borrow the pressure washer
  await prisma.resourceReservation.create({
    data: {
      resourceId: pressureWasher.id,
      borrowerId: marius.id,
      startTime: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
      endTime: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
      status: 'PENDING',
      createdAt: daysAgo(0)
    }
  });

  // ── 6. Events ────────────────────────────────────────────────
  // Past event — Spring Cleaning Day
  const springCleaning = await prisma.event.create({
    data: {
      title: 'Spring Cleaning Day 🌻',
      description: 'Let\'s come together to clean the staircase, hallways, and courtyard. Cleaning supplies will be provided by the building administration. Refreshments afterwards!',
      location: 'Building Courtyard & Staircase',
      type: 'COMMUNITY',
      startTime: daysAgo(2),
      endTime: new Date(daysAgo(2).getTime() + 4 * 60 * 60 * 1000),
      maxParticipants: 20,
      visibility: 'ALL',
      creatorId: marius.id,
      createdAt: daysAgo(6)
    }
  });

  // Upcoming event — Saturday Yoga
  const yogaEvent = await prisma.event.create({
    data: {
      title: 'Saturday Morning Yoga 🧘',
      description: 'Relaxing morning yoga session suitable for all levels. We practice gentle stretching, breathing exercises, and meditation. Bring your own mat or borrow one from Valeria\'s Shared Shed listing!',
      location: 'Courtyard — Near the Playground Benches',
      type: 'SPORTS',
      startTime: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000),
      endTime: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000 + 9.5 * 60 * 60 * 1000),
      maxParticipants: 12,
      visibility: 'ALL',
      creatorId: valeria.id,
      createdAt: daysAgo(5)
    }
  });

  // Upcoming event — Movie Night
  const movieNight = await prisma.event.create({
    data: {
      title: 'Outdoor Movie Night 🎬',
      description: 'Bring blankets and snacks! We\'ll project a family-friendly movie on the courtyard wall using Eusebiu\'s projector. Popcorn provided!',
      location: 'Building Courtyard (South Wall)',
      type: 'SOCIAL',
      startTime: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000 + 20 * 60 * 60 * 1000),
      endTime: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000 + 23 * 60 * 60 * 1000),
      maxParticipants: 30,
      visibility: 'ALL',
      creatorId: eusebiu.id,
      createdAt: daysAgo(2)
    }
  });

  // Upcoming event — Block Assembly
  const blockAssembly = await prisma.event.create({
    data: {
      title: 'Quarterly Block Assembly 📋',
      description: 'Official quarterly meeting to discuss building maintenance budget, upcoming renovation plans, and resident proposals. Attendance is strongly encouraged.',
      location: 'Ground Floor Meeting Room',
      type: 'MEETING',
      startTime: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000 + 18 * 60 * 60 * 1000),
      endTime: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000 + 20 * 60 * 60 * 1000),
      maxParticipants: 50,
      visibility: 'ALL',
      creatorId: marius.id,
      createdAt: daysAgo(1)
    }
  });

  // ── 6b. Event Attendees ──────────────────────────────────────
  // Spring Cleaning — 4 people attended
  await prisma.eventAttendee.createMany({
    data: [
      { userId: marius.id, eventId: springCleaning.id, status: 'JOINED' },
      { userId: dorel.id, eventId: springCleaning.id, status: 'JOINED' },
      { userId: eusebiu.id, eventId: springCleaning.id, status: 'JOINED' },
      { userId: valeria.id, eventId: springCleaning.id, status: 'JOINED' }
    ]
  });

  // Saturday Yoga — 3 RSVPs
  await prisma.eventAttendee.createMany({
    data: [
      { userId: valeria.id, eventId: yogaEvent.id, status: 'JOINED' },
      { userId: magdalena.id, eventId: yogaEvent.id, status: 'JOINED' },
      { userId: eusebiu.id, eventId: yogaEvent.id, status: 'JOINED' }
    ]
  });

  // Movie Night — 4 RSVPs
  await prisma.eventAttendee.createMany({
    data: [
      { userId: eusebiu.id, eventId: movieNight.id, status: 'JOINED' },
      { userId: magdalena.id, eventId: movieNight.id, status: 'JOINED' },
      { userId: dorel.id, eventId: movieNight.id, status: 'JOINED' },
      { userId: valeria.id, eventId: movieNight.id, status: 'JOINED' }
    ]
  });

  // Block Assembly — 2 RSVPs so far
  await prisma.eventAttendee.createMany({
    data: [
      { userId: marius.id, eventId: blockAssembly.id, status: 'JOINED' },
      { userId: dorel.id, eventId: blockAssembly.id, status: 'JOINED' }
    ]
  });

  // ── 7. Parking Slots ────────────────────────────────────────
  const slotP01 = await prisma.parkingSlot.create({
    data: { identifier: 'P-01', ownerId: marius.id }
  });

  const slotP02 = await prisma.parkingSlot.create({
    data: { identifier: 'P-02', ownerId: eusebiu.id }
  });

  const slotP03 = await prisma.parkingSlot.create({
    data: { identifier: 'P-03', ownerId: magdalena.id }
  });

  const slotP04 = await prisma.parkingSlot.create({
    data: { identifier: 'P-04', ownerId: dorel.id }
  });

  // ── 7b. Parking Announcements & Applications ────────────────
  // Magdalena's spot is available next week (she posted about it in the feed)
  const announcement1 = await prisma.parkingAnnouncement.create({
    data: {
      parkingSlotId: slotP03.id,
      publisherId: magdalena.id,
      availableFrom: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000),
      availableTo: new Date(now.getTime() + 6 * 24 * 60 * 60 * 1000),
      createdAt: daysAgo(3)
    }
  });

  // Two applications for Magdalena's spot
  await prisma.parkingApplication.create({
    data: {
      announcementId: announcement1.id,
      applicantId: valeria.id,
      status: 'APPROVED',
      createdAt: daysAgo(2)
    }
  });
  await prisma.parkingApplication.create({
    data: {
      announcementId: announcement1.id,
      applicantId: eusebiu.id,
      status: 'DENIED',
      createdAt: daysAgo(2)
    }
  });

  // Dorel's spot available this weekend
  const announcement2 = await prisma.parkingAnnouncement.create({
    data: {
      parkingSlotId: slotP04.id,
      publisherId: dorel.id,
      availableFrom: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
      availableTo: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000),
      createdAt: daysAgo(1)
    }
  });

  // One pending application for Dorel's spot
  await prisma.parkingApplication.create({
    data: {
      announcementId: announcement2.id,
      applicantId: marius.id,
      status: 'PENDING',
      createdAt: daysAgo(0)
    }
  });

  // Past completed — Eusebiu shared his spot last week
  const announcement3 = await prisma.parkingAnnouncement.create({
    data: {
      parkingSlotId: slotP02.id,
      publisherId: eusebiu.id,
      availableFrom: daysAgo(9),
      availableTo: daysAgo(5),
      createdAt: daysAgo(11)
    }
  });

  await prisma.parkingApplication.create({
    data: {
      announcementId: announcement3.id,
      applicantId: dorel.id,
      status: 'APPROVED',
      createdAt: daysAgo(10)
    }
  });

  // ── 8. Join Requests (one approved, for demo) ────────────────
  await prisma.joinRequest.createMany({
    data: [
      { userId: magdalena.id, blockId: block.id, status: 'APPROVED', createdAt: daysAgo(60) },
      { userId: eusebiu.id, blockId: block.id, status: 'APPROVED', createdAt: daysAgo(55) },
      { userId: valeria.id, blockId: block.id, status: 'APPROVED', createdAt: daysAgo(45) },
      { userId: dorel.id, blockId: block.id, status: 'APPROVED', createdAt: daysAgo(40) }
    ]
  });

  console.log('✅ Seed completed successfully! Demo data is ready for presentation.');
  console.log('   📝 8 Feed Posts');
  console.log('   🔧 7 Shared Shed Resources + 5 Reservations');
  console.log('   📅 4 Events + 13 Attendee RSVPs');
  console.log('   🚗 4 Parking Slots + 3 Announcements + 4 Applications');
}

executeSeeding()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (executionError) => {
    console.error(executionError);
    await prisma.$disconnect();
    process.exit(1);
  });

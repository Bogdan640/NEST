import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prismaClientInstance = new PrismaClient();

async function executeSeeding() {
  const defaultPasswordHash = await bcrypt.hash('parola123', 10);

  const predefinedUsers = [
    {
      email: 'magdalena.potarniche@nest.local',
      passwordHash: defaultPasswordHash,
      firstName: 'Magdalena',
      lastName: 'Potârniche',
      apartmentNumber: '12A',
      phoneNumber: '0712345678',
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
      role: 'RESIDENT',
      isVerified: true
    }
  ];

  for (const userRecord of predefinedUsers) {
    const existingUserRecord = await prismaClientInstance.user.findUnique({
      where: { email: userRecord.email }
    });
    if (!existingUserRecord) {
      await prismaClientInstance.user.create({ data: userRecord });
    }
  }
}

executeSeeding()
  .then(async () => {
    await prismaClientInstance.$disconnect();
  })
  .catch(async (executionError) => {
    console.error(executionError);
    await prismaClientInstance.$disconnect();
    process.exit(1);
  });

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      id: "a0e2e94e-f1e6-4bbd-9302-c4ac6c69e1fe",

      email: "example@gmail.com",

      password: "123456",
    },
  });

  const accounts = await prisma.accounts.create({
    data: {
      id: "a0e2e94e-f1e6-4bbd-9302-c4ac6c69e1fe",
      name: "John Doe",
      score: 4537,
      progress: [654, 754, 786, 987, 1047],
      day_streak: ["2022-05-18", "2022-05-28"],
      wordsets_user: [
        {
          id: "37ce6c59-04d2-4a6f-8e81-1f3a9b3a8a2e",
          words: [
            {
              id: "f5a94aa4-7f07-4a2d-94a1-8f6f2e9de85a",
              wrong: 0,
              done: false,
              star: false,
            },
            {
              id: "cd4aa583-d10e-4bb9-aa8e-66d76f0077e2",
              wrong: 0,
              done: false,
              star: false,
            },
          ],
        },
      ],
    },
  });

  const wordsets = await prisma.wordsets.create({
    data: {
      id: "37ce6c59-04d2-4a6f-8e81-1f3a9b3a8a2e",
      title: "French Vocabulary",
      description: "A set of French words and their meanings",
      words: [
        {
          id: "f5a94aa4-7f07-4a2d-94a1-8f6f2e9de85a",
          word: "city",
          definition: "ville",
        },
        {
          id: "cd4aa583-d10e-4bb9-aa8e-66d76f0077e2",
          word: "hello",
          definition: "bonjour",
        },
      ],
    },
  });

  const publicData = await prisma.publicData.create({
    data: {
      name: "John Doe",
      score: 4537,
    },
  });

  console.log(user);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })

  .catch(async (e) => {
    console.error(e);

    await prisma.$disconnect();

    process.exit(1);
  });

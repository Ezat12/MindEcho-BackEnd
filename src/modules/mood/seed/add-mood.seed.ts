import { prisma } from "../../../config/prisma.js";
import type { Mood } from "../domain/mood.js";

const seedMoods = async () => {
  const moods = [
    {
      name: "Happy",
      slug: "happy",
      icon: "😊",
      description: "Feeling joyful and content",
    },
    {
      name: "Sad",
      slug: "sad",
      icon: "😢",
      description: "Feeling down or depressed",
    },
    {
      name: "Angry",
      slug: "angry",
      icon: "😠",
      description: "Feeling mad or frustrated",
    },
    {
      name: "Anxious",
      slug: "anxious",
      icon: "😰",
      description: "Feeling worried or nervous",
    },
    {
      name: "stressed",
      slug: "stressed",
      icon: "😫",
      description: "Feeling overwhelmed or under pressure",
    },
    {
      name: "Relaxed",
      slug: "relaxed",
      icon: "😌",
      description: "Feeling calm and at ease",
    },
    {
      name: "depressed",
      slug: "depressed",
      icon: "😞",
      description: "Feeling very sad or hopeless",
    },
    {
      name: "frustrated",
      slug: "frustrated",
      icon: "😤",
      description:
        "Feeling annoyed or upset due to inability to change or achieve something",
    },
  ];

  await prisma.moods.createMany({
    data: moods,
    skipDuplicates: true,
  });
};

seedMoods()
  .then(() => {
    console.log("Moods seeded successfully");
  })
  .catch((error) => {
    console.error("Error seeding moods:", error);
  })
  .finally(() => {
    process.exit();
  });

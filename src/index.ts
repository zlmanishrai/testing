import express from "express";
import { PrismaClient } from "@prisma/client";
import cors from "cors";
import { sign } from "./utils/jwt-token";

const app = express();

app.use(express.json());
app.use(cors());

const prisma = new PrismaClient();

// app.get("/", async (req, res) => {
//   const students = await prisma.student.findMany({
//     include: {
//       Course: true,
//     },
//   });
//   res.json({ data: students });
// });
app.get("/", async (req, res) => {
  console.log("ssd");
  const students = await prisma.student.findFirst({
    where: {
      id: 3,
    },
  });
  res.json({ data: students });
});
app.put("/", async (req, res) => {
  console.log("put");
  const students = await prisma.student.update({
    where: {
      id: 3,
    },
    data: {
      name: "ram",
    },
  });
  res.json({ data: students });
});
app.post("/", async (req, res) => {
  const course = await prisma.course.create({
    data: {
      name: "BCA",
    },
  });
  const students = await prisma.student.create({
    data: {
      email: "ram@gmailw.com",
      name: "ram",
      password: "haha",
      courseId: course?.id,
    },
  });
  res.json({ data: students });
});

app.get("/user", async (req, res) => {
  const data = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (!user) {
      res.status(404).json({
        message: "user not found",
      });
      return;
    }

    const token = sign(user);

    res.status(200).json({
      token,
    });
  } catch (error: any) {
    if (error.code == "P2002")
      res.status(400).json({ message: "user already exist" });
  }
});

app.post("/user", async (req, res) => {
  const data = req.body;

  try {
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
      },
    });

    if (user) {
      res.status(201).json({
        message: "user creation successful",
      });
    }
  } catch (error: any) {
    if (error.code == "P2002")
      res.status(400).json({ message: "user already exist" });
  }
});
app.get("/user/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!user) {
      res.status(404).json({
        message: "not found",
      });
      return;
    }
    res.status(201).json({
      message: "user creation successful",
      data: user,
    });
  } catch (error) {
    console.log(error);
  }
});

app.post("/highlight", async (req, res) => {
  try {
    const highlight = await prisma.highlight.createMany({
      data: [
        { name: "Bob", imageUrl: "bob@prisma.io" },
        { name: "Yewande", imageUrl: "yewande@prisma.io" },
        { name: "Angelique", imageUrl: "angelique@prisma.io" },
      ],
    });
    res.status(201).json({
      data: highlight,
    });
  } catch (error) {
    console.log(error);
  }
});

app.post("/bio", async (req, res) => {
  const data = req.body;
  try {
    // use transaction
    const bio = await prisma.bio.create({
      data: {
        description: data.description,
        userId: data.userId,
      },
    });

    const bioHighlights = await prisma.bioHighlight.createMany({
      data: data.highlights.map((item: number) => {
        return {
          bioId: bio.id,
          highlightId: item,
        };
      }),
    });
    // end here

    res.status(201).json({
      data: "bio created successfull",
    });
  } catch (error: any) {
    if (error.code == "P2002" && error.meta.target.includes("userId"))
      res.status(400).json({ message: "user already has a bio" });
  }
});

app.get("/bio/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const bio = await prisma.user.findUniqueOrThrow({
      where: {
        id: Number(userId),
      },
      include: {
        bio: {
          include: {
            bioHighlights: {
              include: {
                highlight: true,
              },
            },
          },
        },
      },
    });
    res.status(200).json({
      data: bio,
    });
  } catch (error) {}
});

app.listen(4000, () => {
  console.log("server running at 4000");
});

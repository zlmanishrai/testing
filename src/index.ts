import express from "express";
import { PrismaClient } from "@prisma/client";

const app = express();

app.use(express.json());

const prisma = new PrismaClient();

app.get("/", async (req, res) => {
  const students = await prisma.student.findMany({
    include: {
      Course: true,
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

app.listen(4000, () => {
  console.log("server running at 4000");
});

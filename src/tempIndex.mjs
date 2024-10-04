import express from "express";

import userRouter from "./routes/users.mjs";
import { mockUsers } from "./utils/constants.mjs";
import { resolveIndexByUserId } from "./utils/middlewares.mjs";


const app = express();
app.use(express.json());
app.use(userRouter);

const loggingMiddleware = (req, res, next) => {
  console.log(`${req.method} - ${req.url}`);
  next();
};

//using middleware globally
app.use(loggingMiddleware);

const resolveIndexByUserId = (req, res, next) => {
  const {
    params: { id },
  } = req;

  const parsedId = parseInt(id);
  if (isNaN(parsedId)) return res.sendStatus(400);

  const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);

  if (findUserIndex === -1) return res.sendStatus(404);

  req.findUserIndex = findUserIndex;

  next();
};

const PORT = process.env.PORT || 3000;

const mockUsers = [
  { id: 1, username: "mitul", displayName: "Abu Al Nasir" },
  { id: 2, username: "niloy", displayName: "Niloy Kumar" },
  { id: 3, username: "mahfuz", displayName: "Mahfuzur Rahman" },
];

app.listen(PORT, () => {
  console.log(`Running on Port ${PORT}`);
});

//using middleware for specific req
app.get(
  "/",
  (req, res, next) => {
    console.log("base URL");
    next();
  },
  (req, res) => {
    res.status(201).send({ msg: "Hello" });
  }
);

app.get(
  "/api/users",
  query("filter")
    .isString()
    .notEmpty()
    .withMessage("Must not be empty")
    .isLength({ min: 3, max: 10 })
    .withMessage("Must be at least 3-10 characters"),
  (req, res) => {
    const result = validationResult(req);
    console.log(result);

    const {
      query: { filter, value },
    } = req;

    //when filter and value are undefined
    // if (!filter && !value) return res.send(mockUsers);
    if (filter && value)
      return res.send(mockUsers.filter((user) => user[filter].includes(value)));

    return res.send(mockUsers);
  }
);

//post request
app.post(
  "/api/users",
  // [
  //   body("username")
  //     .notEmpty()
  //     .withMessage("username cannot be empty")
  //     .isLength({ min: 5, max: 32 })
  //     .withMessage("Username must be at least 5-32 characters")
  //     .isString("username must be a string!"),
  //   body("displayName").notEmpty(),
  // ]

  checkSchema(CreateUserValidationSchema),
  (req, res) => {
    const result = validationResult(req);
    console.log(result);

    if (!result.isEmpty())
      return res.status(400).send({ error: result.array() });

    const data = matchedData(req);
    // console.log(data);

    // console.log(req.body);
    // const { body } = req;

    const newUser = { id: mockUsers[mockUsers.length - 1].id + 1, ...data };
    mockUsers.push(newUser);
    return res.status(201).send(newUser);
  }
);

// route parameters
app.get("/api/users/:id", (req, res) => {
  const parsedId = parseInt(req.params.id);
  if (isNaN(parsedId))
    return res.status(400).send({ msg: "Bad Request. Invalid Number" });

  const findUser = mockUsers.find((user) => user.id === parsedId);
  if (!findUser) return res.sendStatus(404);
  return res.send(findUser);
});

//put request
app.put("/api/users/:id", resolveIndexByUserId, (req, res) => {
  // const {
  //     body,
  //     params: { id },
  // } = req;

  // const parsedId = parseInt(id);
  // if (isNaN(parsedId)) return res.sendStatus(400);

  // const findUserIndex = mockUsers.findIndex(
  //     (user) => user.id === parsedId
  // );

  // if (findUserIndex === -1) return res.sendStatus(404);

  const { body, findUserIndex } = req;
  mockUsers[findUserIndex] = { id: mockUsers[findUserIndex].id, ...body };

  return res.sendStatus(200);
});

// //patch request
app.patch("/api/users/:id", resolveIndexByUserId, (req, res) => {
  const { body, findUserIndex } = req;

  mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body };
  return res.sendStatus(200);
});

app.delete("/api/users/:id", (req, res) => {
  const {
    params: { id },
  } = req;

  const parsedId = parseInt(id);
  if (isNaN(parsedId)) return res.sendStatus(400);

  const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);
  if (findUserIndex === -1) return res.sendStatus(404);

  mockUsers.splice(findUserIndex, 1);
  return res.send(200);
});

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { APP_SECRET, getUserId } = require("../utils");

async function signup(parent, args, context, info) {
  const { prisma } = context;

  try {
    // #1
    const password = await bcrypt.hash(args.password, 10);

    // #2
    const user = await prisma.createUser({ ...args, password });

    // #3
    const token = await jwt.sign({ userId: user.id }, APP_SECRET);

    return {
      token,
      user,
    };
  } catch (error) {
    console.log(error);
  }
}

async function login(parent, args, context, info) {
  // 1
  const user = await context.prisma.user({ email: args.email });
  if (!user) {
    throw new Error("No such user found");
  }

  // 2
  const valid = await bcrypt.compare(args.password, user.password);
  if (!valid) {
    throw new Error("Invalid password");
  }

  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  // 3
  return {
    token,
    user,
  };
}

function post(parent, args, context, info) {
  const { prisma } = context;

  const { url, description = "" } = args;
  const userId = getUserId(context);

  return prisma.createLink({
    url,
    description,
    postedBy: {
      connect: {
        id: userId,
      },
    },
  });
}

async function vote(parent, args, context, info) {
  // 1
  const userId = getUserId(context);

  // 2
  const voteExists = await context.prisma.$exists.vote({
    user: { id: userId },
    link: { id: args.linkId },
  });
  if (voteExists) {
    throw new Error(`Already voted for link: ${args.linkId}`);
  }

  // 3
  return context.prisma.createVote({
    user: { connect: { id: userId } },
    link: { connect: { id: args.linkId } },
  });
}

module.exports = {
  post,
  signup,
  login,
  vote,
};

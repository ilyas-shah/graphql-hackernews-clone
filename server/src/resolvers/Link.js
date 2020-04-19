function postedBy(parent, args, context) {
  return context.prisma.link({ id: parent.id }).postedBy();
}

function votes(parent, args, context) {
  const { linkId } = args;

  return context.prisma.link({ id: linkId }).votes();
}

module.exports = {
  postedBy,
  votes,
};

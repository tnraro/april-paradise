select Achievement {
  key,
  createdAt,
} filter .user = global currentUser;

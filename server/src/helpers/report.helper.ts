const reportPopulates = [
    { path: 'sender', select: 'username profile_picture user_id' },
    { path: 'receiver', select: 'username profile_picture user_id' },
    { path: 'handler', select: 'username profile_picture user_id' },
    { path: 'conversations.client', populate: { path: 'messages', model: 'Message' } },
    { path: 'conversations.partner', populate: { path: 'messages', model: 'Message' } },
];

export { reportPopulates };

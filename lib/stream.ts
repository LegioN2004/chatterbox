// this is to connect to stream

import { StreamChat } from 'stream-chat';

if(!process.env.NEXT_PUBLIC_STREAM_API_KEY) {
    throw new Error("NEXT_PUBLIC_STREAM_API_KEY and NEXT_PUBLIC_STREAM_API_SECRET must be set in environment variables");
}

export const streamClient = StreamChat.getInstance(
    process.env.NEXT_PUBLIC_STREAM_API_KEY,
);

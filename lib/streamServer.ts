// admin

import { StreamChat } from 'stream-chat';

if(!process.env.NEXT_PUBLIC_STREAM_API_KEY) {
    throw new Error("NEXT_PUBLIC_STREAM_API_KEY and NEXT_PUBLIC_STREAM_API_SECRET must be set in environment variables");
}

if(!process.env.STREAM_API_SECRET_KEY) {
    throw new Error("STREAM_API_SECRET_KEY must be set in environment variables");
}

// this is on the server side only, so we can use the secret key here
export const serverClient = StreamChat.getInstance(
    process.env.NEXT_PUBLIC_STREAM_API_KEY,
    process.env.STREAM_API_SECRET_KEY
);

// this create new chat diaglog box will show a dialog box to show the users to select users to create a new chat

import { streamClient } from '@/lib/stream';

const useCreateNewChat = () => {
	const createNewChat = async ({
		members,
		createdBy,
		groupName,
	}: {
		members: string[];
		createdBy: string;
		groupName?: string;
	}) => {
		const isGroupChat = members.length > 2;

		if (!isGroupChat) {
			// one on one chat check
			// if they are part of the chat then make sure they go to the chat instead of creating a new one
			const existingChannel = await streamClient.queryChannels(
				{
					type: 'messaging',
					members: { $eq: members },
				},
				{ created_at: -1 },
				{ limit: 1 }
			);

			if (existingChannel.length > 0) {
				const channel = existingChannel[0];
				const channelMembers = Object.keys(channel.state.members);

				if (
					channelMembers.length === 2 &&
					members.length === 2 &&
					members.every((member) => channelMembers.includes(member))
				) {
					// channel already exists with the same members
					console.log('Existing 1-1 chat found');
					return channel;
				}
			}
		}

		const channelId = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`; // always unique

		try {
			const channelData: {
				members: string[];
				createdBy: string;
				name?: string;
			} = {
				members,
				createdBy: createdBy,
			};

			if (isGroupChat) {
				groupName = `Group Chat (${members.length} members)`;
			}

			const channel = streamClient.channel(
				isGroupChat ? 'team' : 'messaging',
				channelId,
				channelData
			);

			await channel.watch({
				presence: true,
			});

			return channel;
		} catch (error) {
			throw error;
		}
	};

    return createNewChat
};

export default useCreateNewChat;

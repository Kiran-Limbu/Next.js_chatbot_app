import { auth } from "@/src/lib/auth";
import connectDB from "@/src/lib/db";
import conversationModel from "@/src/models/conversation.model";
import messageModel from "@/src/models/message.model";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import ChatWorkspace from "@/components/chat/ChatWorkspace";

export default async function ChatConversationPage(
  {params}: {params: Promise<{id: string}>},
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const { id } = await params;

  await connectDB();

  const conversation = await conversationModel.findOne({
    _id: id,
    userId: session.user.id,
  }).lean();

  if (!conversation) {
    notFound();
  }

  const messages = await messageModel.find({
    conversationId: conversation._id,
  })
    .sort({ createdAt: 1 })
    .lean();

  const conversations = await conversationModel
    .find({ userId: session.user.id })
    .sort({ updatedAt: -1 })
    .lean();

  return (
    <ChatWorkspace
      user={{
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
      }}
      conversations={JSON.parse(JSON.stringify(conversations))}
      activeConversationTitle={conversation.title}
      messages={JSON.parse(JSON.stringify(messages))}
    />
  );
}
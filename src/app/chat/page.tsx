import { auth } from "@/src/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import ChatWorkspace from "@/components/chat/ChatWorkspace";
import connectDB from "@/src/lib/db";
import conversationModel from "@/src/models/conversation.model";


const ChatPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/");
  }

  await connectDB();

  const conversations = await conversationModel
    .find({
      userId: session.user.id,
    })
    .sort({ updatedAt: -1 })
    .lean();


  return (
    <ChatWorkspace
      user={{
        name: session?.user?.name,
        email: session?.user?.email,
        image: session?.user?.image,
      }}
      conversations={JSON.parse(JSON.stringify(conversations))}
    />
  );
};

export default ChatPage;

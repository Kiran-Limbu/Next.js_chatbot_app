import { auth } from "@/src/lib/auth";
import connectDB from "@/src/lib/db";
import conversationModel from "@/src/models/conversation.model";
import messageModel from "@/src/models/message.model";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

connectDB();

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const userMessage = body.message?.trim();

    if (!userMessage) {
      return NextResponse.json(
        { message: "Message is required" },
        { status: 400 },
      );
    }

    const conversation = await conversationModel.create({
      userId: session.user.id,
      title: userMessage.slice(0, 50),
    });

    //User enter massage like: "What is pointer in cpp ?"  
    await messageModel.create({
      conversationId: conversation._id,
      role: "user",
      content: userMessage,
    });
    
    // Temporary response.
    // Later this will come from the LLM.
    const aiResponse =
    "This is a temporary AI response. We will connect the LLM next.";
    
    //An LLM generate massage like: "Pointer in cpp is ......."  
    const messageData = await messageModel.create({
      conversationId: conversation._id,
      role: "model",
      content: aiResponse,
    });

    return NextResponse.json({
      conversationId: conversation._id.toString(),
      messageData: {
        _id: messageData._id.toString(),
        role: messageData.role,
        content: messageData.content,
      },
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }
}

import { auth } from "@/src/lib/auth";
import connectDB from "@/src/lib/db";
import conversationModel from "@/src/models/conversation.model";
import messageModel from "@/src/models/message.model";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { generateAIResponse } from "@/src/lib/gemini";

connectDB();
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const conversation = await conversationModel.findOne({
      _id: id,
      userId: session.user.id,
    });

    if (!conversation) {
      return NextResponse.json({ message: "Conversation not found" }, { status: 404 });
    }

    const body = await req.json();

    const userMessage = body.message.trim();

    if (!userMessage) {
      return NextResponse.json(
        { message: "Message is required" },
        { status: 400 },
      );
    }

    //User enter massage like: "What is pointer in cpp ?"
    await messageModel.create({
      conversationId: id,
      role: "user",
      content: userMessage,
    });


    //An LLM generate massage like: "Pointer in cpp is ......."
     const aiResponse = await generateAIResponse(userMessage);
    const messageData = await messageModel.create({
      conversationId: id,
      role: "model",
      content: aiResponse,
    });

    return NextResponse.json({
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

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const conversationById = await conversationModel.findById(id);

  return NextResponse.json({
    conversation: conversationById,
  });
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const conversation = await conversationModel.findOne({
      _id: id,
      userId: session.user.id,
    });

    if (!conversation) {
      return NextResponse.json(
        { message: "Conversation not found" },
        { status: 404 }
      );
    }

    await messageModel.deleteMany({
      conversationId: conversation._id,
    });

    // 5. Delete the conversation
    await conversationModel.deleteOne({
      _id: conversation._id,
      userId: session.user.id,
    });

    return NextResponse.json({
      message: "Conversation deleted successfully",
    });
  } catch (error) {
    console.error("Delete conversation error:", error);

    return NextResponse.json(
      { message: "Failed to delete conversation" },
      { status: 500 }
    );
  }
}

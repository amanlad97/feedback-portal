import { getServerSession } from "next-auth";
import { AuthOptions } from "next-auth";
import { dbConnect } from "@/lib/dbconnect";
import userModel from "@/model/User";
import { User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
export async function POST(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;
  if (!session || !session.user) {
    Response.json(
      {
        success: false,
        message: "not authenticated",
      },
      { status: 401 }
    );
  }
  const userId = user._id;
  const { acceptMessages } = await request.json();
  try {
    const updatedUser = await userModel.findByIdAndUpdate(
      user,
      { isAcceptingMessage: acceptMessages },
      { new: true }
    );
    if (!updatedUser) {
      Response.json(
        {
          success: false,
          message: "failed to update user status to accept messages",
        },
        { status: 401 }
      );
    } else {
      Response.json(
        {
          success: true,
          message: "Message accpetance status updated successfully",
          updatedUser,
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.log("failed");
    Response.json(
      {
        success: false,
        message: "failed to update user status to accpet messages",
      },
      { status: 401 }
    );
  }
}
export async function GET(request: Request) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;
    if (!session || !session.user) {
      Response.json(
        {
          success: false,
          message: "not authenticated",
        },
        { status: 401 }
      );
    }
    const userId = user._id;
    const foundUser = await userModel.findById(userId);
    if (!foundUser) {
      Response.json(
        {
          success: false,
          message: "fuser not found",
        },
        { status: 401 }
      );
    } else {
      Response.json(
        {
          success: true,
          isAcceptingMessage: foundUser.isAcceptingMessage,
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.log("failed");
    Response.json(
      {
        success: false,
        message: "error in getting the message accepting status",
      },
      { status: 401 }
    );
  }
}

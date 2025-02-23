import { dbConnect } from "@/lib/dbconnect";
import userModel from "@/model/User";
export async function POST(request: Request) {
  await dbConnect();
  try {
    const { username, code } = await request.json();
    const decodedUsername = decodeURIComponent(username);
    const user = await userModel.findOne({ username: decodedUsername });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }
    const isCodeValid = user.verifyCode === code;
    const isCodeExpired = new Date(user.verifyCodeExpiry) > new Date();
    if (isCodeValid && isCodeExpired) {
      user.isVerified = true;
      await user.save();
      Response.json(
        {
          success: true,
          message: "account varified successfully",
        },
        { status: 200 }
      );
    } else if (!isCodeExpired) {
      Response.json(
        {
          success: false,
          message: "code expired,please signup again to get a new code",
        },
        { status: 400 }
      );
    } else {
      Response.json(
        {
          success: false,
          message: "incorrect verification code",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("The error is in: ", error);
    return Response.json(
      {
        success: false,
        message: "Error verifiying User",
      },
      { status: 500 }
    );
  }
}


import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Image upload API is working",
  });
}

export async function POST(request: Request) {
  try {
    const apiKey = process.env.IMGBB_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { success: false, message: "ImgBB API key is missing" },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("image");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { success: false, message: "Image file is required" },
        { status: 400 }
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { success: false, message: "Please select an image file" },
        { status: 400 }
      );
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, message: "Image must be smaller than 10MB" },
        { status: 400 }
      );
    }

    const uploadData = new FormData();
    uploadData.append("image", file);

    const imgbbResponse = await fetch(
      `https://api.imgbb.com/1/upload?key=${apiKey}`,
      {
        method: "POST",
        body: uploadData,
        cache: "no-store",
      }
    );

    const result = await imgbbResponse.json();

    if (!imgbbResponse.ok || !result.success) {
      console.error("ImgBB error:", result);

      return NextResponse.json(
        {
          success: false,
          message: result.error?.message || "ImgBB upload failed",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      url: result.data.url,
      message: "Image uploaded successfully",
    });
  } catch (error) {
    console.error("Upload API error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Image upload failed",
      },
      { status: 500 }
    );
  }
}

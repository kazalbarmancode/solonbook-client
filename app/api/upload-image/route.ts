
import { NextResponse } from "next/server";
import axios from "axios";
import FormData from "form-data";
import https from "node:https";

export const runtime = "nodejs";

const httpsAgent = new https.Agent({
  family: 4,
  keepAlive: false,
});

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

    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json(
        { success: false, message: "Image file is required" },
        { status: 400 }
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { success: false, message: "Please select a valid image" },
        { status: 400 }
      );
    }

    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, message: "Image must be smaller than 2MB" },
        { status: 400 }
      );
    }

    console.log("Starting ImgBB upload...");
    console.log("File size:", file.size);

    const uploadData = new FormData();

    uploadData.append(
      "image",
      Buffer.from(await file.arrayBuffer()),
      {
        filename: file.name || "profile-image.jpg",
        contentType: file.type,
      }
    );

    const response = await axios.post(
      "https://api.imgbb.com/1/upload",
      uploadData,
      {
        params: {
          key: apiKey,
        },
        headers: uploadData.getHeaders(),
        httpsAgent,
        timeout: 20000,
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
      }
    );

    console.log("ImgBB response status:", response.status);

    if (!response.data?.success || !response.data?.data?.url) {
      return NextResponse.json(
        {
          success: false,
          message: "ImgBB upload failed",
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      url: response.data.data.url,
      message: "Image uploaded successfully",
    });

  } catch (error) {
    console.error("ImgBB upload error:", error);

    return NextResponse.json(
      {
        success: false,
        message: axios.isAxiosError(error)
          ? error.code === "ECONNABORTED"
            ? "ImgBB upload timed out."
            : error.message
          : "Image upload failed.",
      },
      { status: 502 }
    );
  }
}

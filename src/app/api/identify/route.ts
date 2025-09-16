'use server';

import { identifyPlantSpecies } from "@/ai/flows/identify-plant-species";
import {NextRequest, NextResponse} from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { photoDataUri } = body;

    if (!photoDataUri) {
      return NextResponse.json(
        { error: "Missing photoDataUri in request body" },
        { status: 400 }
      );
    }

    const result = await identifyPlantSpecies({ photoDataUri });

    return NextResponse.json(result);
  } catch (e: any) {
    console.error("Error in identification API:", e);
    // Provide a user-friendly error message
    return NextResponse.json(
      { error: "Failed to identify the plant. The AI model might be unavailable or the request is malformed." },
      { status: 500 }
    );
  }
}

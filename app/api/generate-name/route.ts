import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

export async function POST(request: Request) {
  try {
    const { name } = await request.json();

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    // Check if API key is available
    if (!process.env.GOOGLE_API_KEY) {
      console.error('Google API key is missing');
      return NextResponse.json(
        { error: 'API configuration error' },
        { status: 500 }
      );
    }

    // Get the Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Read the prompt from APIcallPROMPT.txt
    const promptPath = path.join(process.cwd(), 'app', 'APIcallPROMPT.txt');
    const promptTemplate = fs.readFileSync(promptPath, 'utf-8');
    
    // Add the user input to the prompt
    const prompt = `${promptTemplate}

User Input:
${name}

LLM Output:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const generatedName = response.text().trim();

    // Validate that we got a proper response
    if (!generatedName || generatedName.length === 0) {
      throw new Error('Empty response from AI model');
    }

    return NextResponse.json({ generatedName });
  } catch (error) {
    console.error('Detailed error generating name:', error);
    console.error('Error message:', error instanceof Error ? error.message : 'Unknown error');
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    
    // More specific error handling
    if (error instanceof Error) {
      console.error('Error type:', error.constructor.name);
      
      if (error.message.includes('API_KEY') || error.message.includes('Invalid API key')) {
        return NextResponse.json(
          { error: 'API key configuration error' },
          { status: 500 }
        );
      }
      if (error.message.includes('quota') || error.message.includes('limit') || error.message.includes('exceeded')) {
        return NextResponse.json(
          { error: 'Service temporarily unavailable. Please try again later.' },
          { status: 429 }
        );
      }
      if (error.message.includes('network') || error.message.includes('fetch') || error.message.includes('connection')) {
        return NextResponse.json(
          { error: 'Network error. Please check your connection and try again.' },
          { status: 503 }
        );
      }
      if (error.message.includes('model') || error.message.includes('not found')) {
        return NextResponse.json(
          { error: 'Model configuration error. Please try again.' },
          { status: 503 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to generate name. Please try again.' },
      { status: 500 }
    );
  }
} 
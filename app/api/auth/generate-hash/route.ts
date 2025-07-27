import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"

export async function GET() {
  try {
    const password = "raj"
    const rounds = 12
    
    console.log("Generating hash for password:", password)
    
    // Generate a new hash
    const newHash = await bcrypt.hash(password, rounds)
    console.log("Generated hash:", newHash)
    
    // Test the new hash immediately
    const testResult = await bcrypt.compare(password, newHash)
    console.log("Hash test result:", testResult)
    
    return NextResponse.json({
      success: true,
      password,
      newHash,
      testResult,
      message: testResult ? "✅ New hash generated and tested successfully!" : "❌ Generated hash test failed"
    })
  } catch (error) {
    console.error("Hash generation error:", error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}

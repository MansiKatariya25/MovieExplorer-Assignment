import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"

export async function GET() {
  try {
    console.log("Testing demo password...")
    
    const testPassword = "password123"
    const storedHash = "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LrUpm"
    
    console.log("Password:", testPassword)
    console.log("Hash:", storedHash)
    
    const isValid = await bcrypt.compare(testPassword, storedHash)
    console.log("Comparison result:", isValid)
    
    return NextResponse.json({ 
      success: true, 
      passwordTest: isValid,
      message: isValid ? "✅ Demo password works!" : "❌ Demo password failed!",
      testPassword,
      storedHash: storedHash.substring(0, 20) + "..." // Only show part of hash
    })
  } catch (error) {
    console.error("Password test error:", error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}
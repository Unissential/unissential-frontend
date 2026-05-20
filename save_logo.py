#!/usr/bin/env python3
"""
Helper script to copy your Unissential logo to the public folder.

Usage:
    python save_logo.py <path_to_your_logo_image>

Examples:
    python save_logo.py "C:\Users\HP\Downloads\unissential-logo.png"
    python save_logo.py "./logo.png"
"""

import sys
import shutil
from pathlib import Path

def save_logo(source_path: str) -> None:
    """Copy logo image to public folder."""
    source = Path(source_path)
    dest = Path("public") / "logo.png"
    
    # Validate source exists
    if not source.exists():
        print(f"❌ Error: Logo file not found at {source}")
        sys.exit(1)
    
    # Check if it's a valid image
    if source.suffix.lower() not in ['.png', '.jpg', '.jpeg', '.webp']:
        print(f"❌ Error: File must be PNG, JPG, or WebP. Got: {source.suffix}")
        sys.exit(1)
    
    # Create public folder if it doesn't exist
    Path("public").mkdir(exist_ok=True)
    
    # Copy logo
    try:
        shutil.copy2(source, dest)
        print(f"✅ Logo saved successfully to {dest}")
        print(f"📦 File size: {dest.stat().st_size / 1024:.1f} KB")
        print("\n🚀 Next steps:")
        print("1. Run: npm run dev")
        print("2. Open: http://localhost:3000")
        print("3. Your logo should appear in the navbar!")
    except Exception as e:
        print(f"❌ Error copying file: {e}")
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print(__doc__)
        sys.exit(1)
    
    save_logo(sys.argv[1])

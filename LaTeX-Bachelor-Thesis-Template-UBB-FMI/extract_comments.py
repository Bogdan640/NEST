import sys
import fitz

def extract_comments(pdf_path):
    try:
        doc = fitz.open(pdf_path)
    except Exception as e:
        print(f"Error opening PDF: {e}")
        return

    comments_found = False
    for i, page in enumerate(doc):
        annots = page.annots()
        if annots:
            for annot in annots:
                info = annot.info
                content = info.get("content", "")
                author = info.get("title", "")
                if content:
                    print(f"--- Page {i + 1} ---")
                    print(f"Author: {author}")
                    print(f"Comment: {content}")
                    comments_found = True
                    # Try to get surrounding text
                    try:
                        rect = annot.rect
                        text = page.get_textbox(rect)
                        print(f"Near text: {text}")
                    except Exception:
                        pass
                    print("-------------------")
    
    if not comments_found:
        print("No comments found in the PDF.")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python extract_comments.py <pdf_path>")
        sys.exit(1)
    extract_comments(sys.argv[1])

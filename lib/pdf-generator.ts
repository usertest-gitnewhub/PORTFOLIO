import { jsPDF } from "jspdf"
import "jspdf-autotable"

// Function to generate PDF with CodeMuse logo
export const generateCodePDF = (code: string, title = "Code Snippet", language = "Code"): void => {
  // Create a new PDF document
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  })

  // Set font
  doc.setFont("helvetica", "normal")

  // Add CodeMuse logo (base64 encoded)
  // This is a placeholder - replace with actual logo
  const logoBase64 =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFEmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDIgNzkuMTYwOTI0LCAyMDE3LzA3LzEzLTAxOjA2OjM5ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAyMy0wMS0wMVQxMjowMDowMCswMTowMCIgeG1wOk1vZGlmeURhdGU9IjIwMjMtMDEtMDFUMTI6MDA6MDArMDE6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjMtMDEtMDFUMTI6MDA6MDArMDE6MDAiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiBwaG90b3Nob3A6SUNDUHJvZmlsZT0ic1JHQiBJRUM2MTk2Ni0yLjEiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MWYyYzg5ZDUtYzJmZC00YTQ1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"

  // Add logo to top right corner
  doc.addImage(logoBase64, "PNG", 170, 10, 20, 20)

  // Add title
  doc.setFontSize(22)
  doc.setTextColor(33, 150, 243) // Primary color
  doc.text("Code Muse", 105, 20, { align: "center" })

  // Add subtitle
  doc.setFontSize(14)
  doc.setTextColor(100, 100, 100)
  doc.text("Your Intelligent Coding Companion", 105, 30, { align: "center" })

  // Add code title
  doc.setFontSize(16)
  doc.setTextColor(0, 0, 0)
  doc.text(`${title} (${language})`, 20, 45)

  // Add horizontal line
  doc.setDrawColor(200, 200, 200)
  doc.line(20, 50, 190, 50)

  // Add code content with line breaks
  doc.setFontSize(10)
  doc.setTextColor(50, 50, 50)

  // Split code into lines
  const codeLines = code.split("\n")
  let y = 60

  // Add each line with line numbers
  codeLines.forEach((line, index) => {
    // Line number
    doc.setTextColor(150, 150, 150)
    doc.text(`${index + 1}`, 15, y, { align: "right" })

    // Code line
    doc.setTextColor(50, 50, 50)
    doc.text(line, 25, y)

    y += 5 // Line spacing

    // If we're near the bottom of the page, create a new page
    if (y > 280) {
      doc.addPage()
      y = 20
    }
  })

  // Add footer
  const pageCount = doc.internal.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(150, 150, 150)
    doc.text(`Generated by Code Muse - Page ${i} of ${pageCount}`, 105, 290, { align: "center" })
  }

  // Save the PDF
  doc.save(`codemuse_${title.toLowerCase().replace(/\s+/g, "_")}.pdf`)
}

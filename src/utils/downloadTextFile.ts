"use client";

/**
 * Bietet einen Text als Datei zum Herunterladen an. Nur im Browser aufrufbar,
 * das Gegenstück zu `doc.save(...)` in `exportTablePdf`.
 */
export const downloadTextFile = (
    fileName: string,
    mimeType: string,
    content: string,
) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();

    // Erst nach dem Klick freigeben, sonst bricht der Download in Safari ab.
    URL.revokeObjectURL(url);
};

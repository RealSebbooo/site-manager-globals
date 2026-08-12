"use client";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export type PdfColumn<T> = {
    header: string;
    /** Wert für eine Zeile. Rückgabe wird als String gerendert. */
    value: (row: T) => string | number | undefined;
};

export type ExportTablePdfOptions<T> = {
    columns: Array<PdfColumn<T>>;
    rows: Array<T>;
    /** Dateiname ohne Endung */
    fileName?: string;
    /** Überschrift über der Tabelle */
    title?: string;
    orientation?: "portrait" | "landscape";
    fontSize?: number;
};

/**
 * Schreibt eine beliebige Zeilenliste als PDF-Tabelle und startet den Download.
 * `jspdf` und `jspdf-autotable` müssen im Projekt installiert sein.
 */
export const exportTablePdf = <T,>({
    columns,
    rows,
    fileName = "export",
    title,
    orientation = "landscape",
    fontSize = 10,
}: ExportTablePdfOptions<T>) => {
    const doc = new jsPDF({ orientation });

    let startY: number | undefined;

    if (title) {
        doc.setFontSize(14);
        doc.text(title, 14, 14);
        startY = 20;
    }

    autoTable(doc, {
        head: [columns.map((column) => column.header)],
        body: rows.map((row) =>
            columns.map((column) => String(column.value(row) ?? "")),
        ),
        styles: { fontSize },
        headStyles: { fillColor: [230, 230, 230], textColor: 20 },
        margin: { top: 14 },
        ...(startY ? { startY } : {}),
    });

    doc.save(`${fileName}.pdf`);
};

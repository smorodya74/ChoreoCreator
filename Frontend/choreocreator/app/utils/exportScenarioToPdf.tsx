import React from 'react';
import ReactDOM from 'react-dom/client';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import FormationSvg from '../components/FormationSvg';

interface Position {
    x: number;
    y: number;
}

interface DancerPosition {
    id: string;
    numberInFormation: number;
    position: Position;
}

interface Formation {
    numberInScenario: number;
    dancerPositions: DancerPosition[];
}

interface ExportParams {
    title: string;
    formations: Formation[];
    orientation?: 'p' | 'l'; // 'p' - книжная, 'l' - альбомная (по умолчанию 'p')
}

function uint8ArrayToBase64(uint8Array: Uint8Array): string {
    let binary = '';
    const chunkSize = 0x8000; // 32768
    for (let i = 0; i < uint8Array.length; i += chunkSize) {
        const chunk = uint8Array.subarray(i, i + chunkSize);
        binary += String.fromCharCode(...chunk);
    }
    return btoa(binary);
}

async function loadFont(pdf: jsPDF, url: string, fontName: string) {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    const base64String = uint8ArrayToBase64(uint8Array);
    pdf.addFileToVFS(`${fontName}.ttf`, base64String);
    pdf.addFont(`${fontName}.ttf`, fontName, 'normal');
    pdf.setFont(fontName);
}

function printHeader(pdf: jsPDF, title: string, pageWidth: number, margin: number) {
    let y = margin;
    pdf.setFontSize(20);
    pdf.setTextColor(0, 0, 0);
    pdf.text(title, margin, y);
    y += 10;
    pdf.setDrawColor(200);
    pdf.line(margin, y, pageWidth - margin, y);
    return y + 30;
}

export async function exportScenarioToPdf({ title, formations, orientation = 'l' }: ExportParams) {
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '-9999px';
    container.style.left = '0';
    // не задаём фиксированную ширину контейнера
    document.body.appendChild(container);

    const pdf = new jsPDF(orientation, 'pt', 'a4');
    await loadFont(pdf, '/Roboto.ttf', 'Roboto');
    const margin = 40;
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Размеры оригинального SVG (замени на реальные из компонента, если они другие)
    const originalWidth = 1360;
    const originalHeight = 720;

    // Вычисляем доступную ширину и высоту под SVG
    const availableWidth = pageWidth - 2 * margin;
    const scale = availableWidth / originalWidth;
    const calculatedHeight = originalHeight * scale;

    // Рендерим SVG для каждой формации
    formations.forEach(f => {
        const div = document.createElement('div');
        div.id = `formation-capture-${f.numberInScenario}`;
        div.style.marginBottom = '40px';
        container.appendChild(div);

        ReactDOM.createRoot(div).render(
            <FormationSvg 
                dancerPositions={f.dancerPositions} 
                width={availableWidth} 
                height={calculatedHeight}
                isForPdf={true} 
            />
        );
    });

    // Ждем рендер
    await new Promise(resolve => setTimeout(resolve, 150));

    let currentY = printHeader(pdf, title, pageWidth, margin);

    pdf.setFont('Roboto');

    for (const f of formations) {
        const el = document.getElementById(`formation-capture-${f.numberInScenario}`);
        if (!el) continue;

        const canvas = await html2canvas(el, { 
            backgroundColor: null, 
            //scale: 1
        });
        const imgData = canvas.toDataURL('image/png');

        // Используем уже рассчитанные размеры для вставки картинки
        if (currentY + calculatedHeight + 30 > pageHeight - margin) {
            pdf.addPage();
            currentY = printHeader(pdf, title, pageWidth, margin);
        }

        pdf.setFontSize(14);
        pdf.text(`Formation: ${f.numberInScenario}`, margin, currentY);
        currentY += 18;

        pdf.addImage(imgData, 'PNG', margin, currentY, availableWidth, calculatedHeight);
        currentY += calculatedHeight + 30;
    }

    document.body.removeChild(container);
    pdf.save(`${title}.pdf`);
}
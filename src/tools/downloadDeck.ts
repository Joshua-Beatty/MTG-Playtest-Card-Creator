import chunk from "lodash/chunk";
import { Deck } from "./types";
import { jsPDF } from "jspdf";
import Mask from "../Assets/Mask.png"
import JSZip from "jszip";
import { Image } from "pdfjs";
async function downloadDeck(setLoading: (state: boolean) => unknown, deck: Deck, setProgress: (progress: number, total: number) => unknown, useMask: boolean) {
    setLoading(true);
    setProgress(0, 100);

    const toPrintImages: string[] = [];
    const toPrintImagesName: string[] = [];
    for (const card of deck) {
        toPrintImagesName.push(card.card.name)
        for (let i = 0; i < card.count; i++) {
            if (card.card?.card_faces?.[0]?.image_uris) {
                if (!card.faces) {
                    toPrintImages.push(card.card?.card_faces?.[0]?.image_uris?.large || "");
                } else if (card.faces == "front") {
                    toPrintImages.push(card.card?.card_faces?.[0]?.image_uris?.large || "");
                } else {
                    toPrintImages.push(card.card?.card_faces?.[1]?.image_uris?.large || "");
                }
            } else
                toPrintImages.push(card.card.image_uris?.large || "");
        }
    }
    const zip = new JSZip();

    let count = 0
    for (const index in toPrintImages) {
        const cardURL = toPrintImages[index]
        const data = await (await fetch(cardURL)).blob()
        let imageBitmap = await createImageBitmap(data)
        imageBitmap = await cropImageBitmap(imageBitmap, useMask)


        zip.file(sanitizeFileName(`${toPrintImagesName[index]}.png`), imageBitmapToBlob(imageBitmap));
        count++
        setProgress(count, toPrintImages.length)
    }

    zip.generateAsync({ type: 'blob' }).then(function (content) {
        // Trigger download
        const zipFilename = 'images.zip';
        const link = document.createElement('a');
        link.href = URL.createObjectURL(content);
        link.download = zipFilename;
        link.click();
    });
    setLoading(false);
}

async function imageBitmapToBlob(imageBitmap: ImageBitmap) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx)
        throw "No Context On Canvas"
    canvas.width = imageBitmap.width;
    canvas.height = imageBitmap.height;
    ctx.drawImage(imageBitmap, 0, 0);
    return new Promise(resolve => {
        canvas.toBlob(blob => resolve(blob));
    });
}


function sanitizeFileName(fileName: string) {
    // Replace characters that are not alphanumeric, periods, underscores, or hyphens with underscores
    return fileName.replace(/[^a-z0-9.\-_]/gi, '_');
}

async function cropImageBitmap(imageBitmap: ImageBitmap, useMask: boolean) {
    // Dimensions of the crop area
    const cropWidth = 603;
    const cropHeight = 63;
    const cropX = 34;
    const cropY = 40;

    const data = await (await fetch(Mask)).blob()
    const maskImage = await createImageBitmap(data);
    // Create an off-screen canvas
    const offscreenCanvas = new OffscreenCanvas(cropWidth, cropHeight);
    const ctx = offscreenCanvas.getContext('2d');
    if (!ctx)
        throw "No Context On Canvas"

    // Draw the image bitmap onto the off-screen canvas with the crop parameters
    ctx.drawImage(
        imageBitmap, // Source image bitmap
        cropX, cropY, // Source x, y
        cropWidth, cropHeight, // Source width, height
        0, 0, // Destination x, y (start at top-left of off-screen canvas)
        cropWidth, cropHeight // Destination width, height
    );

    if (useMask) {
        ctx.globalCompositeOperation = 'destination-out'; // Draw with black to erase
        ctx.drawImage(maskImage, 0, 0);
    }
    // Convert the off-screen canvas to ImageBitmap
    const croppedImageBitmap = await createImageBitmap(offscreenCanvas);

    // Return the cropped ImageBitmap
    return croppedImageBitmap;
}

export default downloadDeck;
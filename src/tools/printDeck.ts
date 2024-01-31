import chunk from "lodash/chunk";
import { Deck } from "./types";
import { jsPDF } from "jspdf";
import templateCuts from "../Assets/TemplateCuts.png"

async function printDeck(setLoading: (state: boolean) => unknown, deck: Deck, setProgress: (progress: number, total: number) => unknown) {
    setLoading(true);
    setProgress(0, 100);

    const toPrintImages: string[] = [];
    for (const card of deck) {
        for (let i = 0; i < card.count; i++) {
            if (card.card?.card_faces?.[0]?.image_uris) {
                if (!card.faces) {
                    toPrintImages.push(card.card?.card_faces?.[0]?.image_uris?.large || "");
                    toPrintImages.push(card.card?.card_faces?.[1]?.image_uris?.large || "");
                } else if (card.faces == "front") {
                    toPrintImages.push(card.card?.card_faces?.[0]?.image_uris?.large || "");
                } else {
                    toPrintImages.push(card.card?.card_faces?.[1]?.image_uris?.large || "");
                }
            } else
                toPrintImages.push(card.card.image_uris?.large || "");
        }
    }
    const imagesPerPage = chunk(toPrintImages, 9)


    const doc = new jsPDF({ format: "letter", unit: "in" });
    const startingX = 0.5;
    const startingY = 0.25;
    let count = 0;
    for (const pageIndex in imagesPerPage) {
        const page = imagesPerPage[pageIndex]
        if (pageIndex != "0")
            doc.addPage();
        let x = startingX;
        let y = startingY;
        for (const i in page) {
            const data = await (await fetch(page[i])).blob()
            //const image = new Uint8Array(await data.arrayBuffer());
            const canvas = document.createElement("canvas")
            canvas.width = 672;
            canvas.height = 936;
            const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

            const imageBitmap = await createImageBitmap(data)
            ctx.drawImage(imageBitmap, 0, 0, 672, 936)
            ctx.fillStyle = "#fff"
            //ctx.fillRect(0,0,100,100);

            drawTriangle([18, 13], [[0, 0], [24, 0], [0, 24]], ctx);
            drawTriangle([652, 9], [[646, 0], [672, 25], [672, 0]], ctx);
            drawTriangle([11, 918], [[0, 911], [26, 936], [0, 936]], ctx);
            drawTriangle([653, 926], [[646, 936], [672, 936], [672, 911]], ctx);

            //console.log(canvas)
            doc.addImage(canvas, "jpg", x, y, 2.5, 3.5)
            x += 2.5;
            if (x > startingX + 2.5 * 3 - .1) {
                x = startingX;
                y += 3.5;
            }
            count++;
            setProgress(count, toPrintImages.length)
        }
        const data = await (await fetch(templateCuts)).blob()
        const image = new Uint8Array(await data.arrayBuffer());
        doc.addImage(image, "png", 0, 0, 8.5, 11)
    }

    doc.save("MTG-Print.pdf");
    setLoading(false);
}

function drawTriangle(colorPoint: [number, number], path: [number, number][], ctx: CanvasRenderingContext2D) {
    const pixelColor = ctx.getImageData(
        colorPoint[0],
        colorPoint[1],
        1,
        1
    ).data;
    ctx.fillStyle = convertArrayToRGB(pixelColor)
    ctx.beginPath();
    ctx.moveTo(path[0][0], path[0][1]);
    ctx.lineTo(path[1][0], path[1][1]);
    ctx.lineTo(path[2][0], path[2][1]);
    ctx.closePath();
    ctx.fill();
}

function convertArrayToRGB(data: Uint8ClampedArray): string {
    return `rgb(${data[0]},${data[1]},${data[2]})`;
}


export default printDeck;
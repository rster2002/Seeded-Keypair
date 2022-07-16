import { SeededRSA } from "../dist/mjs";

let generator = new SeededRSA(2048);

//@ts-ignore
document.getElementById("button").addEventListener("click", async () => {
    let keypair = await generator.generateSeeded(123n);
    console.log(keypair.toString());
});

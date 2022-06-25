import { KeyPair, SeededRSA } from "../src/index";

test("Valid keys are created when using seeded generator", async () => {
    // Given
    let generator = new SeededRSA(2048, 65537);

    // When
    let keypair = await generator.generateSeeded(41414n);

    // Then
    expect(keypair).not.toBeUndefined();
    expect(keypair).not.toBeNull();
    expect(keypair).toHaveProperty("p");
    expect(keypair).toHaveProperty("q");
});

import { KeyPair, PublicComponent, SeededRSA } from "../src/index";

test("Keypair can encrypt/decrypt data within N limit", async () => {
    // Given
    let generator = new SeededRSA(2048, 65537);
    let keypair = await generator.generateSeeded(123n);

    // When/then
    let encrypted = keypair.encrypt("Hello world");

    expect(typeof encrypted).toBe("string");

    let decrypted = keypair.decrypt(encrypted);

    expect(decrypted).toBe("Hello world");
});

test("Cannot decrypt message without propper private key", async () => {
    // Given
    let generator = new SeededRSA(2048, 65537);
    let keypair1 = await generator.generateSeeded(123n);
    let keypair2 = await generator.generateSeeded(456n);

    // When/then
    let encrypted = keypair1.encrypt("Hello world");

    expect(typeof encrypted).toBe("string");

    let decrypted = keypair2.decrypt(encrypted);

    expect(decrypted).not.toBe("Hello world");
});

test("Keypair can encrypt/decrypt data that's longer than N limit", async () => {
    // Given
    let generator = new SeededRSA(2048, 65537);
    let keypair = await generator.generateSeeded(123n);

    let message = "Hello world".repeat(256);

    // When/then
    let encrypted = keypair.encrypt(message);

    expect(typeof encrypted).toBe("string");

    let decrypted = keypair.decrypt(encrypted);

    expect(decrypted).toBe(message);
});

test("Keypair can sign message that is within the N limit", async () => {
    // Given
    let generator = new SeededRSA(2048, 65537);
    let keypair = await generator.generateSeeded(123n);

    let message = "Hello world";

    // When/then
    let signature = keypair.sign(message);

    expect(signature).not.toBeUndefined();
    expect(signature).not.toBeNull();

    let checked = keypair.checkSignature(message, signature);

    expect(checked).toBe(true);
});

test("Signature is invalid when checked with the incorrect public component", async () => {
    // Given
    let generator = new SeededRSA(2048, 65537);
    let keypair1 = await generator.generateSeeded(123n);
    let keypair2 = await generator.generateSeeded(456n);

    let message = "Hello world";

    // When/then
    let signature = keypair1.sign(message);

    expect(signature).not.toBeUndefined();
    expect(signature).not.toBeNull();

    let checked = keypair2.checkSignature(message, signature);

    expect(checked).toBe(false);
});

test("Keypair can sign message that is longer than the N limit", async () => {
    // Given
    let generator = new SeededRSA(2048, 65537);
    let keypair = await generator.generateSeeded(123n);

    let message = "Hello world".repeat(256);

    // When/then
    let signature = keypair.sign(message);

    expect(signature).not.toBeUndefined();
    expect(signature).not.toBeNull();

    let checked = keypair.checkSignature(message, signature);

    expect(checked).toBe(true);
});

test("Longer than N incorrect signature is not valid", async () => {
    // Given
    let generator = new SeededRSA(2048, 65537);
    let keypair = await generator.generateSeeded(123n);

    let message = "Hello world".repeat(256);
    let tamperedMessage = message + " and you owe me money";

    // When/then
    let signature = keypair.sign(message);

    expect(signature).not.toBeUndefined();
    expect(signature).not.toBeNull();

    let checked = keypair.checkSignature(tamperedMessage, signature);

    expect(checked).toBe(false);
});

test("Keypair can be formatted to a string and back", async () => {
    // Given
    let generator = new SeededRSA(2048, 65537);
    let keypair = await generator.generateSeeded(123n);

    // When/then
    let keypairString = keypair.toString();

    expect(keypairString).not.toBeUndefined();
    expect(keypairString).not.toBeNull();

    let keypair2 = KeyPair.fromString(keypairString);

    expect(keypair2.p).toBe(keypair.p);
    expect(keypair2.q).toBe(keypair.q);
});

test("Public component can be extracted from keypair", async () => {
    // Given
    let generator = new SeededRSA(2048, 65537);
    let keypair = await generator.generateSeeded(123n);

    // When
    let publicComponent = keypair.extractPublicComponent();

    // Then
    expect(publicComponent).toBeInstanceOf(PublicComponent);
    expect(publicComponent).not.toBeUndefined();
    expect(publicComponent).not.toBeNull();
    expect(publicComponent).toHaveProperty("N");
    expect(publicComponent).toHaveProperty("e");
    expect(publicComponent.N).toBe(keypair.N);
    expect(publicComponent.e).toBe(keypair.e);
});

test("Public component can be used to encrypt data", async () => {
    // Given
    let generator = new SeededRSA(2048, 65537);
    let keypair = await generator.generateSeeded(123n);
    let publicComponent = keypair.extractPublicComponent();

    let message = "Hello world";

    // When
    let encrypted = publicComponent.encrypt(message);
    let decrypted = keypair.decrypt(encrypted);

    // Then
    expect(decrypted).toBe(message);
});

test("Public can be formatted to a string and back", async () => {
    // Given
    let generator = new SeededRSA(2048, 65537);
    let keypair = await generator.generateSeeded(123n);
    let publicComponent = keypair.extractPublicComponent();

    // When/then
    let publicComponentString = publicComponent.toString();

    expect(publicComponentString).not.toBeUndefined();
    expect(publicComponentString).not.toBeNull();

    let publicComponent2 = PublicComponent.fromString(publicComponentString);

    expect(publicComponent2.N).toBe(publicComponent.N);
    expect(publicComponent2.e).toBe(publicComponent.e);
});

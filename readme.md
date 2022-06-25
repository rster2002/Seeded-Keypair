# Seeded-Keypair

Library for generating RSA keypair using a seed.

## Installing

Install this package using NPM:

```bash
npm install seeded-keypair
```

## Usage

### Generating a seeded key

Generating a keypair using the seeded generator requires passing a bigint as the seed. This could be a key derived from
using something like PBKDF2.

```ts
import { SeededRSA } from "seeded-keypair";

// length of key, e (default 65537)
let generator = new SeededRSA(2048);

// Seed to be used for key generation
let keypair = await generator.generateSeeded(14318751325n);
```

Using the keypair is described below.

### Generating a cryptographic key

For completeness’s sake, the library also includes a method for generating a keypair using the browser's crypto API.

```ts
import { CryptoRSA } from "seeded-keypair";

// length of key, e (default 65537)
let generator = new CryptoRSA(2048);

// Seed to be used for key generation
let keypair = await generator.generateKeypair();
```

### Using keypair

A keypair is an object that inherits from `PublicComponent` and contains the private components of the key. This can be
used to decrypt messages and sign messages that the public component can encrypt and verify.

#### Encrypt

Encrypts the message and returns the encrypted string. Long messages are split into chunks based on the length of the key. Each chunk is encoded in base64 and separated by $ characters.

```ts
let encrypted = keypair.encrypt("Hello world!");
```

#### Decrypt

Pass an encrypted message (base64 format) generated using the encrypt method described above, and it returns the
original message.

```ts
let decrypted = keypair.decrypt(encrypted);
```

#### Sign

Returns a base64 encoded string that can be used to verify the message passed in.

> **Note**
> Be sure to also include a seed as part of the message. Here it's missing for demonstration purposes.

```ts
let signature = keypair.sign("Hello world!");
```

#### Verify signature

Pass a message and a signature and the method returns whether the signature matches the message.

```ts
// message, signature
let signatureValid = keypair.checkSignature("Hello world!", signature);
```

#### To string representation

Returns a string containing the **private** components of the keypair. This can be used to store the key in a cache. To
get a string that represents the public components, first extract the `PublicComponent` and use `toString()` on that.

```ts
let string = keypair.toString();
```

#### From string representation

Create a keypair object using a string generated using the `toString()` method described above.

```ts
let keypair = KeyPair.fromString(string);
```

#### Extract public component

Returns a `PublicComponent` object that only contains the public components of the keypair. This can be sent others to
encrypt messages or verify signatures.

```ts
let publicComponent = keypair.extractPublicComponent();
```

### Public component

The public component only contains the parts of the keypair that are safe to share. These can be used by others to
encrypt messages to send to you or verify messages that you created using the keypair using a signature.

#### Encrypt

Works the exact same way as the `encrypt()` method present on a keypair object.

```ts
let encrypted = publicComponent.encrypt("Hello world!");
```

#### Verify signature

Works the exact same way as the `checkSignature()` method present on a keypair object.

```ts
// message, signature
let signatureValid = publicComponent.checkSignature("Hello world!", signature);
```

#### To string representation

Returns a string containing the **public** components of the keypair. This can then be used to send the public component to a server or share it some other way.

```ts
let string = publicComponent.toString();
```

#### From string representation

Creates a `PublicComponent` object from a string that was created using the `toString()` method described above.

```ts
let publicComponent = PublicComponent.fromString(string);
```

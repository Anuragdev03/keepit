
export function randomStringGenerator(length = 10) {
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*";

    // Ensure at least one character from each category
    let result = [
        uppercase.charAt(Math.floor(Math.random() * uppercase.length)),
        lowercase.charAt(Math.floor(Math.random() * lowercase.length)),
        numbers.charAt(Math.floor(Math.random() * numbers.length)),
        symbols.charAt(Math.floor(Math.random() * symbols.length)),
    ].join("");

    // Fill the rest with random characters from all categories
    const allChars = uppercase + lowercase + numbers + symbols;
    for (let i = result.length; i < length; i++) {
        result += allChars.charAt(Math.floor(Math.random() * allChars.length));
    }

    // Shuffle the result to avoid predictable patterns
    return result
        .split("")
        .sort(() => Math.random() - 0.5)
        .join("");
}

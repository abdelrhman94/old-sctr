export function getLocaleFromCookie(): string {
    if (typeof window === "undefined") return "en"; 
    return (
        document.cookie
            .split("; ")
            .find((row) => row.startsWith("NEXT_LOCALE="))
            ?.split("=")[1] || "en"
    );
}

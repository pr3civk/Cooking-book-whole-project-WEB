export function clg(...args: unknown[]) {
    if (import.meta.env.NODE_ENV.toLowerCase().includes("dev")) {
        console.log(...args);
    }
}
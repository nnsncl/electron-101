export function DevMode(): boolean {
  return process.env.NODE_ENV === "development";
}

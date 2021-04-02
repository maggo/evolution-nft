export function timeout(ms: number) {
  return new Promise<void>((resolve, reject) => {
    let id = setTimeout(() => {
      clearTimeout(id);
      reject("TIMEOUT");
    }, ms);
  });
}

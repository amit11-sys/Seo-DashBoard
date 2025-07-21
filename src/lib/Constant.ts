export function debounce<T extends (...args: any[]) => void>(fn: T, delay: number) {
  let timer: ReturnType<typeof setTimeout> | null;

  const debounced = (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };

  // debounced.cancel = () => {
  //   if (timer) {
  //     clearTimeout(timer);
  //     timer = null;
  //   }
  // };

  return debounced;
}

export const defaultSearchVolume=0;

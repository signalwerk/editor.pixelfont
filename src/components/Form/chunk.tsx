
export const chunk = (a: any, n: any) => [...Array(Math.ceil(a.length / n))].map((_, i) => a.slice(n * i, n + n * i));

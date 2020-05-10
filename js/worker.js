onmessage = e => {
  let a = 0;
  const iterations = 10000000000 * e.data.priority;
  for (let i = 0; i < iterations; i++) a++;
  postMessage({...e.data});
}
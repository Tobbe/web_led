const url = "https://least-despite-outlets-crossword.trycloudflare.com";

export async function handleMessage(msg) {
  console.log("Handling message:", msg);

  if (msg.toLowerCase().includes("led on")) {
    // curl -X POST -d LED_ON https://span-pat-blues-carmen.trycloudflare.com
    console.log("Firing off a fetch with LED_ON");
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: "LED_ON",
    });
    console.log("Fetch response:", res);
  } else if (msg.toLowerCase().includes("led off")) {
    // curl -X POST -d LED_OFF https://span-pat-blues-carmen.trycloudflare.com
    console.log("Firing off a fetch with LED_OFF");
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: "LED_OFF",
    });
    console.log("Fetch response:", res);
  }
}

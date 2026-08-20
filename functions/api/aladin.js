export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const isbn = (url.searchParams.get("isbn") || "").replace(/[^0-9Xx]/g, "");

  if (!isbn) {
    return Response.json({ found: false, error: "missing_isbn" }, { status: 400 });
  }

  const key = context.env.ALADIN_TTB_KEY;
  if (!key) {
    return Response.json({ found: false, error: "missing_server_key" }, { status: 500 });
  }

  const api = new URL("https://www.aladin.co.kr/ttb/api/ItemLookUp.aspx");
  api.searchParams.set("ttbkey", key);
  api.searchParams.set("itemIdType", isbn.length >= 13 ? "ISBN13" : "ISBN");
  api.searchParams.set("ItemId", isbn);
  api.searchParams.set("output", "js");
  api.searchParams.set("Version", "20131101");
  api.searchParams.set("Cover", "Big");

  const upstream = await fetch(api.toString(), {
    headers: { "User-Agent": "Harang-Elementary-Library/1.0" }
  });

  if (!upstream.ok) {
    return Response.json({ found: false, error: "upstream_error" }, { status: 502 });
  }

  const data = await upstream.json();
  const item = Array.isArray(data.item) ? data.item[0] : null;

  if (!item) {
    return Response.json({ found: false }, {
      headers: { "Cache-Control": "public, max-age=3600" }
    });
  }

  return Response.json({
    found: true,
    title: item.title || "",
    author: item.author || "",
    publisher: item.publisher || "",
    pubDate: item.pubDate || "",
    description: item.description || "",
    cover: item.cover || "",
    isbn: item.isbn || "",
    isbn13: item.isbn13 || ""
  }, {
    headers: {
      "Cache-Control": "public, max-age=86400",
      "Content-Type": "application/json; charset=utf-8"
    }
  });
}

import type { NextRequest } from "next/server";
import * as cheerio from "cheerio";
import type { Element } from "domhandler";

const API_KEY = process.env.SCRAPER_API_KEY;

// ---------- GET function for web scrapping the receipt data -----------------
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const scrapeLink = searchParams.get("link");
    if (!scrapeLink) {
      return new Response(
        JSON.stringify({
          error:
            "Server-side error: Missing web scrapping link in query parameter.",
        }),
        {
          status: 500,
        },
      );
    }

    console.log(scrapeLink);
    console.log(encodeURIComponent(scrapeLink));
    console.log(API_KEY);
    const response = await fetch(
      `http://api.scraperapi.com?api_key=${API_KEY}&url=${encodeURIComponent(scrapeLink)}`,
      {
        method: "GET",
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.5",
          "Accept-Encoding": "gzip, deflate, br",
          Connection: "keep-alive",
          "Upgrade-Insecure-Requests": "1",
          "Sec-Fetch-Dest": "document",
          "Sec-Fetch-Mode": "navigate",
          "Sec-Fetch-Site": "none",
          "Cache-Control": "max-age=0",
          Referer: "https://mev.sfs.md/",
        },
      },
    );

    console.log(response);
    const htmlContent = await response.text();

    console.log(htmlContent);

    const $ = cheerio.load(htmlContent);

    const element = $("#newFormTest");
    if (!element?.length) {
      return new Response(JSON.stringify({ error: "Element not found" }), {
        status: 500,
      });
    }

    // --------- extracting: --------------
    // ---------------------- COMPANY NAME, FISCAL CODE, ADDRESS, AND REGISTRATION NUMBER -------------
    const data: string[] = [];

    $("p.text-gray-600.text-xs").each((i, el) => {
      const text = $(el).text().trim();
      if (text) data.push(text);
    });
    const companyName = data[0];
    const fiscalCode = data
      .find((t) => t.includes("COD FISCAL"))
      ?.replace("COD FISCAL:", "")
      .trim();
    const address = data[2];
    const registrationNumber = data
      .find((t) => t.includes("NUMARUL DE ÎNREGISTRARE"))
      ?.replace("NUMARUL DE ÎNREGISTRARE:", "")
      .trim();

    console.log({
      companyName,
      fiscalCode,
      address,
      registrationNumber,
    });

    // ------------------------ PRODUCTS, QUANTITY, PRICE, TOTAL PRICE ----------------------------
    // raw unformatted data is extracted
    const texts = $("div > div > div > span")
      .toArray()
      .map((el: Element) => $(el).text().trim());
    // data is formatted
    const products = [];
    for (let i = 0; i < texts.length; i++) {
      const line = texts[i]?.trim();

      // find lines in the form "qty x price"
      const match = line?.match(/^(\d+(?:\.\d+)?)\s*x\s*(\d+(?:\.\d+)?)/);
      if (match) {
        const name = texts[i - 1]?.trim(); // the previous line is the product's name
        const quantity = parseFloat(match[1] ?? "");
        const price = parseFloat(match[2] ?? "");

        // extract total price number from line like "20.35 A" (second to next line)
        const totalLine = texts[i + 2]?.trim();
        const totalMatch = totalLine?.match(/^(\d+(?:\.\d+)?)/);
        const totalPrice = totalMatch ? parseFloat(totalMatch[1] ?? "") : null;

        if (
          name &&
          !isNaN(quantity) &&
          !isNaN(price) &&
          !isNaN(totalPrice ?? 0)
        ) {
          products.push({ name, quantity, price, totalPrice });
        }
      }
    }

    // --------------------------- TOTAL, DATETIME, NO. OF RECEIPT -------------------------------
    let total = null;
    let date = null;
    let time = null;
    let receiptNumber = null;

    for (let i = 0; i < texts.length; i++) {
      const line = texts[i]?.trim();
      if (line === "TOTAL") {
        const nextLine = texts[i + 1]?.trim();
        if (!isNaN(parseFloat(nextLine ?? ""))) {
          total = parseFloat(nextLine ?? "");
        }
      }
      if (line?.startsWith("DATA")) {
        const dateRegex = /(\d{2}\.\d{2}\.\d{4})/;
        const match = dateRegex.exec(line);
        if (match) date = match[1];
      }
      if (line?.startsWith("ORA")) {
        const timeRegex = /(\d{2}:\d{2}:\d{2})/;
        const match = timeRegex.exec(line);
        if (match) time = match[1];
      }
    }

    for (let i = texts.length - 1; i >= 0; i--) {
      const val = texts[i]?.trim();
      if (/^\d+$/.test(val ?? "")) {
        receiptNumber = val;
        break;
      }
    }

    // convert to DateTimeFormat
    let dateTime = null;
    if (date && time) {
      const [day, month, year] = date.split(".");
      dateTime = new Date(`${year}-${month}-${day}T${time}`);
    }

    // receipt data
    const receiptData = {
      company: {
        name: companyName,
        fiscalCode: fiscalCode,
        address: address,
        registrationNumber,
      },
      products, //{ name, quantity, price, totalPrice }
      totalAmount: total,
      receiptNumber: receiptNumber,
      dateTime: dateTime ? dateTime.toISOString() : null,
    };

    if (!products.length) {
      return new Response(JSON.stringify({}), { status: 500 });
    }

    return new Response(JSON.stringify(receiptData), { status: 200 });
  } catch (e) {
    console.error("Server-side error during web scrapping: ", e);
    return new Response(JSON.stringify({}), { status: 500 });
  }
}

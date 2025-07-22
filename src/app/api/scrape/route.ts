import type { NextRequest } from "next/server";
import puppeteer, { type Browser } from "puppeteer";
import puppeteerCore, { type Browser as BrowserCore } from "puppeteer-core";
import chromium from "@sparticuz/chromium-min";
import * as cheerio from "cheerio";
import type { Element } from "domhandler";

// ---------- GET function for web scrapping the receipt data -----------------
export async function GET(req: NextRequest) {
  let browser: Browser | BrowserCore;
  if (process.env.NODE_ENV === "production") {
    const executablePath = await chromium.executablePath(
      "https://github.com/Sparticuz/chromium/releases/download/v131.0.1/chromium-v131.0.1-pack.tar",
    );
    browser = await puppeteerCore.launch({
      executablePath,
      args: chromium.args,
      headless: true,
    });
  } else {
    browser = await puppeteer.launch();
  }

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

    const page = await (browser as Browser).newPage();
    await page.setViewport({
      width: 1920,
      height: 1080,
    });
    await page.goto(scrapeLink, {
      waitUntil: "networkidle0",
    });

    await page.waitForSelector("#newFormTest");
    const htmlContent = await page.$eval("#newFormTest", (el) => el.innerHTML);

    const $ = cheerio.load(htmlContent);

    // --------- extracting: --------------
    // ---------------------- COMPANY NAME, FISCAL CODE, ADDRESS, AND REGISTRATION NUMBER -------------
    const companyName = $("div > div > div").first().text().trim();
    const fiscalCode = $("div > div > div")
      .eq(1)
      .text()
      .trim()
      .replace(/\D/g, ""); // extract only the digits
    const address = $("div > div > div").eq(2).text().trim();
    const registartionNo = $("div > div > div")
      .eq(3)
      .text()
      .trim()
      .replace(/\D/g, ""); // extract only the digits

    // ------------------------ PRODUCTS, QUANTITY, PRICE, TOTAL PRICE ----------------------------
    // raw unformatted data is extracted
    const texts = $("div > div > div > span")
      .map((i: number, el: Element) => $(el).text().trim())
      .get();
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
        registrationNumber: registartionNo,
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
  } finally {
    await browser.close();
  }
}

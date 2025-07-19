import Upload from "~/components/client/upload";
import { Loader2 } from "lucide-react";

const puppeteer = require("puppeteer");
const cheerio = require("cheerio");

export default async function Uploadpage({
  searchParams,
}: {
  searchParams: Promise<{ scrapeLink: string }>;
}) {
  const { scrapeLink } = await searchParams;

  if (scrapeLink) {
    console.log(`the scrape link:  ${scrapeLink}`);
    // return <Loader2 className="mx-auto my-72 text-muted-foreground animate-spin"/>
    console.log("started scrapping");
    scrapeByLink(scrapeLink);
    console.log("finished scrapping");
  }

  return (
    <div>
      <Upload />
    </div>
  );
}

const scrapeByLink = async (link: string) => {
  const browser = await puppeteer.launch();

  try {
    const page = await browser.newPage();
    await page.setViewport({
      width: 1920,
      height: 1080,
    });
    await page.goto(link, {
      waitUntil: "networkidle0",
    });

    await page.waitForSelector("#newFormTest");
    const htmlContent = await page.$eval(
      "#newFormTest",
      (el: any) => el.innerHTML,
    );
    console.log(" The content found:   ", htmlContent);

    const $ = cheerio.load(htmlContent);

    // ---------------------- COMPANY NAME, FISCAL CODE, ADDRESS, AND REGISTRATION NUMBER -------------
    const companyName = $("div > div > div").first().text().trim();
    const fiscalCode = $("div > div > div").eq(1).text().trim().replace(/\D/g, ''); ;
    const address = $("div > div > div").eq(2).text().trim();
    const registartionNo = $("div > div > div").eq(3).text().trim().replace(/\D/g, ''); ;

    console.log(
      `!!!!!! general data:  !${companyName}!  \n  !${fiscalCode}! \n  !${address}! \n  !${registartionNo}!`,
    );

    // ------------------- PRODUCTS, QUANTITY, PRICE, TOTAL PRICE --------------------

    // raw unformatted data extracted
    const texts = $("div > div > div > span")
      .map((i: number, el: React.ReactElement) => $(el).text().trim())
      .get();

    console.log("texts: ", texts);
    const products = [];
    for (let i = 0; i < texts.length; i++) {
      const line = texts[i].trim();

      // Match format "qty x price"
      const match = line.match(/^(\d+(?:\.\d+)?)\s*x\s*(\d+(?:\.\d+)?)/);
      if (match) {
        const name = texts[i - 1]?.trim();
        const quantity = parseFloat(match[1]);
        const price = parseFloat(match[2]);

        // Extract total price number from line like "20.35 A"
        const totalLine = texts[i + 2]?.trim();
        const totalMatch = totalLine?.match(/^(\d+(?:\.\d+)?)/);
        const totalPrice = totalMatch ? parseFloat(totalMatch[1]) : null;

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

    console.log("!!!!!!!!! products: ", products);

    // -------------------- TOTAL, DATETIME, NO. OF RECEIPT ---------------------
    let total = null;
    let date = null;
    let time = null;
    let receiptNumber = null;

    for (let i = 0; i < texts.length; i++) {
      const line = texts[i].trim();

      if (line === "TOTAL") {
        const nextLine = texts[i + 1]?.trim();
        if (!isNaN(parseFloat(nextLine))) {
          total = parseFloat(nextLine);
        }
      }

      if (line.startsWith("DATA")) {
        const match = line.match(/(\d{2}\.\d{2}\.\d{4})/);
        if (match) date = match[1];
      }

      if (line.startsWith("ORA")) {
        const match = line.match(/(\d{2}:\d{2}:\d{2})/);
        if (match) time = match[1];
      }
    }

    for (let i = texts.length - 1; i >= 0; i--) {
      const val = texts[i].trim();
      if (/^\d+$/.test(val)) {
        receiptNumber = val;
        break;
      }
    }
    let dateTime = null;
    if (date && time) {
      const [day, month, year] = date.split(".");
      dateTime = new Date(`${year}-${month}-${day}T${time}`);
    }

    console.log({ total, date, time, receiptNumber, dateTime });
  } catch (e) {
    console.log("Error: ", e);
  } finally {
    await browser.close();
  }
};

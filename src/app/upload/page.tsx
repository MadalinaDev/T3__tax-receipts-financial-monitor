// import Upload from "~/components/client/upload";
import UploadWebScrapper from "~/components/client/uploadWebScrapper";
import Upload from "~/components/client/upload";

export default async function UploadPage({
  searchParams,
}: {
  searchParams: Promise<{ scrapeLink: string }>;
}) {
  const { scrapeLink } = await searchParams;

  if (scrapeLink) return <UploadWebScrapper scrapeLink={scrapeLink} />;
  return <Upload />;
}

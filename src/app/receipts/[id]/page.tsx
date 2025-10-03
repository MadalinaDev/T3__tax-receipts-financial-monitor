import ReceiptDetails from "~/components/client/receiptPage/receiptDetails";
import { api } from "~/trpc/server";

const ReceiptPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const receipt = await api.receipts.getOne({
    id,
  });

  return <ReceiptDetails receipt={receipt} />;
};

export default ReceiptPage;

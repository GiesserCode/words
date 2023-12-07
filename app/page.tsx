import { getAccounts } from "@/app/lib/data";

export default async function Home() {
  const someText = await getAccounts();

  return <section>here should be a name: {someText}</section>;
}

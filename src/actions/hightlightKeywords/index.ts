import { highlightKeyword } from "./queries";

export default async function sethighlightKeyword(url: string) {
const data = await highlightKeyword(url);
return data
}

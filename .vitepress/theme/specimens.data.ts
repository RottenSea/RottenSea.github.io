import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { DS_BASE, designSystemDir } from "../design-system";

export interface Specimen {
  /** URL of the specimen page. */
  src: string;
  name: string;
  subtitle: string;
  /** Height the page was drawn for, used until the iframe reports its own. */
  height: number;
}

export interface SpecimenGroup {
  name: string;
  specimens: Specimen[];
}

declare const data: SpecimenGroup[];
export { data };

const guidelinesDir = join(designSystemDir, "guidelines");

const decode = (text: string) =>
  text.replaceAll("&amp;", "&").replaceAll("&lt;", "<").replaceAll("&gt;", ">").replaceAll("&quot;", '"');

// Every specimen page opens with a comment such as
// <!-- @dsCard group="Colors" viewport="700x130" name="Cream surfaces" subtitle="..." -->
// Files are numbered in reading order, so sorting by name keeps the groups and pages in order.
// Restart the dev server after adding a specimen page; the list is read once.
export default {
  load(): SpecimenGroup[] {
    const groups = new Map<string, Specimen[]>();
    for (const file of readdirSync(guidelinesDir).filter((f) => f.endsWith(".html")).sort()) {
      const header = readFileSync(join(guidelinesDir, file), "utf8").match(/^<!--\s*@dsCard(.*?)-->/)?.[1] ?? "";
      const attr = (key: string) => decode(header.match(new RegExp(`${key}="([^"]*)"`))?.[1] ?? "");
      const group = attr("group") || "Other";
      const specimens = groups.get(group) ?? [];
      specimens.push({
        src: `${DS_BASE}guidelines/${file}`,
        name: attr("name") || file,
        subtitle: attr("subtitle"),
        height: Number(attr("viewport").split("x")[1]) || 200,
      });
      groups.set(group, specimens);
    }
    return [...groups].map(([name, specimens]) => ({ name, specimens }));
  },
};

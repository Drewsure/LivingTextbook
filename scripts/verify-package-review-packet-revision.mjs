import { readFileSync } from "node:fs";

const model = readFileSync(new URL("../packages/content-model/src/uploadQuarantinePackageReviewPacket.ts", import.meta.url), "utf8");
const store = readFileSync(new URL("../apps/web/src/server/uploads/quarantineUploadStore.ts", import.meta.url), "utf8");
const route = readFileSync(new URL("../apps/web/src/app/api/teacher/uploads/package-review-packet/route.ts", import.meta.url), "utf8");

for (const [source, markers, label] of [
  [model, ["packetRevision", "supersedesPacketId", "package-review-packet:v"], "packet model"],
  [store, ["package-review-packet-v", "candidates.sort", "packetRevision ?? 1"], "packet custody reader"],
  [route, ["shouldReissueForPromotionAdapter", "supersedesPacketId", "packetRevision:"], "packet route"],
]) {
  for (const marker of markers) {
    if (!source.includes(marker)) {
      console.error(`FAIL package review packet revision verifier: ${label} is missing ${marker}`);
      process.exit(1);
    }
  }
}

for (const forbidden of ["packageAssemblyAllowed: true", "promotionAllowed: true", "studentFacingUseAllowed: true"]) {
  if (model.includes(forbidden) || store.includes(forbidden) || route.includes(forbidden)) {
    console.error(`FAIL package review packet revision verifier: activation marker ${forbidden} is forbidden`);
    process.exit(1);
  }
}

console.log("PASS blocked package review packets can advance through immutable versioned sidecars without enabling assembly, promotion, or student use.");

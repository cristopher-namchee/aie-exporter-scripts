import defaultScript from "./default";

import bcaBankStatement from "./bca/bank-statement";
import bcaSKPR from "./bca/skpr";

export default {
  default: defaultScript,
  "bca.bank-statement": bcaBankStatement,
  "bca.skpr": bcaSKPR,
};

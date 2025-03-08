import { NodeImage } from "@vibrant/image-node";
import "./configs/config.js";
import { pipeline } from "./pipeline/index.js";
import { Vibrant } from "@vibrant/core";
import { Vibrant as Vibrant2 } from "@vibrant/core";
Vibrant.DefaultOpts.ImageClass = NodeImage;
Vibrant.use(pipeline);
export {
  Vibrant2 as Vibrant
};
//# sourceMappingURL=node.js.map

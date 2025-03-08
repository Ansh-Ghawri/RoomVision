"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const image = require("@vibrant/image");
const configure = require("@jimp/custom");
const types = require("@jimp/types");
const resize = require("@jimp/plugin-resize");
const Jimp = configure({
  types: [types],
  plugins: [resize]
});
const URL_REGEX = /^(\w+):\/\/.*/i;
class NodeImage extends image.ImageBase {
  _getImage() {
    if (!this._image) {
      throw new Error("Image not loaded");
    }
    return this._image;
  }
  async _loadByProtocolHandler(src) {
    const res = await fetch(src, {
      method: "GET"
    });
    if (!res.ok || !res.body) {
      throw new Error(`Failed to fetch ${src}`);
    }
    const stream = res.body.getReader();
    const chunks = [];
    let done = false;
    while (!done) {
      const { value, done: doneValue } = await stream.read();
      if (value) {
        chunks.push(value);
      }
      done = doneValue;
    }
    return Buffer.concat(chunks);
  }
  _loadFromPath(src) {
    const m = URL_REGEX.exec(src);
    if (m) {
      return this._loadByProtocolHandler(src).then(
        (buf) => this._loadByJimp(buf)
      );
    } else {
      return this._loadByJimp(src);
    }
  }
  _loadByJimp(src) {
    return Jimp.read(src).then((result) => {
      this._image = result;
      return this;
    });
  }
  load(image2) {
    if (typeof image2 === "string") {
      return this._loadFromPath(image2);
    } else if (image2 instanceof Buffer) {
      return this._loadByJimp(image2);
    } else {
      return Promise.reject(
        new Error(
          "Cannot load image from HTMLImageElement in node environment"
        )
      );
    }
  }
  clear() {
  }
  update(_imageData) {
  }
  getWidth() {
    return this._getImage().bitmap.width;
  }
  getHeight() {
    return this._getImage().bitmap.height;
  }
  resize(targetWidth, targetHeight, _ratio) {
    this._getImage().resize(targetWidth, targetHeight);
  }
  getPixelCount() {
    const bitmap = this._getImage().bitmap;
    return bitmap.width * bitmap.height;
  }
  getImageData() {
    return this._getImage().bitmap;
  }
  remove() {
  }
}
exports.NodeImage = NodeImage;
//# sourceMappingURL=index.cjs.map
